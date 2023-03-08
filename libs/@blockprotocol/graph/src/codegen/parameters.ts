import {
  validateVersionedUrl,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";

import { typedEntries, typedKeys } from "../shared/util/typed-object-iter.js";

/**
 * The input parameters of Codegen, prior to their validation.
 */
export type CodegenParameters = {
  /** Files, and the types to generate within them */
  targetRoot: string;
  targets: {
    [fileName: string]: [
      {
        versionedUrl: VersionedUrl;
        /** Whether to generate helper types which mark this Entity Type as the Block Entity */
        blockEntity?: boolean;
      },
    ];
  };
  typeNameOverrides?: {
    [versionedUrl: string]: string;
  };
  /** Generate look-up maps with aliases for all type URLs */
  versionedUrlAliases?:
    | { enabled: false }
    | {
        enabled: true;
        /** Override the generated name for certain aliases */
        overrides?: {
          [versionedUrl: string]: string;
        };
      };
  /* @todo - Add support for generating Base URL aliases? */
  /* @todo - Make the resolve depth configurable */
  temporal?: boolean;
};

export const validateCodegenParameters = (
  parameters: unknown,
): { errors: string[] } | undefined => {
  const errors: string[] = [];

  if (typeof parameters !== "object" || parameters === null) {
    return { errors: ["Parameters must be an object"] };
  }

  const {
    targetRoot,
    targets,
    typeNameOverrides,
    versionedUrlAliases,
    temporal,
  } = parameters as Record<string, unknown>;

  if (typeof targetRoot !== "string") {
    errors.push("`targetRoot` must be a string pointing to a directory");
  }

  if (
    !(
      typeof targets === "object" &&
      targets !== null &&
      !Array.isArray(targets)
    )
  ) {
    errors.push("`targets` must be an object");
  } else {
    for (const [fileName, targetsForFile] of Object.entries(targets)) {
      if (!Array.isArray(targetsForFile)) {
        errors.push(`file '${fileName}' in 'targets' must be an array`);
      } else {
        for (const target of targetsForFile) {
          if (!(typeof target === "object" && target !== null)) {
            errors.push(
              `each entry under file '${fileName}' in 'targets' must be an object`,
            );
            continue;
          }
          if (typeof target.versionedUrl !== "string") {
            errors.push(
              `each entry under file '${fileName}' in 'targets' must have a 'versionedUrl' string`,
            );
          }
          if (!validateVersionedUrl(target.versionedUrl)) {
            errors.push(
              `each entry under file '${fileName}' in 'targets' must have a valid 'versionedUrl' property set to the Versioned URL of an entity type`,
            );
          }

          if (
            target.blockEntity !== undefined &&
            typeof target.blockEntity !== "boolean"
          ) {
            errors.push(
              `if an entry under file '${fileName}' in 'targets' has a 'blockEntity' flag, it must be a boolean`,
            );
          }
        }
      }
    }
  }

  if (typeNameOverrides !== undefined) {
    if (
      !(typeof typeNameOverrides === "object" && typeNameOverrides !== null)
    ) {
      errors.push("`typeNameOverrides` must be an object");
    } else {
      for (const [versionedUrl, typeNameOverride] of Object.entries(
        typeNameOverrides,
      )) {
        if (!validateVersionedUrl(versionedUrl)) {
          errors.push(
            `each key in 'typeNameOverrides' must be a valid Versioned URL`,
          );
        }
        if (typeof typeNameOverride !== "string") {
          errors.push(
            `each entry in 'typeNameOverrides' must be a string, but '${versionedUrl}' is a ${typeof typeNameOverride}`,
          );
        }
      }
    }
  }

  if (versionedUrlAliases !== undefined) {
    if (
      !(typeof versionedUrlAliases === "object" && versionedUrlAliases !== null)
    ) {
      errors.push("`versionedUrlAliases` must be an object");
    } else if (
      !("enabled" in versionedUrlAliases) ||
      versionedUrlAliases.enabled === undefined
    ) {
      errors.push("`versionedUrlAliases.enabled` must be set");
    } else if (typeof versionedUrlAliases.enabled !== "boolean") {
      errors.push("`versionedUrlAliases.enabled` must be a boolean");
    } else if (versionedUrlAliases.enabled) {
      if (
        "overrides" in versionedUrlAliases &&
        versionedUrlAliases.overrides !== undefined
      ) {
        if (
          !(
            typeof versionedUrlAliases.overrides === "object" &&
            versionedUrlAliases.overrides !== null
          )
        ) {
          errors.push("`versionedUrlAliases.overrides` must be an object");
        } else {
          for (const [versionedUrl, alias] of Object.entries(
            versionedUrlAliases.overrides,
          )) {
            if (!validateVersionedUrl(versionedUrl)) {
              errors.push(
                `each key in 'versionedUrlAliases.overrides' must be a valid Versioned URL`,
              );
            }
            if (typeof alias !== "string") {
              errors.push(
                `each entry in 'versionedUrlAliases.overrides' must be a string, but '${versionedUrl}' is a ${typeof alias}`,
              );
            }
          }
        }
      }
    }
  }

  if (temporal !== undefined && typeof temporal !== "boolean") {
    errors.push("`temporal` must be a boolean");
  }

  if (errors.length > 0) {
    return { errors };
  }
};

export type ProcessedCodegenParameters = Omit<
  Required<CodegenParameters>,
  "targets"
> & {
  targets: {
    [fileName: string]: {
      versionedUrls: VersionedUrl[];
      blockEntity?: VersionedUrl;
    };
  };
};

export const processCodegenParameters = (
  parameters: CodegenParameters,
): ProcessedCodegenParameters => {
  const blockEntityTypeClashes: Record<string, VersionedUrl[]> = {};

  const targets = Object.fromEntries(
    typedEntries(parameters.targets).map(([fileName, targetsForFile]) => {
      const blockEntityTargets = [];
      const versionedUrls: VersionedUrl[] = [];

      for (const target of targetsForFile) {
        if (target.blockEntity) {
          blockEntityTargets.push(target);
        }

        versionedUrls.push(target.versionedUrl);
      }

      if (blockEntityTargets.length > 1) {
        blockEntityTypeClashes[fileName] = blockEntityTargets.map(
          (target) => target.versionedUrl,
        );
      }

      const blockEntity = blockEntityTargets[0]?.versionedUrl;

      return [fileName, { versionedUrls, blockEntity }];
    }),
  );

  if (typedKeys(blockEntityTypeClashes).length > 0) {
    throw new Error(
      `Each file can express a maximum of one block entity type. The following files have multiple block entity types defined: ${JSON.stringify(
        blockEntityTypeClashes,
        null,
        2,
      )}`,
    );
  }

  return {
    ...parameters,
    targets,
    versionedUrlAliases: parameters.versionedUrlAliases ?? { enabled: true },
    typeNameOverrides: parameters.typeNameOverrides ?? {},
    temporal: parameters.temporal ?? false,
  };
};
