const path = require('path');

module.exports = {
    mode: 'development',
    entry: './todo/static/todo/ts/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'todo/static/todo/ts')]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'todo/static/todo/js')
    }
}