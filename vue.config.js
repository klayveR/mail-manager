const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");

module.exports = {
    transpileDependencies: ["quasar", "vuex-persist"],
    productionSourceMap: false,
    pluginOptions: {
        quasar: {
            importStrategy: "kebab",
            rtlSupport: false,
        },
        electronBuilder: {
            preload: "src/preload.js",
            builderOptions: {
                productName: "E-Mail Manager",
                linux: {
                    target: ["AppImage", "deb"],
                    category: "Utility",
                },
                nsis: {
                    oneClick: false,
                    perMachine: true,
                    allowToChangeInstallationDirectory: true,
                },
            },
        },
    },
    configureWebpack: {
        plugins: [new BundleAnalyzerPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
    },
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "E-Mail Manager";
            return args;
        });
        config.externals(["pino-pretty"]);
    },
};
