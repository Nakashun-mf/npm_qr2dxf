import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Forbid `as unknown as X` double-cast patterns (ref: Issue #4)
      '@typescript-eslint/no-explicit-any': 'error',

      // Unused variables are dead code — remove them
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // console.log left in library code pollutes user output
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);
