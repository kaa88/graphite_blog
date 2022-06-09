// Hello World!

//////////////////////////////////////////////

// Cookies
// Example: 
// setCookie({
// 		name: '_cookies', // required
// 		value: 'true', // required
// 		expires: 30, // expire time in days (can be negative to delete cookie)
// 		// *any other supported params*
// 	},
// 	true // log formatted cookie string in console
// );

function setCookie(params = {}, log) {
	if (!params.name || !params.value) return console.log('Error: Required cookie "name" or "value" is missing.');

	let cookieArr = [];
	cookieArr.push(encodeURIComponent(params.name) + '=' +  encodeURIComponent(params.value));

	if (params.expires) {
		let d = new Date();
		d.setTime(d.getTime() + (params.expires*24*60*60*1000));
		cookieArr.push('expires=' + d.toUTCString());
	}

	let entries = Object.entries(params);
	for (let i = 0; i < entries.length; i++) {
		if (entries[i][0] == 'name' || entries[i][0] == 'value' || entries[i][0] == 'expires') continue;
		cookieArr.push(entries[i][0] + (entries[i][1] ? ('=' + entries[i][1]) : ''));
	}

	let cookieStr = cookieArr.join('; ');
	document.cookie = cookieStr;
	if (log) console.log('Setting up cookie: ' + cookieStr);
}

function getCookie() {
	let cookiesArr = decodeURIComponent(document.cookie).split('; '),
		cookiesObj = {};
	for (let i = 0; i < cookiesArr.length; i++) {
		let split = cookiesArr[i].split('=');
		cookiesObj[split[0]] = split[1];
	}
	return cookiesObj;
}

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
/*
	Init params {obj}:
	- timeout - timeout between document is loaded and loadscreen begins to fade (default = 0)
	- scrollToTop - force scroll document to top on page reload (default = false)
*/
const loadscreen = {
	init: function(params = {}) {
		this.elem = document.querySelector('.loadscreen');
		if (!this.elem) return;
		let that = this;
		document.body.classList.add('_locked');
		window.addEventListener('load', () => {
			setTimeout(() => {
				document.body.classList.remove('_locked');
				if (params.scrollToTop) window.scrollTo({top: 0, behavior: 'instant'});
				that.elem.classList.remove('_locked');
			}, params.timeout || 0)
		})
	}
}
loadscreen.init({
	timeout: 1000,
	// scrollToTop: true
})

//////////////////////////////////////////////

