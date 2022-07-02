const path = require("path");

module.exports = {
    name: "simai-server",
    entry: "./src/index.js",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    },
    resolve: {
        alias: {
            "@": __dirname + "/src",
        },
        extensions: [".js", ".mjs"],
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
