import {AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree} from "@typescript-eslint/utils";
import path from "path";
import fs from "fs";
import ts from "typescript";
import {parse, ParserOptions} from "@typescript-eslint/parser";
import RuleContext = TSESLint.RuleContext;

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

function collectExportNames(exportedNames: string[], node: TSESTree.ProgramStatement, context: Readonly<RuleContext<never, never[]>>) {
  if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
    exportedNames.push('default')
  } else if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
    node.specifiers.forEach((specifier) => {
      if (specifier.exported) {
        exportedNames.push(specifier.exported.name);
      }
    });
    if (node.declaration) {
      if (node.declaration.type === AST_NODE_TYPES.VariableDeclaration) {
        node.declaration.declarations.forEach((decl) => {
          if (decl.id.type === 'Identifier') {
            exportedNames.push(decl.id.name);
          }
        });
      } else if (node.declaration.type === AST_NODE_TYPES.FunctionDeclaration && node.declaration.id) {
        exportedNames.push(node.declaration.id.name);
      }
    }
  } else if (node.type === AST_NODE_TYPES.ExportAllDeclaration) {
    const modulePath = node.source.value;
    let requirePath = modulePath;

    if (!context.parserPath.includes("typescript-eslint")) {
      throw new Error(`This rule only works with the typescript-eslint parser`);
    }

    const parserOptions = context.parserOptions as ParserOptions;

    if (parserOptions.project && (parserOptions.project === true || Array.isArray(parserOptions.project) || parserOptions.project.includes("*"))) {
      throw new Error(`This rule only supports a plain path to the 'tsconfig.json', it doesn't support 'true', multiple paths, or glob patterns in the project configuration`);
    }

    const compilerOptions = {
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2017,
    };
    const tsResolved = ts.nodeModuleNameResolver(modulePath, context.getFilename(), compilerOptions, ts.sys).resolvedModule?.resolvedFileName || require.resolve(requirePath);

    const code = fs.readFileSync(tsResolved, "utf-8");
    const opts = {
      ...context.parserOptions as ParserOptions,
      project: [`${path.dirname(tsResolved)}/**/tsconfig.json`],
      filePath: tsResolved,
    };
    const ast = parse(code, opts);
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
        const exportedNames: string[] = [];
        return {
          'Program:exit': (node: TSESTree.Program) => {
            node.body.forEach((node: TSESTree.Node) => {
              if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration || node.type === AST_NODE_TYPES.ExportNamedDeclaration || node.type === AST_NODE_TYPES.ExportAllDeclaration) {
                collectExportNames(exportedNames, node as TSESTree.ProgramStatement, context);
              }
            });
            console.log(JSON.stringify({file: context.getFilename(), exportedNames}, null, 2));
            // Your rule logic here
          },
        };
      }
    }),
  }
};
