module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ['@babel/plugin-transform-typescript', { isTSX: true }],
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-private-property-in-object',
            [
                'module-resolver',
                {
                    root: ['./src'],
                    alias: {
                        '@': './src',
                    },
                    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                },
            ],
        ],
    };
};
