module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  project: "./tsconfig.json",
  rules: {},
};
