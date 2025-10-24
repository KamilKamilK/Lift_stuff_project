const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDevServer = process.argv.some(arg => arg.includes('serve'));
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    entry: {
        layout: './assets/js/layout.js',
        rep_log: { import: './assets/js/rep_log.js', dependOn: 'layout' },
        login: { import: './assets/js/login.js', dependOn: 'layout' },
    },
    output: {
        path: path.resolve(__dirname, 'public', 'build'),
        filename: isProduction ? '[name].[contenthash].js' : '[name].js',
        assetModuleFilename: 'assets/[name].[hash][ext][query]',
        publicPath: isDevServer ? 'http://localhost:8081/build/' : '/build/',
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
                        presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]],
                        cacheDirectory: true,
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: !isProduction } }
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: !isProduction } },
                    { loader: 'sass-loader', options: { sourceMap: !isProduction, sassOptions: { quietDeps: true } } }
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                type: 'asset/resource',
                generator: { filename: 'images/[name][hash][ext][query]' }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][hash][ext]' }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: isProduction ? '[name].[contenthash].css' : '[name].css' }),
        new WebpackManifestPlugin({
            fileName: 'manifest.json',
            writeToFileEmit: true,
            basePath: 'build/',
            publicPath: isDevServer ? 'http://localhost:8081/build/' : '/build/',
            generate: (seed, files) => {
                const manifest = {};
                files.forEach(file => {
                    manifest[file.name] = file.path;
                });
                return manifest;
            }
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
        })
    ],
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: { compress: { drop_console: true } },
            }),
        ],
        splitChunks: { chunks: 'async' },
    },
    devServer: {
        static: { directory: path.join(__dirname, "public") },
        port: 8081,
        hot: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        devMiddleware: { publicPath: '/build/' },
    },
};
