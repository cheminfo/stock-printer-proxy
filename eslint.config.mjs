import { defineConfig } from 'eslint/config';
import ts from 'eslint-config-zakodium/ts';

export default defineConfig(ts, {
    rules: {
        'new-cap': 'off',
    },
});
