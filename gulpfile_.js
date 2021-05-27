/**
* Version: 4.3.7
* 4.3.7: sass includePaths
* 4.3.6: FIXED task pug
* 4.3.5: ADD customMsg
* 4.3.4: svg task add sass
* 4.3.3: show project name
* 4.3.2: ADD fancy-log
* 4.3.1: ADD merge
* 4.3.0: ADD spritesmith
* 4.2.2: task svg optimization
* 4.2.1: ADD gulp-sass-image
* 4.1.1: Fixed tesk del & minifyCss
* 4.1.0: add changed.cached.gulpif.filter
*/

const project = "temp";
const assets = "public/";
const port = 8082;


const browserSync    = require('browser-sync').create();

const gulp           = require('gulp');

const sass           = require('gulp-sass');
sass.compiler        = require('node-sass');
const sassGlob       = require('gulp-sass-glob');
const sassImage      = require('gulp-sass-image');
const size           = require('gulp-size');
const rename         = require('gulp-rename');
// gulp-clean-css: CSS 壓縮套件
const cleanCss       = require('gulp-clean-css');
const sourcemaps     = require('gulp-sourcemaps');
const postcss        = require('gulp-postcss');
const autoprefixer   = require('autoprefixer');


const notify         = require('gulp-notify');
const plumber        = require('gulp-plumber');

const del            = require('del');
const imagemin       = require('gulp-imagemin');
const svgSprite      = require('gulp-svg-sprite');
// connect           = require('gulp-connect');
const spritesmith    = require('gulp.spritesmith');
const merge          = require('merge-stream');

const pugInheritance = require('gulp-pug-inheritance');
const pug            = require('gulp-pug');
const changed        = require('gulp-changed');
const cached         = require('gulp-cached');
const gulpif         = require('gulp-if');
const filter         = require('gulp-filter');
const log            = require('fancy-log');


let customMsg = (txt, act) => {
    var msgtxt = "";

    switch(act) {
        case "change":
            msgtxt = `
            ===================================
            [ ${project} ]:${port} ${txt} change !!!
            ===================================
            `;
            break;
        default:
            msgtxt = `
            ===================================
            [ ${project} ]:${port} ${txt} task complete !!!
            ===================================
            `;
            break;
    }

    return msgtxt;

}


const path = {
    watchSass: '_build/sass/**/*.scss',
    watchPug: '_build/pug/**/*.pug',
    watchImg: '_build/img_ori/*',
    watchSprite: '_build/img_sprite/*.png',
    watchSvg: assets + 'images/svg/*.svg',
    buildSassImg: '_build/sass/',
    sassImg: assets + 'images/sass_img',
    watchSassImg: assets + 'images/sass_img/**/*.+(jpeg|jpg|png|gif|svg)',
    sass: '_build/sass/',
    pug: '_build/pug/',
    css: assets + 'css/',
    images: assets + 'images/',
    js: assets + 'js/script.js'
};


// server
// gulp.task('server', function(){
//     connect.server({
//         port: 8089,
//         livereload: true
//     });
// });

gulp.task('del', () => {
    return del([path.css + "/style.css", path.css + "/style.min.css", path.css + "/style.css.map"]);
});


gulp.task('del-img', () => {
    return del([path.images]);
});




// > Sass
gulp.task('sass', () => {
    return gulp.src(path.watchSass)
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compact',
        includePaths: ['node_modules/']
    }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(size({title:'style'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.css))
    .pipe(browserSync.stream());
});

// > minifyCss
gulp.task('minifyCss', () => {
    return gulp.src(`${path.css}/style.css`, {allowEmpty: true})
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss({
        // keepBreaks: true,
        // compatibility: 'ie8,+units.rem',
        debug: true
    }, (details) => {
        console.log(`${details.name} : ${details.stats.originalSize}`);
        console.log(`${details.name} : ${details.stats.minifiedSize}`);
        console.log(`${details.stats.timeSpent} ms`);
    }))
    .pipe(gulp.dest(path.css))
    .pipe(notify({ message: customMsg("minifyCss") }));
});

// > image
gulp.task('image', () => {
    return gulp.src(path.watchSassImg)
        .pipe(sassImage({
            // targetFile: '_generated-imagehelper.scss', // default target filename is '_sass-image.scss'
            // template: 'your-sass-image-template.mustache',
            images_path: path.sassImg,
            css_path: path.css,
            // prefix: 'icon-'
        }))
        .pipe(gulp.dest(path.buildSassImg));
});



