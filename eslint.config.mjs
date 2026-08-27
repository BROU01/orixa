import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
  ]),
  {
    // Le projet existant utilise volontairement des liens HTML et des effets
    // client pour ses composants interactifs ; ces règles de migration restent
    // informatives, tandis que les règles TypeScript/React restent actives.
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-location-assign-relative-destination': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]);
