const { src, dest, watch, series, parallel } = require('gulp');

//css y sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done){
    //compilar sasss
    //paso 1 - identificar archivos, 2 - compilarla, 3 - guardar el .css
    src('src/scss/app.scss')
    .pipe( sourcemaps.init() )
    //minificar hojas de estilos css
    /*{ outputStyle: 'compressed' */
    .pipe( sass() )
    //crea una version compatible (autoprefixer para cada navegador)
    .pipe( postcss([ autoprefixer(), cssnano() ]) )
    .pipe( sourcemaps.write('.') )
    .pipe( dest('build/css') )

     done();
}
function imagenes (){
   return src('src/img/**/*')
   .pipe( imagemin({ optimizationLevel: 3}) )
   .pipe( dest ('build/img') )
}

function versionWebp(){
   const opciones = {
      quality:50
    }
   return src('src/img/**/*.{png,jpg}')
   .pipe( webp( opciones ) )
   .pipe( dest('build/img'))
}

function versionAvif(){
  const opciones = {
    quality:50
  }

   return src('src/img/**/*.{png,jpg}')
   .pipe( avif( opciones ) )
   .pipe(dest('build/img'))
}

function dev() {
   watch(' src/scss/**/*.scss ', css);
   watch(' src/scss/**/*.scss ', imagenes);

}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css ,dev);
//series: inicia una tarea y hasta que finaliza inicia la siguiente
//parallel: todas inician al mismo tiempo