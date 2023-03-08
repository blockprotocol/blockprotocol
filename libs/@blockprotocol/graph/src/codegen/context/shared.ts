import { VersionedUrl } from "@blockprotocol/type-system/slim";

import { mustBeDefined } from "../../shared/util/must-be-defined.js";

type TypeDependencies = {
  versionedUrl: VersionedUrl;
  dependencies: TypeDependencies[];
};

/**
 * We want to map every type to their dependencies, however trying to maintain this as a set of plain `Record`s would be
 * difficult as we'd then have to search inside other `Record`'s to find ones that contain this type to update those as
 * well.
 *
 * This map instead uses a collection of object references to represent the dependency graph, which also gracefully
 * allows us to ignore difficulties of circular dependencies.
 */
export class TypeDependencyMap {
  private readonly dependencyMap: Record<VersionedUrl, TypeDependencies> = {};

  addDependencyForType(typeUrl: VersionedUrl, dependency: VersionedUrl) {
    this.dependencyMap[dependency] ??= {
      versionedUrl: dependency,
      dependencies: [],
    };

    this.dependencyMap[typeUrl] ??= { versionedUrl: typeUrl, dependencies: [] };
    this.dependencyMap[typeUrl]!.dependencies.push(
      this.dependencyMap[dependency]!,
    );
  }

  getDependenciesForType(typeUrl: VersionedUrl): Set<VersionedUrl> {
    const flattenedDependencies = new Set<VersionedUrl>();

    const dependencyQueue = [this.dependencyMap[typeUrl]] ?? [];

    while (dependencyQueue.length > 0) {
      const dependencies = mustBeDefined(dependencyQueue.pop());

      if (flattenedDependencies.has(dependencies.versionedUrl)) {
        continue;
      }

      flattenedDependencies.add(dependencies.versionedUrl);
      dependencyQueue.push(...dependencies.dependencies);
    }

    return flattenedDependencies;
  }
}
