module.exports = {
    devtool: "#inline-source-map",
    module: {
        loaders: [
            {
                test: /vissense/,
                loader: 'exports-loader?VisSense!script-loader'
            }
        ]
    }
};