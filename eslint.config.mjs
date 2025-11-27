import { defineConfig, globalIgnores } from 'eslint/config';
import ts from 'eslint-config-zakodium/ts';

export default defineConfig(globalIgnores(['lib']), ts, {
    rules: {
        'new-cap': 'off',
    },
});
