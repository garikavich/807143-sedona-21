const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

//Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

//Scripts

// const scripts = () => {
// 	return gulp.src("source/js/*.js")
// 		.pipe(gulp.dest("build/js"))
// 		.pipe(sync.stream())
// }

// exports.scripts = scripts;

//Sprite

const sprite = () => {
  return gulp.src("source/img/icon/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite-dev.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Sprite

// const sprite = () => {
// 	return gulp.src("source/img/sprite.svg")
// 	.pipe(gulp.dest("build/img"))
// 	.pipe(sync.stream())
// }

// exports.sprite = sprite;

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.png",
    "source/img/**/*.{jpg,png,svg}",
    "source/js/*.js"
  ],
    {
      base: "source"
    })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html), sync.reload);
}

// //Build

// const build = gulp.series(
// 	clean,
// 	gulp.parallel(
// 		styles,
// 		sprite,
// 		copy,
// 		createWebp
// 	)
// )

// exports.build = build;

//Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    sprite,
    html,
    copy,
    createWebp
  ),
  gulp.series(
    server, watcher
  )
)
