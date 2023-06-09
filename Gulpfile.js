const path = require('path');
const { parallel, series, src, dest } = require('gulp');
const gzip = require('gulp-zip');
const { rimrafSync } = require('rimraf');

const config = {
  get win() {
    return 'out-win';
  },
  get mac() {
    return 'out-mac';
  },
  get package() {
    // return require(path.join(__dirname, 'package.json'))
    return require(path.join(__dirname, 'package.json'));
  }
};

function clean() {
  return rimrafSync([config.win, config.mac]);
}

// zip
function zipWin(cb) {
  const version = config.package.version;
  src(config.win + '/**')
    .pipe(gzip(`rename-win-v${version}.zip`))
    .pipe(dest('.'));
  cb();
}
function zipMac(cb) {
  const version = config.package.version;
  src(config.mac + '/**')
    .pipe(gzip(`rename-mac-v${version}.zip`))
    .pipe(dest('.'));
  cb();
}

function build (cb) {
  console.warn('[警告] 本项目已经禁用 gulp 默认任务')
  cb()
}

module.exports = {
  clean,
  zipWin,
  zipMac,
  default: build
};
