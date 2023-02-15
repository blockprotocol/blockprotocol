import {AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree} from "@typescript-eslint/utils";
import * as path from "path";
import RuleContext = TSESLint.RuleContext;

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

function collectExportNames(exportedNames: string[], node: TSESTree.Node, context: Readonly<RuleContext<never, never[]>>) {
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
    const currentFile = context.getFilename();
    console.log({modulePath, dirname: path.dirname(currentFile) });
    const resolvedPath = require.resolve(modulePath, {paths: [path.dirname(currentFile)]});
    const exportedModule = require(resolvedPath);
    const exportedModuleNames = Object.keys(exportedModule);
    exportedModuleNames.forEach((name) => {
      if (name !== 'default' && !exportedNames.includes(name)) {
        exportedNames.push(name);
      }
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
              collectExportNames(exportedNames, node, context);
            });
            console.log(JSON.stringify({exportedNames}, null, 2));
            // Your rule logic here
          },
        };
      }
    }),
  }
};
