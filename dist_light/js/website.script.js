// Hello World!

////////////////////////////////////////////////////////////////////

// Random
// @ @include('front/random.js')

////////////////////////////////////////////////////////////////////

// Loadscreen
// @ @include('front/loadscreen.js')
// loadscreen.init({
// 	timeout: 1000,
// 	scrollToTop: true
// })

////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////

// Header
// @ @include('front/header.js')
// header.init({
// 	menu: true,
// 	submenu: true,
// 	hidingHeader: true,
// 	elemAboveHeader: true
// })


////////////////////////////////////////////////////////////////////

// Modal window
// @ @include('front/modal.js')
// modal.init()

////////////////////////////////////////////////////////////////////

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
	this.popup.open();
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
		this.acceptButton.addEventListener('click', function() {
			console.log('accept')
		})
	}
}
window.addEventListener('load', () => {
	setTimeout(() => {
		cookieAlert.init();
	}, 2000);
})

////////////////////////////////////////////////////////////////////

// Select
// @ @include('front/select.js')
// const form_select = new Select({
// 	elem: 'form__select',
// 	firstOptSelected: true,
// 	onselect: (selection) => {console.log(selection)}
// })

////////////////////////////////////////////////////////////////////

// Accordion
// @ @include('front/accordion_js.js')
// const accordion = new Accordion({
// 	elem: '.js__accordion',
// 	isOpened: true
// });

////////////////////////////////////////////////////////////////////

// Simple counter
// @ @include('front/simple_counter.js')
// const simpleCounter = new SimpleCounter({
// 	launcher: '.test-counter-button',
// 	output: '.test-counter',
// 	goal: 51806,
// 	timeout: 2,
// })
// simpleCounter.start()

////////////////////////////////////////////////////////////////////

// Input range colored
// @ @include('front/input_range_colored.js')
// const iRangeClr = new InputRangeColored({
// 	elem: 'input-range'
// })

////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////

// Spoiler
const spoiler = {
	init: function() {
		this.elems = document.querySelectorAll('.spoiler');
		if (this.elems.length == 0) return;
		this.calcHeight();
		let that = this;
		window.addEventListener('load', () => {
			for (let i = 0; i < that.elems.length; i++) {
				that.elems[i].children[0].addEventListener('click', that.toggle.bind(that));
			}
			that.calcHeight(); // recalc in case fonts are not loaded yet, so the height might be wrong
			window.addEventListener('resize', that.calcHeight.bind(that));
		})
	},
	calcHeight: function() {
		let changes = false;
		for (let i = 0; i < this.elems.length; i++) {
			let newMinHeight = this.elems[i].children[0].offsetHeight;
			let newMaxHeight = newMinHeight + this.elems[i].children[1].offsetHeight;
			if (newMinHeight != this.elems[i].itemMinHeight || newMaxHeight != this.elems[i].itemMaxHeight)
				changes = true;
			this.elems[i].itemMinHeight = newMinHeight;
			this.elems[i].itemMaxHeight = newMaxHeight;
		};
		if (changes) this.setHeight();
	},
	setHeight() {
		for (let i = 0; i < this.elems.length; i++) {
			if (this.elems[i].classList.contains('_visible'))
				this.elems[i].style.height = this.elems[i].itemMaxHeight + 'px';
			else
				this.elems[i].style.height = this.elems[i].itemMinHeight + 'px';
		}
	},
	toggle: function(e) {
		e.currentTarget.parentElement.classList.toggle('_visible');
		this.setHeight();
	}
}
spoiler.init();

////////////////////////////////////////////////////////////////////

// Tabs
// @ @include('front/tabs.js')

////////////////////////////////////////////////////////////////////

// Up-button
// @ @include('front/up_button.js')
// upButton.init();

////////////////////////////////////////////////////////////////////

// Intersection
// @ @include('front/intersection.js')

////////////////////////////////////////////////////////////////////

// Parallax
// @ @include('front/parallax.js')
// const parallax = new Parallax({
// 	parallaxElem: '.parallax',
// 	scrollElem: '.container',
// 	start: 500,
// 	distance: 30,
// })

////////////////////////////////////////////////////////////////////

// Pagination
// @ @include('front/pagination.js')
// const pagination = new Pagination({
// 	elem: '.pagination',
// 	maxLength: 8,
// })

////////////////////////////////////////////////////////////////////

// Video player
// @ @include('front/video_player.js')
// videoPlayer.init(80);

////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////

// Print version QR-code
// @ @include('front/qr_code.js')
// printQRcode();

////////////////////////////////////////////////////////////////////

// Send form to email
// @ @include('back/form_to_email.js')
// formToEmail.init(true);

////////////////////////////////////////////////////////////////////

// JSON Load
// @ @include('back/json_load.js')

////////////////////////////////////////////////////////////////////
