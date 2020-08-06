const path = require('path'),
    pkgInfo = require('./package.json'),
    webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    CopyPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    cssnano = require('cssnano')

module.exports = function (env, argv) {
    const mode = argv.mode || 'development'
    process.env.NODE_ENV = mode

    console.log('mode=' + mode)

    const isProduction = mode !== 'development'

    const settings = {
        mode,
        entry: {
            'tss-dashboard': [path.join(__dirname, './src/app.js')]
        },
        output: {
            path: path.join(__dirname, './distr/'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    loader: 'babel-loader'
                    //exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                url: false,
                                sourceMap: !isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    autoprefixer(),
                                    cssnano({
                                        autoprefixer: true,
                                        discardComments: {removeAll: true}
                                    })
                                ],
                                sourceMap: !isProduction
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !isProduction,
                                prependData: '@import "./src/styles/variables.scss";'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/ed25519/),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.join(__dirname, './src/static/'),
                        transform(content, absoluteFrom) {
                            if (absoluteFrom.includes('index.html')) {
                                content = content.toString('utf8').replace(/v=0\.0\.0/g, 'v=' + pkgInfo.version)
                                return Buffer.from(content, 'utf8')
                            }
                            return content
                        }
                    }
                ]
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                appVersion: JSON.stringify(pkgInfo.version)
            })
        ],
        node: {
            fs: 'empty'
        },
        optimization: {}
    }

    if (!isProduction) {
        settings.devtool = 'source-map'
        settings.devServer = {
            historyApiFallback: {
                disableDotRule: true
            },
            compress: true,
            port: 5002,
            contentBase: [path.join(__dirname, './distr')]
        }
    } else {
        settings.plugins.unshift(new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            sourceMap: false
        }))

        const TerserPlugin = require('terser-webpack-plugin')

        settings.optimization.minimizer = [new TerserPlugin({
            parallel: true,
            sourceMap: false,
            terserOptions: {
                //warnings: true,
                toplevel: true
            }
        })]
    }
    return settings
}
