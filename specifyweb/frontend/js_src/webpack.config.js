const path = require('path');
const fs = require('fs');
const webpack = require("webpack");
const { WebpackManifestPlugin, getCompilerHooks } = require('webpack-manifest-plugin');


function writeIfChanged(compiler, fileName, fileContent){
    if(!fs.existsSync(compiler.options.output.path))
        fs.mkdirSync(compiler.options.output.path);
    const fullOutPath = path.join(
        compiler.options.output.path,
        fileName
    );
    if(
        !fs.existsSync(fullOutPath) ||
        fileContent !== fs.readFileSync(fullOutPath).toString()
    )
        fs.writeFileSync(fullOutPath, fileContent)
}

class EmitInitPyPlugin {
    apply = (compiler)=>
        compiler.hooks.done.tap('EmitInitPyPlugin', () => 
            writeIfChanged(
                compiler,
                '__init__.py',
                "# Allows manifest.py to be imported / reloaded by Django dev server.\n"
            )
        );
}

class SmartWebpackManifestPlugin {
    apply = (compiler)=>
        getCompilerHooks(compiler).afterEmit.tap(
            'SmartWebpackManifestPlugin',
            (manifest)=>
                writeIfChanged(
                    compiler,
                    'manifest.py',
                    `manifest = ${
                        JSON.stringify(manifest, null, 2)
                    }\n`
                )
        );
}


module.exports = (_env, argv)=>({
    module: {
        rules: [
            {
                test: /\.(png|gif|jpg|jpeg|svg)$/,
                use: [{
                    loader: "asset",
                }]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "underscore-template-loader",
                    options: {
                        engine: 'underscore',
                    }
                }]
            },
            {
                test: /\.[tj]sx?$/,
                exclude: /(node_modules)|(bower_components)/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-react'],
                            [
                                '@babel/preset-env',
                                {
                                    targets: "defaults"
                                }
                            ]
                        ]
                    }
                }]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new SmartWebpackManifestPlugin(),
        new WebpackManifestPlugin({
            // Create the file outside of the dist dir to avoid
            // triggering the watcher
            fileName: '../manifest.json',
        }),
        new EmitInitPyPlugin()
    ],
    devtool: 'source-map',
    entry: {
        main: "./lib/main.js",
        login: "./lib/login.js",
        passwordchange: "./lib/passwordchange.js",
        choosecollection: "./lib/choosecollection.js",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/static/js/",
        filename: argv.mode === 'development'
          ? "[name].bundle.js"
          : "[name].[contenthash].bundle.js"
    },
});
