'use strict';

const js = require('@eslint/js');
const nodemailer = require('eslint-config-nodemailer');
const prettier = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                Buffer: 'readonly',
                __dirname: 'readonly',
                clearImmediate: 'readonly',
                clearInterval: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly',
                global: 'readonly',
                process: 'readonly',
                setImmediate: 'readonly',
                setInterval: 'readonly',
                setTimeout: 'readonly'
            }
        },
        rules: {
            ...nodemailer.rules,
            ...prettier.rules,
            indent: 'off',
            'global-require': 'off',
            'no-await-in-loop': 'off',
            'no-prototype-builtins': 'off'
        }
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: {
                after: 'readonly',
                afterEach: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                it: 'readonly'
            }
        },
        rules: {
            'no-unused-expressions': 'off',
            'no-unused-vars': 'off'
        }
    }
];
