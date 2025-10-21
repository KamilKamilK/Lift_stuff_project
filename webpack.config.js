const path = require("path");
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
        layout: './assets/js/layout.js',
    },
    output: {
        path: path.resolve(__dirname, 'public','build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
        })
    ]
}
