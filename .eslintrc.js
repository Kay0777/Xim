module.exports = {
  env: {
    browser: true,
    "es2021": true,
    commonjs: true,
  },
  "extends": "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    'newline-after-var': ['error', 'always'],
    options: {
      "indent": ["error", "tab"]
    },
    'linebreak-style': 0,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: false,
          minProperties: 1,
        },
        ObjectPattern: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreStrings: false,
        code: 250,
      },
    ],
    'no-duplicate-imports': 'error',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
  },
}
