import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importXPlugin from "eslint-plugin-import-x";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  ...reactHooksPlugin.configs["flat/recommended"],
  importXPlugin.configs["flat/recommended"],
  testingLibraryPlugin.configs["flat/react"],
  ...compat.config({
    extends: ["plugin:jsx-a11y/recommended"],
  }),
  {
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        performance: "readonly",
        navigator: "readonly",
        AbortController: "readonly",
        FormData: "readonly",
        matchMedia: "readonly",
        queueMicrotask: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        MessageChannel: "readonly",
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
      "import-x/resolver": {
        node: { extensions: [".js", ".jsx"] },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".js", ".jsx"] },
      ],
      "import-x/no-extraneous-dependencies": [
        "warn",
        {
          devDependencies: [
            "vite.config.mjs",
            "eslint.config.js",
            "**/*.test.js",
            "**/*.test.jsx",
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.js", "**/*.test.jsx"],
    languageOptions: {
      globals: {
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
  {
    files: ["vite.config.mjs"],
    languageOptions: {
      globals: { node: true },
    },
    rules: {
      "import-x/no-unresolved": "off",
    },
  },
];
