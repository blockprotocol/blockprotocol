import {AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree} from "@typescript-eslint/utils";
import path from "path";
import fs from "fs";
import ts from "typescript";
import {parse, ParserOptions} from "@typescript-eslint/parser";
import util from "util";
import RuleContext = TSESLint.RuleContext;

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

const compilerOptions = {
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  target: ts.ScriptTarget.ES2017,
};

const moduleToAstMap = new Map<string, TSESTree.Program>();

function parseAstForModuleExports(
  modulePath: string,
  filename: string,
  context: Readonly<RuleContext<never, never[]>>,
) {
  if (!context.parserPath.includes("typescript-eslint")) {
    throw new Error(`This rule only works with the typescript-eslint parser`);
  }

  const tsResolved = ts.nodeModuleNameResolver(modulePath, filename, compilerOptions, ts.sys).resolvedModule?.resolvedFileName;

  if (!tsResolved) {
    throw new Error(`Could not resolve ${modulePath} from ${filename}`);
  }

  if (moduleToAstMap.has(tsResolved)) {
    return moduleToAstMap.get(tsResolved)!;
  }

  try {
    const code = fs.readFileSync(tsResolved, "utf-8");
    const opts: ParserOptions = {
      ...context.parserOptions,
      project: [`${path.dirname(tsResolved)}/**/tsconfig.json`],
      filePath: tsResolved,
      range: true,
    };
    const ast = parse(code, opts);

    moduleToAstMap.set(tsResolved, ast);

    return ast;
  } catch (error) {
    console.error(`Error parsing ${tsResolved}: ${util.inspect(error)}`);
    throw error;
  }
}

function getExportedDeclarationKind(declaration: TSESTree.ExportDeclaration): string {
  if (declaration.type === AST_NODE_TYPES.TSInterfaceDeclaration) {
    return 'interface';
  }
  if (declaration.type === AST_NODE_TYPES.TSTypeAliasDeclaration) {
    return 'type';
  }
  if (declaration.type === AST_NODE_TYPES.VariableDeclaration) {
    return declaration.kind;
  }
  if (declaration.type === AST_NODE_TYPES.FunctionDeclaration) {
    return 'function';
  }
  if (declaration.type === AST_NODE_TYPES.ClassDeclaration) {
    return 'class';
  }
  if (declaration.type === AST_NODE_TYPES.TSModuleDeclaration) {
    return 'module';
  }
  if (declaration.type === AST_NODE_TYPES.TSEnumDeclaration) {
    return 'enum';
  }
  throw new Error(`Could not determine kind of exported declaration: ${declaration.type}`);
}

