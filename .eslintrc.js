module.exports = {
  env: {
    node: true, 
    es2021: true,
  },
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/eslint-recommended', 
    'plugin:@typescript-eslint/recommended', 
  ],
  parser: '@typescript-eslint/parser', 
  parserOptions: {
    ecmaVersion: 12, 
    sourceType: 'module', 
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "on",
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'], 
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
};

