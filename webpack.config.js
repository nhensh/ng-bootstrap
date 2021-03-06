'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var htmlLoader = require('./tools/html-loader/loader')

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Resolve Path
     */
    config.resolve = {
        modulesDirectories: ["node_modules"],
        alias: {}
    }

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = isTest ? {} : {
        app: './src/app.js',
        vendor: [
            'babel-polyfill',
            'redux',
            'redux-logger',
            'redux-thunk',
            'angular', 'angular-sanitize', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-touch', 'angular-animate',
            'ng-redux',
            'redux-ui-router'
        ]
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    config.output = isTest ? {} : {
        // Absolute output directory
        path: __dirname + '/dist',

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: isProd ? '/' : 'http://localhost:8080/',

        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // Initialize module
    config.module = {
        preLoaders: [],
        loaders: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loaders: [
                'ng-annotate',
                'babel?presets[]=es2015&plugins[]=transform-async-to-generator'
            ],
            exclude: [/node_modules/]
        }, {
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Allow loading css through js
            //
            // Reference: https://github.com/postcss/postcss-loader
            // Postprocess your css with PostCSS plugins
            test: /\.css$/,
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files in production builds
            //
            // Reference: https://github.com/webpack/style-loader
            // Use style-loader in development.
            loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
        }, {
            // SCSS LOADER
            test: /\.scss$/,
            loader: isTest ? 'null' : ExtractTextPlugin.extract('style', 'css?sourceMap&modules!postcss?parser=postcss-scss')
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(ico|woff|woff2|ttf|eot)(\?.+)?$/,
            loader: 'file'
        }, {
            // ASSET LOADER
            // Reference: https://github.com/tcoopman/image-webpack-loader
            // Compress png, jpg, jpeg, gif, svg files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg)(\?.+)?$/,
            loader: isProd ? 'file!image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}' : 'file'
        }, {
            // HTML LOADER
            // Reference: https://github.com/webpack/html-loader
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            loader: htmlLoader()
        }]
    };

    //// ISPARTA LOADER
    //// Reference: https://github.com/ColCh/isparta-instrumenter-loader
    //// Instrument JS files with Isparta for subsequent code coverage reporting
    //// Skips node_modules and files that end with .test.js
    //if (isTest) {
    //    config.module.preLoaders.push({
    //        test: /\.js$/,
    //        exclude: [
    //            /node_modules/,
    //            /\.spec\.js$/
    //        ],
    //        loader: 'isparta-instrumenter'
    //    })
    //}
    // module noParse
    config.module.noParse = [
        /angular\/angular/,
        /angular-sanitize\/angular-sanitize/,
        /angular-ui-router\/release\/angular-ui-router/,
        /angular-ui-bootstrap\/dist\/ui-bootstrap-tpls/,
        /angular-touch\/angular-touch/,
        /angular-animate\/angular-animate/
    ]

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        precss({
            import: {
                extension: 'scss'
            }
        }),
        autoprefixer({
            browsers: ['last 2 version', '> 5%']
        })
        //, cssInitial()
    ];

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [];

    // Skip rendering index.html in test mode
    if (!isTest) {
        config.plugins.push(
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin('[name].[hash].css', {disable: !isProd}),

            // Reference: https://github.com/ampedandwired/html-webpack-plugin
            // Render index.html
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                favicon: './src/favicon.ico'
            })
        )
    }

    // Add build specific plugins
    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    drop_debugger: true,
                    warnings: false,
                    dead_code: true,
                    unused: true,
                    //drop_console: true,
                    global_defs: {
                        DEBUG: !isProd
                    }
                },
                comments: false
            }),
            // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            })
        )
    } else {
        config.plugins.push(
            // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
            new webpack.DefinePlugin({
                DEBUG: !isProd
            })
        )
    }

    config.plugins.push(
        ///* chunkName= */"vendor", /* filename= */"vendor.bundle.js"
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            //minChunks: 3
            //name: 'vendor',
            //// filename: "vendor.js"
            minChunks: Infinity
        })
    )

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './public',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        },
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1',
                secure: false
            },
        },
        host: '0.0.0.0',
        port: 8080
    };

    return config;
}();
