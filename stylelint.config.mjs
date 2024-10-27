/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard-scss',
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        resolveNestedSelectors: true
      }
    ],
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true
      }
    ]
  }
}