// JS Media Queries
/* 
	Module checks window resizing and runs funcs on breakpoints.
	There is 1 more index than number of breakpoints (from 0px to 1st breakpoint).
	Some modules use 'mobile' variable to check mobile or desktop view, 
	make sure it matches with CSS.

	Useful output:
	- jsMediaQueries.mobile
	- jsMediaQueries.stateIndex
	
	Init params {obj}: breakpoints - {obj}
*/
const jsMediaQueries = {
	init: function(params = {}) {
		this.mobile = parseFloat(getComputedStyle(document.body).getPropertyValue('--media-mobile')) || 768;
		this.breakpoints = params.breakpoints || null;
		if (!this.breakpoints) return;
		this.breakpoints.keys = Object.keys(this.breakpoints);
		for (let i = 0; i < this.breakpoints.keys.length; i++) {
			this.breakpoints.keys[i] = Number(this.breakpoints.keys[i]);
		}
		this.breakpoints.keys.push(0);
		this.breakpoints.keys.sort((a,b) => {return a - b});
		window.addEventListener('resize', this.check.bind(this));
		this.check(0, true);
	},
	check: function(e, init = false) {
		for (let i = 0; i < this.breakpoints.keys.length; i++) {
			if (window.innerWidth > this.breakpoints.keys[i]) this.state = this.breakpoints.keys[i];
			else break;
		}
		if (init) this.prev_state = this.state;
		if (this.state != this.prev_state && !init) {
			if (this.state > this.prev_state) this.breakpoints[this.state]();
			else this.breakpoints[this.prev_state]();
			this.prev_state = this.state;
		}
	}
}
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
/* 
	Module prevents window scrolling with menu, modals, etc. and
	prevents content jumps when scrollbar fades out.
	Script will find elements in default groups (main, footer) and 
	set 'padding-right' property to them.
	You can exclude them by setting a 'useDefaultGroups' param to 'false'.
	Header is not a default group, these elems must be added manually.
	
	Set an additional elems to list by setting classes to HTML:
	- 'scroll-lock-item-p' class - for static elems ('padding-right' prop.)
	- 'scroll-lock-item-m' class - for fixed elems ('margin-right' prop.)
	- 'scroll-lock-item-pm' class - for static elems that will be hidden in menu
		(they will get a 'padding-right' prop. only on desktop width)

	Usable functions: 
		scrollLock.lock()
		scrollLock.unlock( #timeout# )

	Init params {obj}: useDefaultGroups (default = true)
*/
const scrollLock = {
	refs: {
		mobile: jsMediaQueries.mobile
	},
	defaultElems: ['main', 'footer'],
	paddingItemClassName: 'scroll-lock-item-p',
	paddingMenuItemClassName: 'scroll-lock-item-pm',
	marginItemClassName: 'scroll-lock-item-m',
	lockedClassName: '_locked',

	init: function(params = {}) {
		this.paddingItems = document.querySelectorAll('.' + this.paddingItemClassName);
		this.paddingMenuItems = document.querySelectorAll('.' + this.paddingMenuItemClassName);
		this.marginItems = document.querySelectorAll('.' + this.marginItemClassName);

		if (params.useDefaultGroups === false || params.useDefaultGroups === 'false')
			this.useDefaultGroups = false;
		else this.useDefaultGroups = true;

		if (this.useDefaultGroups) {
			let selector = '';
			for (let i = 0; i < this.defaultElems.length; i++) {
				selector += '.' + this.defaultElems[i] + '>*';
				if (i < this.defaultElems.length - 1) selector += ',';
			}
			let defaultItems = document.querySelectorAll(selector);
			let joinedPaddingItems = Array.from(defaultItems);
			for (let i = 0; i < this.paddingItems.length; i++) {
				let exist = false;
				for (let j = 0; j < defaultItems.length; j++) {
					if (defaultItems[j] == this.paddingItems[i]) exist = true;
				}
				if (!exist) joinedPaddingItems.push(this.paddingItems[i]);
			}
			this.paddingItems = joinedPaddingItems;
		}
	},

	lock: function() {
		if (document.body.classList.contains(this.lockedClassName)) return;
		this.scrollbarWidth = window.innerWidth - document.body.offsetWidth;
		let that = this;
		function f(items, prop) {
			for (let i = 0; i < items.length; i++) {
				items[i][prop] = parseFloat(getComputedStyle(items[i])[prop]);
				items[i].style[prop] = items[i][prop] + that.scrollbarWidth + 'px';
			}
		}
		if (window.innerWidth > this.refs.mobile)
			f(this.paddingMenuItems, 'paddingRight');
		f(this.paddingItems, 'paddingRight');
		f(this.marginItems, 'marginRight');
		document.body.classList.add(this.lockedClassName);
	},

	unlock: function(timeout = 0) {
		let that = this;
		setTimeout(() => {
			function f(items, prop) {
				for (let i = 0; i < items.length; i++) {
					items[i].style[prop] = '';
				}
			}
			f(this.paddingMenuItems, 'paddingRight');
			f(this.paddingItems, 'paddingRight');
			f(this.marginItems, 'marginRight');
			document.body.classList.remove(that.lockedClassName);
		}, timeout);
	}
}
scrollLock.init()

//////////////////////////////////////////////

