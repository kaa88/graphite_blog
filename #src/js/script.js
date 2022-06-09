// Hello World!

//////////////////////////////////////////////

// Cookies
@@include('front/cookies.js')

let cookies = getCookie();
console.log(cookies);

//////////////////////////////////////////////

// Theme & Lang
let pageOptions = {
	themePrefix: 'theme-',
	themeName: 'dark',
	themeTimer: 1000,
	langPrefix: 'lang-',
	langName: 'ru',
	setOpt: function(param) {
		if (!param) return;
		document.body.classList.toggle(param);
	},
};
console.log(pageOptions)

if (cookies) {
	if (cookies.theme) pageOptions.setOpt(pageOptions.themePrefix + cookies.theme);
	if (cookies.lang) pageOptions.setOpt(pageOptions.langPrefix + cookies.lang);
}

function setupControls() {
	let themeBtn = document.querySelector('.controls__theme');
	if (themeBtn) themeBtn.addEventListener('click', () => {
		if (transitionLock.check(pageOptions.themeTimer)) return;
		pageOptions.setOpt(pageOptions.themePrefix + pageOptions.themeName);
		if (cookies && cookies.cookies_accepted) {
			if (document.body.classList.contains('theme-dark')) {
				setCookie({
					name: 'theme',
					value: pageOptions.themeName,
					expires: 365
				});
			}
			else {
				setCookie({
					name: 'theme',
					value: pageOptions.themeName,
					expires: -1
				});
			}
		}
	})
	let langBtn = document.querySelector('.controls__lang');
	if (langBtn) langBtn.addEventListener('click', () => {
		if (transitionLock.check(1000)) return;
		pageOptions.setOpt(pageOptions.langPrefix + pageOptions.langName);
			// setCookie({
			// 	name: 'lang',
			// 	value: 'en',
			// 	expires: 365
			// });
		})
}
setupControls();

//////////////////////////////////////////////

// Random
// @ @include('front/random.js')

//////////////////////////////////////////////

// Loadscreen
@@include('front/loadscreen.js')
loadscreen.init({
	timeout: 1000,
	// scrollToTop: true
})

//////////////////////////////////////////////

// JS Media Queries
@@include('front/js_media_queries.js')
jsMediaQueries.init({
	breakpoints: {
		568: () => {},
		782: () => {
			// header.mobileViewService(); // required by Header module
		},
		1228: () => {},
	}
})

//////////////////////////////////////////////

// Scroll lock
@@include('front/scroll_lock.js')
scrollLock.init()

//////////////////////////////////////////////

// Transition lock
@@include('front/trans_lock.js')

//////////////////////////////////////////////

// Header
// @ @include('front/header.js')
// header.init({
// 	menu: true,
// 	submenu: true,
// 	hidingHeader: true,
// 	elemAboveHeader: true
// })


//////////////////////////////////////////////

// Modal window
@@include('front/modal.js')
modal.init()

//////////////////////////////////////////////

// Popup
@@include('front/popup.js')
let test_popup = new Popup({
	// elem: 'test-popup'
});
// Place each popup's code below
const cookieAlert = {
	popup: test_popup,
	aboutLink: document.querySelector('.cookie-alert__link'),
	closeButton: document.querySelector('.cookie-alert__close'),
	acceptButton: document.querySelector('.cookie-alert__accept'),
}
cookieAlert.init = function() {
	if (cookies && cookies.cookies_accepted != 'true') {
		this.popup.open();
	}
	if (this.aboutLink) {
		this.aboutLink.addEventListener('click', function() {
			this.closest('.cookie-alert').classList.add('_opened');
		})
	}
	if (this.closeButton) {
		this.closeButton.addEventListener('click', () => {
			this.popup.close();
		})
	}
	if (this.acceptButton) {
		this.acceptButton.addEventListener('click', () => {
			setCookie({
				name: 'cookies_accepted',
				value: 'true',
				expires: 365
			});
			this.popup.close();
		})
	}
}
window.addEventListener('load', () => {
	setTimeout(() => {
		cookieAlert.init();
	}, 2000);
})

//////////////////////////////////////////////

// Select
// @ @include('front/select.js')
// const form_select = new Select({
// 	elem: 'form__select',
// 	firstOptSelected: true,
// 	onselect: (selection) => {console.log(selection)}
// })

//////////////////////////////////////////////

// Accordion
// @ @include('front/accordion_js.js')
// const accordion = new Accordion({
// 	elem: '.js__accordion',
// 	isOpened: true
// });

//////////////////////////////////////////////

// Simple counter
// @ @include('front/simple_counter.js')
// const simpleCounter = new SimpleCounter({
// 	launcher: '.test-counter-button',
// 	output: '.test-counter',
// 	goal: 51806,
// 	timeout: 2,
// })
// simpleCounter.start()

//////////////////////////////////////////////

// Input range colored
// @ @include('front/input_range_colored.js')
// const iRangeClr = new InputRangeColored({
// 	elem: 'input-range'
// })

//////////////////////////////////////////////

// Input range double
// @ @include('front/input_range_double.js')
// const iRangeDbl = new InputRangeDouble({
// 	elem: 'form__input-range-dbl',
// 	start: 200,
// 	end: 492,
// 	thumbs: [250, 400],
// 	bubble: true,
// 	results: ['form__ir-result1', 'form__ir-result2']
// })

//////////////////////////////////////////////

// Spoiler
@@include('front/spoiler.js')
spoiler.init();

//////////////////////////////////////////////

// Tabs
// @ @include('front/tabs.js')

//////////////////////////////////////////////

// Up-button
// @ @include('front/up_button.js')
// upButton.init();

//////////////////////////////////////////////

// Intersection
// @ @include('front/intersection.js')

//////////////////////////////////////////////

// Parallax
// @ @include('front/parallax.js')
// const parallax = new Parallax({
// 	parallaxElem: '.parallax',
// 	scrollElem: '.container',
// 	start: 500,
// 	distance: 30,
// })

//////////////////////////////////////////////

// Pagination
// @ @include('front/pagination.js')
// const pagination = new Pagination({
// 	elem: '.pagination',
// 	maxLength: 8,
// })

//////////////////////////////////////////////

// Video player
// @ @include('front/video_player.js')
// videoPlayer.init(80);

//////////////////////////////////////////////

// Swiper
// const swiper = new Swiper('.banner__swiper', {
// 	navigation: {
// 		prevEl: '.swiper-button-prev',
// 		nextEl: '.swiper-button-next',
// 	},
// 	pagination: {
// 		el: '.swiper-pagination',
// 		type: 'bullets',
// 	},
// 	loop: true,
// 	loopAdditionalSlides: 2,
// 	speed: 700,
// 	spaceBetween: 15,
// 	autoplay: {
// 		delay: 5000,
// 		disableOnInteraction: false,
// 		pauseOnMouseEnter: true,
// 	},
// 	breakpoints: {
// 		782: {}
// 	},
// })

//////////////////////////////////////////////

// Print version QR-code
// @ @include('front/qr_code.js')
// printQRcode();

//////////////////////////////////////////////

// Send form to email
// @ @include('back/form_to_email.js')
// formToEmail.init(true);

//////////////////////////////////////////////

// JSON Load
// @ @include('back/json_load.js')

//////////////////////////////////////////////
