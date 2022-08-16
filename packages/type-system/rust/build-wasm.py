import subprocess
import json
from pathlib import Path
from typing import Dict
import logging


def run_wasm_pack(target, out_dir: Path):
    logging.debug("Running wasm-pack, targeting %s, for %s", target, out_dir)
    subprocess.run(["wasm-pack", "build", "--target", target, "--out-dir", str(out_dir), "--out-name", "index", "--scope", "blockprotocol"])


def patch_package_json(file: Path, unique_patch: Dict):
    logging.debug("Patching %s", str(file))

    patch = {
        "homepage": "https://blockprotocol.org",
        "repository": {
            "type": "git",
            "url": "git@github.com:blockprotocol/blockprotocol.git",
            "directory": "packages/react-block-loader"
        },
        "license": "MIT",
        "author": {
            "name": "HASH",
            "url": "https://hash.ai"
        },
    }
    patch.update(unique_patch)

    with file.open("r+") as fp:
        contents = json.load(fp)
        fp.seek(0)
        contents.update(patch)
        json.dump(contents, fp)


def run_prettier(path: Path):
    logging.debug("Running prettier on %s", path)
    subprocess.run(["yarn", "prettier", "--write", str(path)])


def build_package(path: Path, target: str, patch: Dict):
    run_wasm_pack(target, path)
    package_json = (path / "package.json").resolve(True)
    patch_package_json(package_json, patch)
    run_prettier(package_json)


def main():
    web_patch = {"name": "@blockprotocol/type-system-web"}
    build_package(Path("../ts/type-system-web"), "web", web_patch)

    node_patch = {"name": "@blockprotocol/type-system-node"}
    build_package(Path("../ts/type-system-node"), "nodejs", node_patch)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    main()