// Transition lock
/* 
	Module prevents double-clicking on transitions, e.g. when menu slides.
	Use: if (transitionLock.check( #timeout# )) return;
*/
const transitionLock = {
	locked: false,
	check: function(timeout = 0) {
		let that = this,
		    result = this.locked;
			 if (that.locked == false) {
			that.locked = true;
			setTimeout(function(){
				that.locked = false;
			}, timeout);
		}
		return result;
	}
}

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
/* 
	Set transition timeout in CSS only.
	
	Init params {obj}: 
	- elem - element name (default = 'modal'),
	- linkName - modal link name (default = 'modal-link')
	- on: {'modal-window': {open, close}} - event function(event, content, timeout){}

	On-func example:
	modal.init({
		on: {
			'modal-contact': {
				close: function(event, content, timeout) {setTimeout(() => {formToEmail.clean(document.querySelector('.question-form'))}, 700)}
			},
			'modal-imgpreview': {
				open: function(event, content, timeout) {
					let source = event.currentTarget.children[event.currentTarget.children.length-1];
					let img = document.querySelector('#modal-imgpreview img');
					img.src = source.getAttribute('src').replace('.','-preview.');
					if (source.srcset) img.srcset = source.srcset.replace('@2x.','-preview@2x.');
					else img.srcset = '';
				},
				close: function(event, content) {
					let img = document.querySelector('#modal-imgpreview img');
					setTimeout(() => {
						img.src = img.srcset = '';
					}, modal.timeout)
				},
			},
			'modal-video': {
				open: function(event, content, timeout) {setTimeout(() => {videoPlayer.play(content)}, timeout)},
				close: function(event, content, timeout) {videoPlayer.pause(content)}
			}
		}
	})
*/
const modal = {
	refs: {
		translock: transitionLock,
		scrlock: scrollLock,
		// header: header.menu.menuElem
	},
	init: function(params = {}){
		this.elemName = params.elem || 'modal';
		this.elem = document.querySelector('.' + this.elemName);
		if (!this.elem) return;
		this.timeout = parseFloat(getComputedStyle(document.body).getPropertyValue('--timer-modal'))*1000 || 0;
		this.windows = this.elem.querySelectorAll('.' + this.elemName + '__window');
		this.links = document.querySelectorAll(params.linkName ? '.' + params.linkName : '.modal-link');
		let that = this;
		for (let i = 0; i < this.links.length; i++) {
			this.links[i].addEventListener('click', this.open.bind(this));
		}
		this.elem.addEventListener('click', function(e) {
			if (!e.target.closest('.' + this.elemName + '__wrapper')) this.closeAll();
		}.bind(this));
		let closeButtons = this.elem.querySelectorAll('.' + this.elemName + '__close-button');
		for (let i = 0; i < closeButtons.length; i++) {
			closeButtons[i].addEventListener('click', this.closeThis.bind(this));
		}
		this.on = params.on || {};
	},
	open: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		e.preventDefault();
		let currentModal = this.elem.querySelector(e.currentTarget.getAttribute('href'));
		currentModal.classList.add('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].open)
			this.on[currentModal.id].open(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				this.timeout
			);
		modal.check();
	},
	closeThis: function(e){
		if (this.refs.translock.check(this.timeout)) return;
		let currentModal = e.target.closest('.' + this.elemName + '__window');
		currentModal.classList.remove('_open');
		if (this.on[currentModal.id] && this.on[currentModal.id].close)
			this.on[currentModal.id].close(
				e, 
				currentModal.querySelector('.' + this.elemName + '__content > *:not(.' + this.elemName + '__close-button)'),
				this.timeout
			);
		modal.check();
	},
	closeAll: function(){
		if (this.refs.translock.check(this.timeout)) return;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) {
				this.windows[i].classList.remove('_open');
				if (this.on[this.windows[i].id] && this.on[this.windows[i].id].close)
					this.on[this.windows[i].id].close(0,0,this.timeout);
			}
		}
		modal.check();
	},
	check: function(){
		let openedWindows = 0;
		for (let i = 0; i < this.windows.length; i++) {
			if (this.windows[i].classList.contains('_open')) openedWindows++;
		}
		if (openedWindows) {
			this.elem.classList.add('_visible');
			this.refs.scrlock.lock();
		}
		else {
			this.elem.classList.remove('_visible');
			// if (!this.refs.header.classList.contains('_active'))
				this.refs.scrlock.unlock(this.timeout);
		}
	}
}
modal.init()

