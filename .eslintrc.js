module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    es6: true,
  },
  extends: ['standard-with-typescript', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  ignorePatterns: ['!.*', 'dist', 'node_modules'],
  rules: {},
}
