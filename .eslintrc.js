
module.exports = {
    root: true,
        env: {
            node: true,
        },
        extends: [
            'airbnb-base',
        ],
        rules: {
            'max-len': ["error", { "code": 120 }],
            'indent': ['error', 4],
            'no-plusplus': 0,
            'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'padded-blocks': ['error', { 'classes': 'always' }],
            'quote-props': ['error', 'consistent'],
            'arrow-body-style': ['error', 'always'],
            // 'consistent-return': ['error', { 'treatUndefinedAsUnspecified': true }]
        },
        parserOptions: {
            parser: 'babel-eslint',
        },
        overrides: [
        {
            files: [
            '**/__tests__/*.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
