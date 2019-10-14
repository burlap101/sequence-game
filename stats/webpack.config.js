const path = require("path");

module.exports = {
    mode: 'production',
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "../server/public/stats/js/"),
        filename: "app.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    devtool: "source-map"
};