//////////////////////////////////////////////

// Popup
/*	
	Init params {obj}:
	- elem - element name (default = 'popup')
*/
class Popup {
	constructor(params = {}) {
		this.elemName = params.elem || 'popup';
		this.elem = document.querySelector('.' + this.elemName);
		if (!this.elem) return;

		this.isLoaded = true;

		let closeBtn = this.elem.querySelector('.popup__close-btn');
		if (closeBtn) closeBtn.addEventListener('click', this.close.bind(this));
	}
	open() {
		if (this.isLoaded)
			this.elem.classList.add('_visible');
	}
	close() {
		if (this.isLoaded)
			this.elem.classList.remove('_visible');
	}
}
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
const spoiler = {
	names: {
		spoiler: '.spoiler',
		wrapper: '.spoiler__wrapper'
	},
	init: function() {
		this.wrappers = document.querySelectorAll(this.names.wrapper);
		if (this.wrappers.length == 0) return;
		this.calcHeight();
		let that = this;
		window.addEventListener('load', () => {
			for (let i = 0; i < that.wrappers.length; i++) {
				that.wrappers[i].closest(that.names.spoiler).children[0].addEventListener('click', that.toggle.bind(that));
			}
			that.calcHeight(); // calc in case fonts are not loaded yet, so the height might be wrong
			window.addEventListener('resize', that.calcHeight.bind(that));
		})
	},
	calcHeight: function() {
		let changes = false;
		for (let i = 0; i < this.wrappers.length; i++) {
			let newMaxHeight = this.wrappers[i].children[0].offsetHeight;
			if (newMaxHeight != this.wrappers[i].itemMaxHeight)
				changes = true;
			this.wrappers[i].itemMaxHeight = newMaxHeight;
		};
		if (changes) this.setHeight();
	},
	setHeight() {
		for (let i = 0; i < this.wrappers.length; i++) {
			if (this.wrappers[i].closest(this.names.spoiler).classList.contains('_visible'))
				this.wrappers[i].style.height = this.wrappers[i].itemMaxHeight + 'px';
			else
				this.wrappers[i].style.height = '';
		}
	},
	toggle: function(e) {
		e.currentTarget.parentElement.classList.toggle('_visible');
		this.setHeight();
	}
}
// }const spoiler = {
// 	init: function() {
// 		this.elems = document.querySelectorAll('.spoiler');
// 		if (this.elems.length == 0) return;
// 		this.calcHeight();
// 		let that = this;
// 		window.addEventListener('load', () => {
// 			for (let i = 0; i < that.elems.length; i++) {
// 				that.elems[i].children[0].addEventListener('click', that.toggle.bind(that));
// 			}
// 			that.calcHeight(); // recalc in case fonts are not loaded yet, so the height might be wrong
// 			window.addEventListener('resize', that.calcHeight.bind(that));
// 		})
// 	},
// 	calcHeight: function() {
// 		let changes = false;
// 		for (let i = 0; i < this.elems.length; i++) {
// 			let newMinHeight = this.elems[i].children[0].offsetHeight;
// 			let newMaxHeight = newMinHeight + this.elems[i].children[1].offsetHeight;
// 			if (newMinHeight != this.elems[i].itemMinHeight || newMaxHeight != this.elems[i].itemMaxHeight)
// 				changes = true;
// 			this.elems[i].itemMinHeight = newMinHeight;
// 			this.elems[i].itemMaxHeight = newMaxHeight;
// 		};
// 		if (changes) this.setHeight();
// 	},
// 	setHeight() {
// 		for (let i = 0; i < this.elems.length; i++) {
// 			if (this.elems[i].classList.contains('_visible'))
// 				this.elems[i].style.height = this.elems[i].itemMaxHeight + 'px';
// 			else
// 				this.elems[i].style.height = this.elems[i].itemMinHeight + 'px';
// 		}
// 	},
// 	toggle: function(e) {
// 		e.currentTarget.parentElement.classList.toggle('_visible');
// 		this.setHeight();
// 	}
// }
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