function getExportsForNode(
  node: TSESTree.ProgramStatement,
  context: Readonly<RuleContext<never, never[]>>,
  fileName: string
): { name: string, kind: string, from?: string, node: TSESTree.Node }[] {

  const exportedNames: { name: string, kind: string, from?: string, node: TSESTree.Node }[] = [];
  if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
    exportedNames.push({
      kind: 'default',
      name: 'default',
      node,
    });
  } else if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
    const {declaration, specifiers} = node;
    if (node.source?.value) {
      if (specifiers) {
        const ast = parseAstForModuleExports(node.source.value, fileName, context);

        const tsResolved = ts.nodeModuleNameResolver(node.source.value, fileName, compilerOptions, ts.sys).resolvedModule?.resolvedFileName;

        if (!tsResolved) {
          throw new Error(`Could not resolve ${node.source.value} from ${fileName}`);
        }

        const dependencyExportedNames = ast.body.flatMap((node) => getExportsForNode(node, context, tsResolved));

        specifiers.forEach((specifier) => {
          if (specifier.exported) {
            const reexportedElement = dependencyExportedNames.find((exportedName) => exportedName.name === specifier.local.name);

            if (reexportedElement) {
              exportedNames.push({
                kind: reexportedElement.kind,
                name: specifier.exported.name,
                from: node.source.value,
                node,
              })
            } else {
              throw new Error(`Could not find definition of exported type: ${specifier.exported.name}`);
            }
          }
        });
      }
    }
    if (declaration) {
      const kind = getExportedDeclarationKind(declaration);
      switch (declaration.type) {
        case AST_NODE_TYPES.VariableDeclaration:
          declaration.declarations.forEach((decl) => {
            if (decl.id.type === AST_NODE_TYPES.Identifier && decl.id.name !== 'undefined') {
              exportedNames.push({
                kind,
                name: decl.id.name,
                node,
              });
            }
          });
          break;
        case AST_NODE_TYPES.FunctionDeclaration:
          exportedNames.push({
            kind,
            name: declaration.id!.name,
            node,
          });
          break;
        case AST_NODE_TYPES.ClassDeclaration:
          exportedNames.push({
            kind,
            name: declaration.id!.name,
            node,
          });
          break;
        case AST_NODE_TYPES.TSInterfaceDeclaration:
          exportedNames.push({
            kind: 'interface',
            name: declaration.id!.name,
            node,
          });
          break;
        case AST_NODE_TYPES.TSTypeAliasDeclaration:
          exportedNames.push({
            kind: 'type',
            name: declaration.id!.name,
            node,
          });
          break;
        default:
          break;
      }
    }
    if (!node.source?.value && !declaration) {
      if (!node.parent) {
        console.warn(`ExportNamedDeclaration Node didn't have a source, or declaration, or parent: ${util.inspect(node)}`);
      }

      if (node.specifiers) {
        // @todo - Find the kind of the node
        node.specifiers.forEach((specifier) => {
          if (specifier.exported) {
            exportedNames.push({
              kind: 'unknown',
              name: specifier.exported.name,
              node,
            });
          }
        });
      }
    }
  } else if (node.type === AST_NODE_TYPES.ExportAllDeclaration) {
    const ast = parseAstForModuleExports(node.source.value, fileName, context);

    const tsResolved = ts.nodeModuleNameResolver(node.source.value, fileName, compilerOptions, ts.sys).resolvedModule?.resolvedFileName;

    if (!tsResolved) {
      throw new Error(`Could not resolve ${node.source.value} from ${fileName}`);
    }

    exportedNames.push(...ast.body.flatMap((node) => getExportsForNode(node, context, tsResolved)).map((exportedName) => ({
      ...exportedName,
      from: node.source.value,
    })));
  }

  return exportedNames;
}

/* @todo - Filter out duplicates */
/* @todo - Take config object of module to check API against */
/* @todo - Check API against another module by checking if all `Type` and `Value` names are consistent */
/* @todo - Add whitelist to config object */

module.exports = {
  rules: {
    "enforce-reexport": createRule({
      name: "enforce-reexport",
      meta: {
        docs: {
          description: "Foo",
          recommended: "error",
        },
        messages: {},
        type: "problem",
        schema: [],
      },
      defaultOptions: [],
      create(context) {
        const exportedNames: { kind: string, name: string, from?: string, node: TSESTree.Node, }[] = [];
        return {
          'Program:exit': (node: TSESTree.Program) => {
            node.body.forEach((node: TSESTree.Node) => {
              if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration || node.type === AST_NODE_TYPES.ExportNamedDeclaration || node.type === AST_NODE_TYPES.ExportAllDeclaration) {
                exportedNames.push(...getExportsForNode(node as TSESTree.ProgramStatement, context, context.getFilename()));
              }
            });
            // console.log(util.inspect({file: context.getFilename(), exportedNames}, {depth: 6, colors: true}));
            console.log(util.inspect({
              file: context.getFilename(),
              // names: exportedNames.map((n) => `export ${n.kind} ${n.name}${(n.from ? ` from ${n.from}` : "")};`)
              names: [...(new Set(exportedNames.map((n) => n.name)))]
            }, {
              depth: 6,
              colors: true,
              maxArrayLength: 1000,
            }))
            // Your rule logic here
          },
        };
      }
    }),
  }
};
