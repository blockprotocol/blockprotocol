#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# name:
#   build-blocks.sh -- build blocks from source to be published through nextjs
#
# synopsis:
#   build-blocks.sh
#
# description:
#   This script is a pre-build script for nextjs. The goal is to publish blocks.
#   For each changed block configurations the script will download the latest
#   snapshot of the specified branch, `yarn install` its [dev]dependencies and
#   build it through `yarn build`. The build output will then be positioned to
#   be picked up by nextjs' build procedure.
# ------------------------------------------------------------------------------

set -e # exit on error
set -u # prevent access to yet undeclared variables
set -o pipefail # prevent error masking in pipes

# conf
# ----
DIR=$(readlink -ne "${BASH_SOURCE[0]%/*}")
REPO_ROOT="$DIR/../.."

# util
# ----
function log {
  printf "[%s][%s] %s\n" "$1" "$(date +"%FT%T")" "$2" >&2
}

# deps
# ----
if ! command -v jq > /dev/null; then
  log debug "installing jq"
  yum -q -y install jq
fi

if ! command -v rsync > /dev/null; then
  log debug "installing rsync"
  yum -q -y install rsync
fi

if [[ -z "$GITHUB_ACCESS_TOKEN" ]]; then
  log error "missing environment variable GITHUB_ACCESS_TOKEN"
  exit 1
fi

# main
# ----
log info "launching block builder"

log debug "preping the field"
TMP=$(mktemp -d)

onexit () {
  log debug "cleaning the field"
  rm -rf "$TMP"
}

trap onexit EXIT HUP INT QUIT PIPE TERM

log info "looking for updates to the block registry"
for blockconfig in $(git diff-tree --name-only --no-commit-id -r HEAD "${REPO_ROOT}/registry"); do

  log info "found update at ${blockconfig}"
  blockconfig="${REPO_ROOT}/${blockconfig}"

  # create block specific subfolder in nextjs' static root
  public_dir="${REPO_ROOT}/site/public/blocks/${blockconfig##*/registry/}"
  public_dir="${public_dir%\.json}"

  # mirror git deletions
  if ! [[ -f "$blockconfig" ]]; then
    log info "removing cached build for removed ${blockconfig}"
    [[ -d "$public_dir" ]] && rm -rf "$public_dir"
    continue
  fi

  log info "rebuilding ${blockconfig}"
  mkdir -p "$public_dir"

  # read in block config
  workspace=$(jq -r '.workspace' < "$blockconfig")
  branch=$(jq -r '.branch' < "$blockconfig")
  dist_dir=$(jq -r '.distDir' < "$blockconfig")
  repo_url=$(jq -r '.repository' < "$blockconfig")

  # create unique hash for the snapshot (for lack of a commit hash)
  repo_hash=$(md5sum - <<< "${repo_url}${branch}" | cut -d' ' -f1)
  repo_path="${TMP}/${repo_hash}"

  # download repository branch snapshot if we haven't done so already
  if ! [[ -d "$repo_path" ]]; then
    mkdir -p "$repo_path"

    # add others as needed (gitlab, bitbucket)
    if [[ "$repo_url" =~ ^https://github\.com/.+\.git$ ]]; then
      zip_url="${repo_url%\.git}/archive/refs/heads/${branch}.zip"
    else
      log error "cannot handle repository url (yet): $url"
      exit 2
    fi

    log info "downloading ${zip_url}"

    # insert http basic auth credentials (https://<user:password>@domain.com)
    # cannot use curl's -u options because that would also require a password
    zip_url="${zip_url:0:8}${GITHUB_ACCESS_TOKEN}@${zip_url:8}"

    res=$(curl -sL -w '%{http_code}' -o "${repo_path}.zip" "$zip_url")

    if [[ $res -ne 200 ]]; then
      log error "could not reach remote resource ${zip_url} (code: ${res})"
      exit 3
    fi

    log info "unpacking zip-file"
    unzip -q "${repo_path}.zip" -d "$repo_path"
  fi

  inner_dir=$(ls "$repo_path" | head -n 1)
  log debug "pushd into ${repo_path}/${inner_dir}"
  pushd "${repo_path}/${inner_dir}"

  log info "installing, building and publishing ${blockconfig}"
  if [[ "$workspace" == "null" ]]; then
    # devDependencies are required
    NODE_ENV=development yarn install
    yarn build
    rsync -a --delete "${dist_dir}/" "$public_dir"
  else
    # devDependencies are required
    NODE_ENV=development yarn workspace "$workspace" install
    yarn workspace "$workspace" run build
    workspace_dir=$(yarn -s workspaces info | jq -r --arg ws "$workspace" '.[$ws].location')
    rsync -a --delete "${workspace_dir}/${dist_dir}/" "$public_dir"
  fi

  popd
  log debug "popd back to ${PWD}"

done;

log info "finished w/o errors"
exit 0