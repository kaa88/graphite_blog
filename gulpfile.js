// npm i --save-dev *plugin*


// Basic settings:
const isLiteBuild = true
const load = {
	// service: true,
	// libs: true,
	// media: true,
}
const scriptsPrefix = 'website.';

/////////////////////////////////////////////////////////////////

const { src, dest } = require('gulp'),
	gulp = require('gulp'),
	fs = require('fs'),
	streamqueue = require('streamqueue'),
	browsersync = require('browser-sync').create(),
	del = require('del'),
	rename = require('gulp-rename'),
	fileinclude = require('gulp-file-include'),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	css_media_queries = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	uglify = require('gulp-uglify-es').default,
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	imageresize = require('gulp-scale-images'),
	readMetadata = require('gulp-scale-images/read-metadata'),
	through = require('through2'), // for gulp-scale-images
	imagemin = require('gulp-imagemin-changba');

/////////////////////////////////////////////////////////////////

const $source = '#src';
const $baseDir = {
	html: $source + '/',
	css: $source + '/css/',
	js: $source + '/js/',
	data: $source + '/data/',
	service: $source + '/service/',
	libs: $source + '/libs/',
	media: $source + '/media/',
	img: $source + '/media/img/',
	fonts: $source + '/fonts/',
}
const $project = isLiteBuild ? 'dist_light' : 'dist';
const path = {
	clean: ['./dist_light/', './dist/'],
	watch: {
		html: $source + '/**/*.html',
		css: $baseDir.css + '**/*.scss',
		js: $baseDir.js + '**/*.js',
		data: $baseDir.data + '**/*',
		service: $baseDir.service + '**/*',
		media: $baseDir.media + '**/*.{mp4,avi,webm,ogg,mp3,pdf,txt,doc,docx,xls,xlsx,ppt,pptx,rtf}',
		img: $baseDir.img + '**/*.{jpg,png,svg,gif,ico,webp}',
		fonts_otf: $baseDir.fonts + 'otf/*.otf',
		fonts_ttf: $baseDir.fonts + '*.ttf',
	},
	src: {
		html: [$baseDir.html + '**/*.html', '!' + $baseDir.html + '**/[_#]*.html'],
		css: $baseDir.css + '*style.scss',
		js: $baseDir.js + '*script.js',
		data: $baseDir.data + '**/*',
		service: [$baseDir.service + '**/*', $baseDir.service + '.htaccess'],
		libs: $baseDir.libs + '**/*',
		media: [$baseDir.media + '**/*', '!' + $baseDir.media + 'img/**/*'],
		img: $baseDir.img + '**/*',
		img2x: $baseDir.img + '**/*@2x.*',
		img_uncompressed: $baseDir.img + '**/$*',
		img_favicon: $baseDir.img + 'favicon.png',
		fonts_otf: $baseDir.fonts + 'otf/*.otf',
		fonts_ttf: $baseDir.fonts + '*.ttf',
	},
	build: {
		root: $project + '/',
		css: $project + '/css/',
		js: $project + '/js/',
		data: $project + '/data/',
		libs: $project + '/libs/',
		media: $project + '/media/',
		img: $project + '/media/img/',
		fonts: $project + '/fonts/',
	}
}

/////////////////////////////////////////////////////////////////

function cb() { }

function getExtendedDir(name, dir) {
	dir = dir.replace($baseDir[name], '');
	let arr = dir.split('/').slice(0, -1);
	dir = arr.join('/') + '/';
	return dir;
}

function clean() {
	return del(path.clean);
}

/////////////////////////////////////////////////////////////////

