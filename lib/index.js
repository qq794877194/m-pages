const { src, dest, series, parallel, watch } = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const {sass,babel,ejs,imagemin, useref, if: gif, uglify, cleanCss, htmlmin } = loadPlugins();
const del = require('del');
const browserSync = require('browser-sync');

const bs = browserSync.create();

let config = {
  build: {
    src: 'src',
    dist: 'dist',
    public: 'public',
    temp: '.temp',
    port: 3001,
    paths: {
      css: 'assets/css/*.scss',
      js: 'assets/js/*.js',
      html: '*.html',
      img: 'assets/img/**'
    }
  }
}
const base = {base: config.build.src, cwd: config.build.src};

const clean = () => del([config.build.dist,config.build.temp]);

const style = () => {
    return src(config.build.paths.css, base)
        .pipe(sass({ outputStyle: 'expanded'}))
        .pipe(dest(config.build.temp));
};

const script = () => {
    return src(config.build.paths.js,base)
        .pipe(babel({presets: [require('@babel/preset-env')]}))
        .pipe(dest(config.build.temp));
};

const page = () => {
    return src(config.build.paths.html, base)
        .pipe(ejs({ content: 'ejs测试自动化构建' }))
        .pipe(dest(config.build.temp));
};

const image = () => {
    return src(config.build.paths.img,base)
        .pipe(imagemin())
        .pipe(dest(config.build.dist));
};
const extra = () => {
    return src('**',{base: config.build.public, cwd: config.build.public})
        .pipe(dest(config.build.dist))
};

const serve = () => {
    watch(config.build.paths.css,{cwd: config.build.src},style);
    watch(config.build.paths.js,{cwd: config.build.src},script);
    watch(config.build.paths.html,{cwd: config.build.src},page);
    watch([config.build.src + '/' + config.build.paths.img,config.build.public + '/**'],bs.reload);

    bs.init({
        notify: false,
        port: 3001,
        files: config.build.dist + '/**',
        server: {
            baseDir: [config.build.temp,config.build.src,config.build.public],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
};
const userefTask = () => {
    return src(config.build.paths.html,{base: config.build.temp, cwd: config.build.temp})
        .pipe(useref({ searchPath: [config.build.temp,'.']}))
        .pipe(gif(/\.js$/, uglify()))
        .pipe(gif(/\.css$/, cleanCss()))
        .pipe(gif(/\.html$/, htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        })))
        .pipe(dest(config.build.dist));
};

const compile = parallel(style,script,page);
const build = series(clean,parallel(series(compile,userefTask),image,extra));
const develop = series(compile,serve);

module.exports = {
    clean,
    build,
    develop,
};
