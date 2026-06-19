// Важно. Создаются 3 конфига: client, server и packages.
// 1. Чтобы изменения применились, необходимо перезапустить idea
// 2. Без import/resolver не будет нормально работать importPlugin
// 3. Возможно, можно сделать лучше

import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import styledA11y from 'eslint-plugin-styled-components-a11y'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

import type {
  ConfigWithExtendsArray,
  ConfigWithExtends
} from '@eslint/config-helpers'

const MAX_PARAMS_COUNT = 4

const baseRules: ConfigWithExtends['rules'] = {
  'no-console': 'error',
  'max-params': ['error', MAX_PARAMS_COUNT],
  'no-multiple-empty-lines': ['warn', { maxBOF: 0, maxEOF: 1, max: 1 }],
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
  ],
  '@typescript-eslint/no-misused-promises': [
    'error',
    { checksVoidReturn: { attributes: false } }
  ],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-unnecessary-condition': [
    'error',
    {
      allowConstantLoopConditions: true
    }
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_'
    }
  ],
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_'
    }
  ],
  'no-magic-numbers': 'off',
  '@typescript-eslint/no-magic-numbers': [
    'warn',
    {
      ignoreEnums: true,
      ignoreArrayIndexes: true,
      ignoreNumericLiteralTypes: true,
      ignoreReadonlyClassProperties: true,
      ignore: [0, 1, -1]
    }
  ],
  'no-use-before-define': [
    'error',
    { functions: true, classes: true, variables: true }
  ],
  'import/order': [
    'warn',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type'
      ],
      pathGroups: [
        {
          pattern: '@game-workspace/*',
          group: 'internal',
          position: 'before'
        },
        {
          pattern: '{app,pages,widgets,features,entities,shared}/**',
          group: 'internal',
          position: 'after'
        }
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }
  ],
  'import/no-duplicates': ['warn', { 'prefer-inline': true }],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true
    }
  ],
  '@typescript-eslint/no-dynamic-delete': 'off',
  'no-restricted-syntax': [
    'error',
    {
      selector: 'TSEnumDeclaration',
      message: 'Use an object instead of an enum.'
    }
  ]
}

const baseExtends: ConfigWithExtends['extends'] = [
  js.configs.recommended,
  ...tsEslint.configs.strict,
  eslintConfigPrettier,
  importPlugin.flatConfigs.recommended
]

const packagesConfig: ConfigWithExtends = {
  files: ['packages/**/*.{ts,tsx}'],
  extends: baseExtends,
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      project: 'packages/*/tsconfig.json'
    }
  },
  plugins: {
    'unused-imports': unusedImports
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'packages/*/tsconfig.json'
      }
    }
  },
  rules: baseRules
}

const serverConfig: ConfigWithExtends = {
  files: ['server/**/*.{ts,tsx}'],
  extends: baseExtends,
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.node,
    parserOptions: {
      project: 'server/tsconfig.json'
    }
  },
  plugins: {
    'unused-imports': unusedImports
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'server/tsconfig.json'
      }
    }
  },
  rules: baseRules
}

const clientConfig: ConfigWithExtendsArray = [
  {
    extends: [...baseExtends, reactHooks.configs.flat.recommended],
    files: ['client/src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: 'client/tsconfig.app.json'
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: 'client/tsconfig.app.json'
        }
      }
    },
    plugins: {
      react: pluginReact,
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
      'styled-components-a11y': styledA11y
    },
    rules: {
      ...baseRules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' }
      ],
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function' }
      ],
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          reservedFirst: ['key', 'ref'],
          multiline: 'last'
        }
      ],
      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: false
        }
      ],
      'react/no-unstable-nested-components': 'warn',
      'max-lines': ['warn', { max: 124 }]
      // Включать опционально
      // "arrow-body-style": ["error", "as-needed"]
    }
  },
  {
    files: ['client/vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: 'client/tsconfig.node.json'
      }
    }
  }
]

const eslintConfig: ConfigWithExtends = {
  files: ['eslint.config.{js,ts,mts}'],
  extends: baseExtends,
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['eslint.config.ts']
      }
    }
  },
  plugins: {
    'unused-imports': unusedImports
  },
  settings: {
    'import/resolver': {
      typescript: true
    }
  },
  rules: baseRules
}

export default defineConfig([
  { ignores: ['node_modules', '.husky', '**/dist'] },
  packagesConfig,
  ...clientConfig,
  serverConfig,
  eslintConfig
])
