/* eslint-disable no-useless-escape,no-dupe-keys */
var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        jsx: path.join(__dirname, 'test/src/index.jsx'),
        vendor: [
            'react',
            'react-dom'
        ]
    },
    devtool: '#source-map',
    devServer: {
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'jsx': path.join(__dirname, 'test/src/')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack',
            filename: 'index.html',
            template: './test/index.html',
            // inject: 'head',
            favicon: '',
            hash: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest']
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'test/dist'),
        chunkFilename: 'chunk/[name].[chunkhash].js',
        sourceMapFilename: '[file].map'
    }
}