// > sprite
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.watchSprite).pipe(spritesmith({
    imgPath: '../images/sprite.png',
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
  }));
  var imgStream = spriteData.img.pipe(gulp.dest(path.images));
  var cssStream = spriteData.css.pipe(gulp.dest(path.sass));
  return merge(imgStream, cssStream);


});

// > pug
gulp.task('pug', () => {


    return gulp.src(path.watchPug)
        /////////////////////////////////////////////////////////////////////////
        // https://medium.com/@toumasaya/gulp-fighting-4-packages-51e7a2b7f61b //
        /////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////
        //https://github.com/pure180/gulp-pug-inheritance //
        ////////////////////////////////////////////////////
        //only pass unchanged *main* files and *all* the partials
        .pipe(changed('./', {extension: '.html'}))
        .on('end', function(){ log('1...'); })

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('pug')))
		.on('end', function(){ log('2...'); })

        //find files that depend on the files that have changed
        .pipe(pugInheritance({basedir: path.pug, extension: '.pug',  skip: 'node_modules'}))
        .on('end', function(){ log('3...'); })

        //filter out partials (folders and files starting with "_" )
        .pipe(filter(function (file) {
        	log(file);
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .on('end', function(){ log('4...'); })

        .pipe(pug({
            "debug": true,
            "pretty": true
        }))
        .on('end', function(){ log('5...'); })
        .pipe(gulp.dest('./'))
        // .pipe(browserSync.stream())
        .pipe(notify({ message: customMsg("pug") }))
        .on('end', function(){ browserSync.reload(); });
});



// > image-min
gulp.task('image-min', () => {
    var onError = (err) => {
        notify.onError({
                    title:    "Gulp image-min",
                    subtitle: "Failure!",
                    message:  "Error: <%= error.message %>"
                })(err);


        this.emit('end');
    };


    return gulp.src(path.watchImg)
               .pipe(imagemin())
               .pipe(gulp.dest(path.images));
});

// > browser-sync
gulp.task('browser-sync', gulp.series('image', 'del', 'sass', 'minifyCss', function() {
    browserSync.init({
        ui: {
            port: 8083
        },
        server: {
            baseDir: "./"
        },
        port: port
    });

    console.log('=================================');
    console.log( project + " serving!!");
    console.log('=================================');


    global.isWatching = true;
    gulp.watch(path.watchSass, gulp.series('del', 'sass', 'minifyCss'));
    // gulp.watch("*.html").on('change', () => {
    //     browserSync.notify(customMsg("HTML", "change"));
    //     browserSync.reload();
    // } );
    gulp.watch([assets + "js/*.js"]).on('change', () => {
        browserSync.notify(customMsg("JS", "change"));
        browserSync.reload()
    });
    gulp.watch([assets + "js/page/*.js"]).on('change', () => {
        browserSync.notify(customMsg("Page JS", "change"));
        browserSync.reload()
    });
    // gulp.watch("css/*.css").on('change', () => {
    //     browserSync.notify(customMsg("css", "change"));
    //     browserSync.reload()
    // });
    gulp.watch(path.watchPug, gulp.series('pug'));
    gulp.watch(path.watchImg, gulp.series('del-img', 'image-min'));
}));




config2 = {
  mode: {
    view: { // Activate the «view» mode
      bust: false,
      render: {
        scss: true // Activate Sass output (with default options)
      }
    },
    symbol: true, // Activate the «symbol» mode
  }
};

// > svg-sprite
gulp.task('svg-sprite', function(){
    return gulp.src(path.watchSvg)
        .pipe(plumber())
        .pipe(svgSprite(config2))
            .on('error', function(error){
                console.log(error);
            })
        .pipe(gulp.dest('_build/'));
})




// gulp.task('watch', function () {
//     gulp.watch(path.sass, gulp.series('del', 'sass', 'minifyCss'));
//     gulp.watch("*.html").on('change', browserSync.reload);
//     gulp.watch(path.pug, gulp.series('pug'));
// });


gulp.task('default', gulp.series('browser-sync', 'image-min'));
gulp.task('svg', gulp.series('svg-sprite', 'pug', 'sass', 'minifyCss'));
gulp.task('sassimg', gulp.series('image', 'sass', 'minifyCss'));