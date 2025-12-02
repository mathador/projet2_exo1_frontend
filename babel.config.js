module.exports = {
    presets: ["@babel/preset-env"],
    env: {
        "coverage": {
            plugins: ["istanbul"]
        }
    }
}
