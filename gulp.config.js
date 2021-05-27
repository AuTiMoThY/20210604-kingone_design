const src = '_build';
const assets = `app/public`;


module.exports = {
    project: "temp",
    port: 8082,
    basedir: {
        sass: `./${src}/sass/`,
        sassImg: `./${assets}/images/sass_img/`,
        pug: `./${src}/pug/`,
        img: `./${assets}/images/`
    },
    srcPath: {
        sass: `./${src}/sass/**/*.scss`,
        sassImg: `./${assets}/images/sass_img/**/*.+(jpeg|jpg|png|gif|svg)`,
        pug: `./${src}/pug/**/*.pug`,
        spritesImg: `./${src}/img_sprite/*.png`,
        spritesSvg: `./${src}/images/svg/*.svg`,
        js: `./${src}/script/*.js`,
    },
    exportPath: {
        sass: `./${assets}/css/`,
        pug: `./app/`,
        js: `./${assets}/js/`,
    },
    sassOpt: {
        outputStyle: 'compact',
        includePaths: ['node_modules/']
    },
    pugOpt: {
        "debug": true,
        "pretty": true
    }

}