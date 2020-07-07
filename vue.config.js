const path = require('path')

module.exports = {
    publicPath: '/torimon/',
    outputDir: 'docs',
    configureWebpack: {
        resolve: {
          alias: {
            '@': path.join(__dirname, '/src/')
          }
        }
    },
}