function html(cb, file) {
	let filepath = path.src.html, extDir = '';
	if (file && !file.match(/\/[_#]/)) {
		filepath = file;
		extDir = getExtendedDir('html', file);
	}
	return src(filepath)
		.pipe(fileinclude({
			indent: true
		}))
		.pipe(dest(path.build.root + extDir))
		.pipe(browsersync.stream());
}

function css() {
	let stream = src(path.src.css)
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(css_media_queries())
		.pipe(rename({
			basename: scriptsPrefix + 'style'
		}));

	if (!isLiteBuild)
		stream = stream
			.pipe(dest(path.build.css))
			.pipe(clean_css())
			.pipe(rename({
				extname: '.min.css'
			}));

	return stream
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	let stream = src(path.src.js)
		.pipe(fileinclude())
		.pipe(rename({
			basename: scriptsPrefix + 'script'
		}));

	if (!isLiteBuild)
		stream = stream
			.pipe(dest(path.build.js))
			.pipe(uglify())
			.pipe(rename({
				extname: '.min.js'
			}));

	return stream
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function data(cb, file) {
	let filepath = file ? file : path.src.data;
	let extDir = file ? getExtendedDir('data', file) : '';
	return src(filepath)
		.pipe(dest(path.build.data + extDir))
		.pipe(browsersync.stream());
}

function service(cb, file) {
	if (!isLiteBuild || load.service) {
		let filepath = file ? file : path.src.service;
		let extDir = file ? getExtendedDir('service', file) : '';
		return src(filepath)
			.pipe(dest(path.build.root + extDir))
			.pipe(browsersync.stream());
	}
	else cb();
}

function libs(cb) {
	if (!isLiteBuild || load.libs)
		return src(path.src.libs)
			.pipe(dest(path.build.libs));
	else cb();
}

function media(cb, file) {
	if (!isLiteBuild || load.media) {
		let filepath = file ? file : path.src.media;
		let extDir = file ? getExtendedDir('media', file) : '';
		return src(filepath)
			.pipe(dest(path.build.media + extDir))
			.pipe(browsersync.stream());
	}
	else cb();
}

/////////////////////////////////////////////////////////////////

const faviconSizes = { L: 270, M: 180, S: 32 }

function scaleFavicon(file, size) {
	file = file.clone();
	file.scale = {
		maxWidth: size,
		maxHeight: size
	}
	return file;
}
function scaleFaviconL(file, _, cb) {
	file = scaleFavicon(file, faviconSizes.L)
	cb(null, file)
}
function scaleFaviconM(file, _, cb) {
	file = scaleFavicon(file, faviconSizes.M)
	cb(null, file)
}
function scaleFaviconS(file, _, cb) {
	file = scaleFavicon(file, faviconSizes.S)
	cb(null, file)
}
function renameFaviconL(file, _, cb) {
	let fileName = file.basename.replace('.', '-' + faviconSizes.L + '.')
	cb(null, fileName)
}
function renameFaviconM(file, _, cb) {
	let fileName = file.basename.replace('.', '-' + faviconSizes.M + '.')
	cb(null, fileName)
}
function renameFaviconS(file, _, cb) {
	let fileName = file.basename.replace('.', '-' + faviconSizes.S + '.')
	cb(null, fileName)
}
function scaleImage2x(file, _, cb) {
	readMetadata(file, (err, meta) => {
		if (err) return cb(err)
		file = file.clone()
		file.scale = {
			maxWidth: Math.ceil(meta.width / 2),
			maxHeight: Math.ceil(meta.height / 2)
		}
		cb(null, file)
	})
}
function renameImage2x(file, _, cb) {
	let fileName = file.basename.replace('@2x.', '.')
	cb(null, fileName)
}

function images(cb, filepath) {
	let images = [path.src.img, '!' + path.src.img2x, '!' + path.src.img_uncompressed, '!' + path.src.img_favicon];
	let images2x = [path.src.img2x, '!' + path.src.img_uncompressed];
	let uncompressed = path.src.img_uncompressed;
	let favicon = path.src.img_favicon;

	function getFaviconStream(filepath = favicon) {
		if (isLiteBuild)
			return src(filepath)
				.pipe(through.obj(scaleFaviconS))
				.pipe(imageresize(renameFaviconS));
		else
			return streamqueue(
				{ objectMode: true },
				src(filepath)
					.pipe(through.obj(scaleFaviconL))
					.pipe(imageresize(renameFaviconL)),
				src(filepath)
					.pipe(through.obj(scaleFaviconM))
					.pipe(imageresize(renameFaviconM)),
				src(filepath)
					.pipe(through.obj(scaleFaviconS))
					.pipe(imageresize(renameFaviconS))
			);
	}

	let stream, extDir = '';
	// если 1 файл
	if (filepath) {
		extDir = getExtendedDir('img', filepath);
		// 1x
		stream = src(filepath);
		// 2x
		if (filepath.match(/@2x/))
			stream = stream
				.pipe(through.obj(scaleImage2x))
				.pipe(imageresize(renameImage2x))
				.pipe(src(filepath));
		// uncomp
		if (filepath.match(/\/\$/))
			return stream
				.pipe(dest(path.build.img + extDir))
				.pipe(browsersync.stream());
		// favicon
		if (filepath.match(/favicon\.png/))
			stream = getFaviconStream(filepath);
	}
	// если все файлы
	else {
		stream = streamqueue(
			{ objectMode: true },
			src(images2x)
				.pipe(through.obj(scaleImage2x))
				.pipe(imageresize(renameImage2x)),
			src(images2x),
			src(images),
			getFaviconStream()
		)
	}
	// общее
	if (!isLiteBuild)
		stream = stream
			.pipe(imagemin([
				imagemin.mozjpeg({ quality: 80, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			]));
	// если все файлы, добавляем $
	if (!filepath) stream = stream.pipe(src(uncompressed));
	return stream
		.pipe(dest(path.build.img + extDir))
		.pipe(browsersync.stream());
}

/////////////////////////////////////////////////////////////////

function fonts(cb, filepath = path.src.fonts_ttf) {
	let stream;
	if (!isLiteBuild)
		stream = streamqueue(
			{ objectMode: true },
			src(filepath)
				.pipe(ttf2woff({
					clone: true
				})),
			src(filepath)
				.pipe(ttf2woff2())
		)
	else stream = src(filepath);

	return stream
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
}

function otf(cb, filepath = path.src.fonts_otf) {
	return src(filepath)
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest([$source + '/fonts/']));
}

function fontsStyle() {
	let file_content = fs.readFileSync($source + '/css/fontscript.scss');
	if (file_content == '') {
		fs.writeFile($source + '/css/fontscript.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (let i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (fontname.match(/icon/i)) continue;
					if (c_fontname != fontname) {
						fs.appendFile($source + '/css/fontscript.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

/////////////////////////////////////////////////////////////////

function browserSyncInit() {
	setTimeout(() => {
		browsersync.init({
			server: {
				baseDir: './' + $project + '/'
			},
			port: 3000,
			notify: false
		})
	}, 2000)
}

function watchFiles() {
	function fixPath(path) { return path.replace(/\\/g, "/") }
	function conditionalWatch(item, f) {
		item.on('change', function (path, stats) {
			f(undefined, fixPath(path));
		});
		item.on('add', function (path, stats) {
			f(undefined, fixPath(path));
		});
	}
	gulp.watch([path.watch.css], css);//.on('change', browsersync.reload);
	gulp.watch([path.watch.js], js);
	conditionalWatch(gulp.watch([path.watch.html]), html);
	conditionalWatch(gulp.watch([path.watch.data]), data);
	conditionalWatch(gulp.watch([path.watch.service]), service);
	conditionalWatch(gulp.watch([path.watch.media]), media);
	conditionalWatch(gulp.watch([path.watch.img]), images);
	conditionalWatch(gulp.watch([path.watch.fonts_ttf]), fonts);
	conditionalWatch(gulp.watch([path.watch.fonts_otf]), otf);
}

let start = gulp.parallel(
	watchFiles,
	gulp.series(
		clean,
		otf,
		fonts,
		gulp.parallel(html, css, js, data, service, libs, media, images),
		gulp.parallel(fontsStyle, browserSyncInit),
	)
);

exports.otf = otf;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.images = images;
exports.media = media;
exports.libs = libs;
exports.service = service;
exports.data = data;
exports.js = js;
exports.css = css;
exports.html = html;
exports.start = start;
exports.default = start;