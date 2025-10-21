const path = require("path");
module.exports = {
    mode: "development",
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
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
    }
}
