import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
    {
        ignores: ["lib/**", "coverage/**", "node_modules/**"],
    },
    js.configs.recommended,
    ...tsPlugin.configs["flat/recommended"],
    prettier,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
