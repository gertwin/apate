
const path = require('path');

process.env.HOST = 'apate-dev.com';
process.env.PORT = 8080;


const config = {

    entry: {
        apate: './js/index.js',
        jsscm: './js/jsscm/jsscm.js',
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public/',
        filename: '[name]-bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            includePaths: ['./node_modules'],
                        },
                    },
                }],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry',
                                    corejs: {
                                        version: '3',
                                        proposals: false,
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },
};


module.exports = (env, argv) => {
    //
    // development specific properties
    if (argv.mode === 'development') {
        config.devServer = {
            publicPath: '/public/',
            // contentBase: path.join(__dirname, 'public'),
            // Display only errors to reduce the amount of output.
            stats: 'errors-only',
            host: process.env.HOST, // Defaults to `localhost`
            port: process.env.PORT, // Defaults to 8080
            // open: true,     // Open the page in browser
            overlay: true, // show errors in the browser
            // https: true,
        };
        config.devtool = 'source-map';
        config.module.rules.push({
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                },
            }],
        });
    }
    //
    // production specific properties
    if (argv.mode === 'production') {
        config.module.rules.push({
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                    publicPath: '/fonts/',
                },
            }],
        });
    }
    return config;
};
