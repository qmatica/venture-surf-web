module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    semi: ['error', 'never'],
    'no-console': 'off',
    'comma-dangle': ['error', 'never'],
    'no-use-before-define': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'max-len': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-shadow': 'off',
    'spaced-comment': 'off',
    'no-debugger': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'no-restricted-globals': ['error', 'event', 'fdescribe'],
    'import/no-extraneous-dependencies': 'off',
    camelcase: 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/jsx-pascal-case': 'off',
    'react/require-default-props': 'off',
    'react/void-dom-elements-no-children': 'off',
    'no-underscore-dangle': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'react/no-array-index-key': 'off',
    'react/button-has-type': 'off'
  },
  overrides: [
    {
      files: [
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx'
      ],
      env: {
        jest: true
      }
    }
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      }
    }
  }
}
