import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
    {
        ignores: [
            '.next/',
            '.vscode/',
            'dist-staging/',
            'dist/',
            'node_modules/',
            'eslint.config.js',
            'tailwind.config.js',
            'vite.config.ts',
            'vite.*.config.ts'
        ]
    },
    js.configs.recommended,
    // ─── JavaScript / CommonJS ───────────────────────
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: {
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly'
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-undef': 'off',
            'prefer-template': 'warn'
        }
    },

    // ─── TypeScript / TypeScript-React ───────────────
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                JSX: 'readonly',
                React: 'readonly'
            },
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: true,
                tsconfigRootDir: process.cwd()
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            perfectionist,
            prettier: prettierPlugin
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            ...prettier.rules,
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-undef': 'off',
            'perfectionist/sort-array-includes': [
                'error',
                {
                    order: 'asc',
                    partitionByComment: true,
                    partitionByNewLine: true,
                    type: 'natural'
                }
            ],
            'perfectionist/sort-classes': [
                'error',
                {
                    groups: ['index-signature', 'static-property', 'private-property', 'property', 'constructor', 'static-method', 'private-method', 'method'],
                    order: 'asc',
                    type: 'natural'
                }
            ],
            'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
            'perfectionist/sort-imports': [
                'error',
                {
                    groups: [
                        'type',
                        ['builtin', 'external'],
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'side-effect',
                        'style',
                        'unknown'
                    ],
                    internalPattern: ['^@/.*'],
                    order: 'asc',
                    type: 'natural'
                }
            ],
            'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'natural' }],
            'perfectionist/sort-jsx-props': [
                'error',
                {
                    order: 'asc',
                    type: 'natural'
                }
            ],
            'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
            'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
            'perfectionist/sort-objects': [
                'error',
                {
                    groups: ['unknown'],
                    order: 'asc',
                    type: 'natural'
                }
            ],
            'perfectionist/sort-union-types': ['error', { order: 'asc', type: 'natural' }],
            'prefer-template': 'warn',
            'prettier/prettier': ['error']
        }
    },
    prettier
]
