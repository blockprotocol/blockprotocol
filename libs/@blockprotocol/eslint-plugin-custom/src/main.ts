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
  parserOptions?: ParserOptions
) {
  console.log(({modulePath, filename}));
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
    const opts = {
      ...parserOptions,
      project: [`${path.dirname(tsResolved)}/**/tsconfig.json`],
      filePath: tsResolved,
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
    return declaration.declare ? 'module' : 'variable';
  }
  if (declaration.type === AST_NODE_TYPES.FunctionDeclaration) {
    return 'function';
  }
  if (declaration.type === AST_NODE_TYPES.ClassDeclaration) {
    return 'class';
  }
  return '';
}

function collectExportNames(
  exportedNames: { kind: string, name: string, node: TSESTree.Node, debug?: string }[],
  node: TSESTree.ProgramStatement,
  context: Readonly<RuleContext<never, never[]>>,
  fileName: string
) {
  if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
    exportedNames.push({
      kind: 'default',
      name: 'default',
      node
    });
  } else if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
    const {declaration, specifiers} = node;
    if (node.source?.value) {
      console.log(`Parse AST for ExportNamedDeclaration from ${node.source.value} in ${fileName}`);

      // Re-use the compiler options if it's in the same project
      const relativePath = path.relative(context.getFilename(), node.source.value);
      const parserOptions = (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) ? context.parserOptions as ParserOptions : undefined;

      const ast = parseAstForModuleExports(node.source.value, fileName, context, parserOptions);

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
                  debug: "VariableDeclaration.declarations"
                });
              }
            });
            break;
          case AST_NODE_TYPES.FunctionDeclaration:
            exportedNames.push({
              kind,
              name: declaration.id!.name,
              node,
              debug: "FunctionDeclaration"
            });
            break;
          case AST_NODE_TYPES.ClassDeclaration:
            exportedNames.push({
              kind,
              name: declaration.id!.name,
              node,
              debug: "ClassDeclaration"
            });
            break;
          case AST_NODE_TYPES.TSInterfaceDeclaration:
            exportedNames.push({
              kind: 'interface',
              name: declaration.id!.name,
              node,
              debug: "TSInterfaceDeclaration"
            });
            break;
          case AST_NODE_TYPES.TSTypeAliasDeclaration:
            exportedNames.push({
              kind: 'type',
              name: declaration.id!.name,
              node,
              debug: "TSTypeAliasDeclaration"
            });
            break;
          default:
            break;
        }
      }

      if (specifiers) {
        specifiers.forEach((specifier) => {
          if (specifier.exported) {
            const namedExport = ast.body.find(
              (node) =>
                node.type === AST_NODE_TYPES.ExportNamedDeclaration &&
                node.specifiers.some((s) => s.exported.name === specifier.exported!.name)
            ) as TSESTree.ExportNamedDeclaration | undefined;

            if (namedExport && namedExport.declaration) {
              const kind = getExportedDeclarationKind(namedExport.declaration);
              exportedNames.push({
                kind,
                name: specifier.exported.name,
                node,
                debug: "ExportNamedDeclaration.specifiers"
              });
            }
          }
        });
      }
    }
  } else if (node.type === AST_NODE_TYPES.ExportAllDeclaration) {
    // Re-use the compiler options if it's in the same project
    const relativePath = path.relative(context.getFilename(), node.source.value);
    const parserOptions = (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) ? context.parserOptions as ParserOptions : undefined;

    console.log(`Parse AST for ExportAllDeclaration from ${node.source.value} in ${fileName}`);
    const ast = parseAstForModuleExports(node.source.value, fileName, context, parserOptions);

    const tsResolved = ts.nodeModuleNameResolver(node.source.value, fileName, compilerOptions, ts.sys).resolvedModule?.resolvedFileName;

    if (!tsResolved) {
      throw new Error(`Could not resolve ${node.source.value} from ${fileName}`);
    }
    console.log(tsResolved);

    ast.body.forEach((bodyNode) => {
      collectExportNames(exportedNames, bodyNode as TSESTree.ProgramStatement, context, tsResolved);
    });
  }
}

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
        const exportedNames: { kind: string, name: string, node: TSESTree.Node, debug?: string }[] = [];
        return {
          'Program:exit': (node: TSESTree.Program) => {
            node.body.forEach((node: TSESTree.Node) => {
              if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration || node.type === AST_NODE_TYPES.ExportNamedDeclaration || node.type === AST_NODE_TYPES.ExportAllDeclaration) {
                collectExportNames(exportedNames, node as TSESTree.ProgramStatement, context, context.getFilename());
              }
            });
            console.log(util.inspect({file: context.getFilename(), exportedNames}, {depth: 6, colors: true}));
            console.log({file: context.getFilename(), names: exportedNames.map((n) => `export ${n.kind} ${n.name};`)})
            // Your rule logic here
          },
        };
      }
    }),
  }
};
