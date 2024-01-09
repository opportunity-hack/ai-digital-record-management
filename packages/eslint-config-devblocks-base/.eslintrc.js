module.exports = {
  extends: ["airbnb-base", "next", "plugin:prettier/recommended"],
  rules: {},
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: [
        "@typescript-eslint",
        "unused-imports",
        "tailwindcss",
        "simple-import-sort",
      ],
      extends: [
        "plugin:tailwindcss/recommended",
        "airbnb",
        "airbnb-typescript",
        "next",
        "plugin:prettier/recommended",
      ],
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@next/next/no-img-element": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "import/prefer-default-export": "off",
        "import/extensions": "off",
        "no-restricted-syntax": [
          "error",
          "ForInStatement",
          "LabeledStatement",
          "WithStatement",
        ],
        "no-new": "off",
        "prettier/prettier": [
          "error",
          {
            printWidth: 240,
          },
        ],
        "react/function-component-definition": "off",
        "react/destructuring-assignment": "off",
        "react/require-default-props": "off",
        "react/jsx-props-no-spreading": "off",
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              ["^node:"],
              ["^@?\\w"],
              ["^@snakecode", "^@", "^@public", "^@root", "^\\."],
            ],
          },
        ],
        "tailwindcss/classnames-order": "warn",
        "tailwindcss/no-custom-classname": "warn",
        "tailwindcss/no-contradicting-classname": "error",
      },
    },
  ],
};
