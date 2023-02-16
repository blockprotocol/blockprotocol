import {AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree} from "@typescript-eslint/utils";
import path from "path";
import fs from "fs";
import ts from "typescript";
import {parse, ParserOptions} from "@typescript-eslint/parser";
import util from "util";
import RuleContext = TSESLint.RuleContext;

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

const moduleToAstMap = new Map<string, TSESTree.Program>();

function parseAstForModuleExports(
  modulePath: string,
  context: Readonly<RuleContext<never, never[]>>
) {
  let requirePath = modulePath;

  if (!context.parserPath.includes("typescript-eslint")) {
    throw new Error(`This rule only works with the typescript-eslint parser`);
  }

  const compilerOptions = {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2017,
  };
  const tsResolved = ts.nodeModuleNameResolver(modulePath, context.getFilename(), compilerOptions, ts.sys).resolvedModule?.resolvedFileName || require.resolve(requirePath);

  if (moduleToAstMap.has(tsResolved)) {
    return moduleToAstMap.get(tsResolved)!;
  }

  const code = fs.readFileSync(tsResolved, "utf-8");
  const opts = {
    ...context.parserOptions as ParserOptions,
    project: [`${path.dirname(tsResolved)}/**/tsconfig.json`],
    filePath: tsResolved,
  };
  const ast = parse(code, opts);

  moduleToAstMap.set(tsResolved, ast);

  return ast;
}

function collectExportNames(
  exportedNames: { kind: string, name: string, node: TSESTree.Node, debug?: string }[],
  node: TSESTree.ProgramStatement,
  context: Readonly<RuleContext<never, never[]>>
) {
  if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
    exportedNames.push({
      kind: 'default',
      name: 'default',
      node
    });
  } else if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
    const declaration = node.declaration;
    let keyword = '';

    if (node.exportKind === 'type') {
      keyword = 'type';
      if (declaration) {
        switch (declaration.type) {
          case AST_NODE_TYPES.TSInterfaceDeclaration:
            keyword = 'interface';
            break;
          case AST_NODE_TYPES.TSTypeAliasDeclaration:
            keyword = 'type';
            break;
          default:
            break;
        }
      }
    } else if (node.exportKind === 'value') {
      if (declaration) {
        switch (declaration.type) {
          case AST_NODE_TYPES.VariableDeclaration:
            keyword = declaration.declare ? 'declare const' : 'const';
            break;
          case AST_NODE_TYPES.FunctionDeclaration:
            keyword = declaration.declare ? 'declare function' : 'function';
            break;
          case AST_NODE_TYPES.ClassDeclaration:
            keyword = declaration.declare ? 'declare class' : 'class';
            break;
          default:
            break;
        }
      }
    }
    if (declaration && declaration.type === AST_NODE_TYPES.VariableDeclaration) {
      declaration.declarations.forEach((decl) => {
        if (decl.id.type === 'Identifier' && decl.id.name !== 'undefined') {
          exportedNames.push({
            kind: keyword,
            name: decl.id.name,
            node,
            debug: "VariableDeclaration.declarations"
          });

        }
      });
    } else if (declaration && declaration.type === AST_NODE_TYPES.FunctionDeclaration && declaration.id) {
      exportedNames.push({
        kind: keyword, name: declaration.id.name, node, debug: "FunctionDeclaration"
      });
    }

    node.specifiers.forEach((specifier) => {
      if (specifier.exported) {
        exportedNames.push({
          kind: keyword,
          name: specifier.exported.name,
          node,
          debug: "ExportNamedDeclaration.specifiers"
        });
      }
    });
  } else if (node.type === AST_NODE_TYPES.ExportAllDeclaration) {
    const ast = parseAstForModuleExports(node.source.value, context);
    ast.body.forEach((node) => {
      collectExportNames(exportedNames, node as TSESTree.ProgramStatement, context);
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
                collectExportNames(exportedNames, node as TSESTree.ProgramStatement, context);
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
