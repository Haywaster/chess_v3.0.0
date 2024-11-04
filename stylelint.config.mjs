/** @type {import('stylelint').Config} */

const camelCase = '^[a-z][a-zA-Z0-9]+$';

export default {
  extends: 'stylelint-config-standard-scss',
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      camelCase,
      {
        resolveNestedSelectors: true
      }
    ],
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true
      }
    ],
    'scss/dollar-variable-pattern': camelCase
  }
}
