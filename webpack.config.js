const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        layout: './assets/js/layout.js',
        rep_log: { import: './assets/js/rep_log.js', dependOn: 'layout' },
        login: { import: './assets/js/login.js', dependOn: 'layout' },
    },
    output: {
        path: path.resolve(__dirname, 'public', 'build'),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name].[hash][ext][query]',
        publicPath: '/build/',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                corejs: 3
                            }]
                        ],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    }
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                quietDeps: true,
                            },
                        },
                    }],
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][hash][ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new WebpackManifestPlugin({
            fileName: 'manifest.js',
            generate(seed, files) {
                const manifestObj = files.reduce((acc, file) => {
                    acc[file.name] = file.path;
                    return acc;
                }, {});
                return `window.manifest = ${JSON.stringify(manifestObj)};`;
            }
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
        },
    },
}
