// log full objects for debugging config
require("util").inspect.defaultOptions.depth = null
const fs = require('fs')
const path = require('path')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DelWebpackPlugin = require('del-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const execSync = require('child_process').execSync
process.env.REACT_APP_GIT_COMMIT_HASH = execSync(`git log --pretty=format:'%h' -n 1`).toString()

// import inline assets
const base64Sav3Icon = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'public', 'favicon.ico'), {encoding: 'base64'})
const manifest = require(path.join(__dirname, 'public', 'manifest'))
// replace /favicon.ico with inline base64 icon
// TODO: verify it works and fix it if it doesn't
manifest.icons[0].src = base64Sav3Icon

module.exports = function override(config, env) {
  if (env === 'production') {
    // save as single html file
    config.plugins.push(new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      inject: 'body',
      template: 'public/index.html',
      filename: 'sav3.html',
      // sav3.prop doesn't work
      sav3Manifest: 'data:application/manifest+json,' + JSON.stringify(manifest),
      sav3Favicon: base64Sav3Icon,
    }))

    // add all javascript inline
    config.plugins.push(new ScriptExtHtmlWebpackPlugin({
      inline: /.+[.]js/
    }))

    // remove sourcemaps
    config.devtool = false

    // delete original cra build
    config.plugins.push(new DelWebpackPlugin({
      include: ['**'],
      exclude: ['sav3.html', 'report.html'],
      info: false,
      keepGeneratedAssets: false
    }))

    // analyze bundle sizes
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html'
      })
    )
  }
  else {
    for (const plugin of config.plugins) {
      // add --fix to eslint on hot reloads
      // could be too slow to use all the time
      if (plugin.constructor.name === 'ESLintWebpackPlugin') {
        plugin.options.fix = true
      }
    }
  }

  return config
}
