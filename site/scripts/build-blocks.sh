#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# name:
#   build-blocks.sh -- build blocks from source to be published through nextjs
#
# synopsis:
#   build-blocks.sh [...build-config]
#
# description:
#   This script is a pre-build script for nextjs. For each given build-config
#   the script will download the latest snapshot of the specified branch,
#   `yarn install` its [dev]dependencies and build it through `yarn build`.
#   The build output will then be positioned to be picked up by nextjs' build
#   procedure. If no build-config is provided, the script will use all those
#   changed by the last commit.
# ------------------------------------------------------------------------------

set -e          # exit on error
set -u          # prevent access to yet undeclared variables
set -o pipefail # prevent error masking in pipes

# util
# ----
function log() {
  printf "[%s][%s] %s\n" "$1" "$(date +"%FT%T")" "$2" >&2
}

## x-platform readline (linux, macOS)
function abs() {
  if [[ -d "$1" ]]; then
    echo $(cd "$1"; echo "$PWD")
  else
    echo $(cd "${1%/*}"; echo "$PWD/${1##*/}")
  fi
}

# conf
# ----
DIR=$(abs "${BASH_SOURCE[0]%/*}")
REPO_ROOT="$DIR/../.."

# deps
# ----
if [[ "${VERCEL:-}" -ne "" ]]; then
  yum -q -y install jq rsync
else
  if ! command -v jq > /dev/null; then
    log error "missing commandline tool 'jq'"
    exit 1
  fi

  if ! command -v rsync > /dev/null; then
    log error "missing commandline tool 'rsync'"
    exit 2
  fi
fi

# prep
# ----
log info "launching block builder"

log debug "preping the field"
TMP=$(mktemp -d)

onexit() {
  log debug "cleaning the field"
  rm -rf "$TMP"
}

trap onexit EXIT HUP INT QUIT PIPE TERM

# main
# ----

##
# used to build a block. if the given config no longer exists,
# its cached build is removed.
#
# @param build_config - path to any config in <repo-root>/hub
#
function build_block {
  build_config="$1"

  # create block specific subfolder in nextjs' static root
  public_dir="${REPO_ROOT}/site/public/blocks/${build_config##*/hub/}"
  public_dir="${public_dir%\.json}"

  log info "building ${build_config}"
  mkdir -p "$public_dir"

  # read in block config
  workspace=$(jq -r '.workspace' < "$build_config")
  branch=$(jq -r '.branch' < "$build_config")
  dist_dir=$(jq -r '.distDir' < "$build_config")
  repo_url=$(jq -r '.repository' < "$build_config")

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

    zip_url="${zip_url:0:8}@${zip_url:8}"

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

  log info "installing and building"
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
}

if [[ $# -gt 0 ]]; then
  log info "building block configs given as commandline arguments"

  for build_config in "${@:1}"; do
    build_config=$(abs "$build_config")
    build_block "$build_config"
  done
else
  log info "building block configs changed by last commit"

  for build_config in $(git diff-tree --name-only --no-commit-id -r HEAD "${REPO_ROOT}/hub"); do
    build_config="${REPO_ROOT}/${build_config}"
    build_block "$build_config"
  done
fi

log info "finished w/o errors"
exit 0
