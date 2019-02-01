const AureliaPlugin = require('aurelia-webpack-plugin').AureliaPlugin;
const DefinePlugin = require('webpack').DefinePlugin;

const wallaby = require('@dolittle/build/wallaby')

module.exports = (baseFolder, webpackPostprocessorCallback, wallabySetingsCallback) => {
    if( !baseFolder ) baseFolder = 'Features';
    return wallaby(baseFolder, webpack => {

        webpack.module.rules = webpack.module.rules.concat([
            { test: /\.html$/i, loader: 'html-loader' },
            { test: /\.css$/i, issuer: [{ not: [{ test: /\.html$/i }] }], use: ['style-loader', 'css-loader'] },
            { test: /\.css$/i, issuer: [{ test: /\.html$/i }], use: 'css-loader' },   
        ]);

        if( typeof webpackPostprocessorCallback == 'function' ) webpackPostprocessorCallback(webpack);

    }, wallaby => {
        if( typeof wallabySetingsCallback == 'function' ) wallabySetingsCallback(wallaby);
    });
};

