const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CopyPlugin = require("copy-webpack-plugin");
const {InjectManifest} = require("workbox-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const buildFolder = path.resolve(__dirname, "..", "./build");

module.exports = (env) => ({
    entry: {
        "bundle": path.resolve(__dirname, "..", "./src/index.tsx"),
        "chat": path.resolve(__dirname, "..", "src/chat-worker.ts")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            include: path.resolve(__dirname, "..", "./web")
                        }
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|webp)$/i,
                use: [
                    {
                        loader: "responsive-loader",
                        options: {
                            adapter: require("responsive-loader/sharp"),
                            sizes: [320, 640, 960, 1200, 1800, 2400],
                            placeholder: true,
                            placeholderSize: 20,
                            disabled: env === "dev"
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.(?:ico|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
                type: "asset/inline",
            },
        ],
    },
    output: {
        path: buildFolder,
        publicPath: "/",
        filename: "[name].js",
        chunkFilename: "chunk-[name].[contenthash].js",
    },
    experiments: {
        topLevelAwait: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "public/index.html"),
            title: "Need Medi",
            favicon: path.resolve(__dirname, "..", "public/favicon.ico"),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "public/fallbacks/offline.html"),
            filename: "offline.html",
            title: "Offline",
            inject: false
        }),
        new WebpackPwaManifest({
            name: "Need Medi",
            short_name: "Need Medi",
            description: "Facebook for doctors.",
            background_color: "#FFFFFF",
            orientation: "any",
            theme_color: "#3E64FF",
            publicPath: "/",
            "gcm_sender_id": "569002618626",
            icons: [
                {
                    src: path.resolve(__dirname, "..", "public/android-chrome-512x512.png"),
                    sizes: [96, 128, 192, 256, 384, 512]
                },
                {
                    src: path.resolve(__dirname, "..", "public/apple-touch-icon.png"),
                    sizes: [96, 128, 192, 256, 384, 512],
                    purpose: "maskable"
                }
            ]
        }),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, "..", "public/robots.txt")},
                {from: path.resolve(__dirname, "..", "public/libsignal-protocol.js")},
                {
                    from: path.resolve(__dirname, "..", "public/.well-known/"),
                    to: path.resolve(buildFolder, ".well-known")
                }
            ]
        }),
        new InjectManifest({
            swSrc: path.resolve(__dirname, "..", "src/sw.ts"),
            exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /\.(jpe?g|png|webp)$/i]
        }),
        new Dotenv({path: path.resolve(__dirname, "..", `./.${env}.env`)})
    ],
    stats: false
})
;
