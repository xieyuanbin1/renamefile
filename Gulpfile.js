const path = require('path')
const { series, src, dest } = require('gulp')
const gzip = require('gulp-zip')
const { rimrafSync } = require('rimraf')

const config = {
  get dist () {
    return 'out'
  },
  get package () {
    // return require(path.join(__dirname, 'package.json'))
    return require(path.join(__dirname, 'package.json'))
  }
}

function clean () {
  return rimrafSync(config.dist)
}

// zip
function zip () {
  const version = config.package.version
  return src(config.dist + '/**').pipe(gzip(`rename-v${version}.zip`)).pipe(dest('.'))
}

const build = series(clean, zip)

module.exports = {
  clean,
  zip,
  default: build
}
