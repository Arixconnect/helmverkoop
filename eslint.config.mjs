import {defineConfig,globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';
import hooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  globalIgnores(['.next/**','next-env.d.ts','sanity/**','test-results/**']),
  ...tseslint.configs.recommended,
  {files:['src/**/*.{ts,tsx}'],plugins:{'@next/next':next,'react-hooks':hooks},rules:{
    ...next.configs.recommended.rules,...next.configs['core-web-vitals'].rules,
    'react-hooks/rules-of-hooks':'error','react-hooks/exhaustive-deps':'warn'
  }}
]);
