import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "no-trailing-spaces": "error",
      "no-undef": "warn",
      semi: ["error", "always"],
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js built-in модули (если нужны)
            ["^node:"],
            // Внешние пакеты, которые НЕ начинаются с "@" и не начинаются с точк и (относительные)
            ["^(?!@)(?!\\.).+"],
            // Импорты, начинающиеся с "@"
            ["^@"],
            // Относительные импорты (начинающиеся с "." или "..")
            ["^\\."],
            // Сайд-эффект импорты, например: import "styles.css";
            ["^\\u0000"],
          ]
        }
      ],
      "simple-import-sort/exports": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
      indent: 0,
      "object-curly-spacing": ["error", "always"],
    },
  },
);