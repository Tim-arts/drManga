let Encore = require('@symfony/webpack-encore');
let path = require('path');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    // JS files of the application
    .addEntry('base', './assets/js/base.js')
    .addEntry('views/index', './assets/js/views/index.js')
    .addEntry('views/payment', './assets/js/views/payment.js')
    .addEntry('views/manga/show', './assets/js/views/manga/show.js')
    .addEntry('views/manga/read', './assets/js/views/manga/read.js')
    .addEntry('views/user/profile', './assets/js/views/user/profile.js')
    .addEntry('views/user/setting', './assets/js/views/user/setting.js')

    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning()

    // enables LESS support
    // yarn add --dev less-loader less
    .enableLessLoader()

    // yarn add --dev vue vue-loader@^14 vue-template-compiler
    .enableVueLoader()

    // first, install any presets you want to use (e.g. yarn add babel-preset-es2017)
    // yarn add babel-loader
    .configureBabel(function (babelConfig) {
        // add additional presets
        babelConfig.presets.push('@babel/preset-flow');

        // no plugins are added by default, but you can add some
        // babelConfig.plugins.push('styled-jsx/babel');
    })

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you're having problems with a jQuery plugin
    // yarn add jquery
    .autoProvidejQuery()

    .enableSingleRuntimeChunk()
    .enableSourceMaps(false)
    ;

let config = Encore.getWebpackConfig();
config.resolve.alias = {
    'css': path.resolve(__dirname, './assets/css'),
    'js': path.resolve(__dirname, './assets/js'),
    'script': path.resolve(__dirname, './assets/js/script'),
    'src': path.resolve(__dirname, './assets/js/src'),
    'views': path.resolve(__dirname, './assets/js/views'),
    'vendor': path.resolve(__dirname, './assets/js/vendor'),
};

config.watchOptions = { poll: true, ignored: /node_modules/ };

module.exports = config;
