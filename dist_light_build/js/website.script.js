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
			header.mobileViewService(); // required by Header module
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
/* 
	Set transition timeout in CSS only
	
	Init params {obj}: (defaults = false)
	- menu - add menu module
	- submenu - add submenu module
	- hidingHeader - add hidingHeader module
	- elemAboveHeader - if there is something above the header, e.g. WordPress adminbar, set 'true' to calculate it as well
*/
const header = {
	refs: { // dependences
		mobile: jsMediaQueries.mobile,
		translock: transitionLock,
		scrlock: scrollLock
	},
	names: {
		elemAboveHeader: '#wpadminbar',
		header: '.header',
		menu: '.header-menu-hide-wrapper',
		menuItems: '.header-menu__items',
		menuItem: '.header-menu__item',
		menuOpenBtn: '.header-menu-open-btn',
		menuCloseBtn: '.header-menu-close-btn',
		menuBackBtn: '.header-submenu-back-btn',
		menuArea: '.header-menu-turn-off-area',
		menuOptions: '#header-menu-options',
		submenu: '.header-submenu-hide-wrapper',
		submenuDropLink: '.submenu-drop-link',
		thisPageClass: 'this-page',
		varTimer: '--timer-menu',
		varHeight: '--header-height',
		varTop: '--header-offset-top',
		varTopDef: '--header-offset-top-default',
	},
	init: function(params = {}) {
		this.headerElem = document.querySelector(this.names.header);
		let timeout = parseFloat(getComputedStyle(document.body).getPropertyValue(this.names.varTimer))*1000 || 0;

		this.headerHeight =
		this.headerHeightPrev =
		this.headerOffsetTop =
		this.headerOffsetTopPrev =
		this.headerOffsetTopDefault =
		this.headerOffsetTopDefaultPrev = 0;

		let elemAboveHeader = document.querySelector(this.names.elemAboveHeader);
		if (params.elemAboveHeader && elemAboveHeader)
			this.elemAboveHeader = elemAboveHeader;
		else this.elemAboveHeader = false;

		this.calcHeaderHeight();
		window.addEventListener('resize', this.calcHeaderHeight.bind(this));

		if (params.menu) this.menu.init(this, timeout, this.names);
		if (params.submenu) this.submenu.init(this, timeout, this.names);
		if (params.hidingHeader) window.addEventListener('load', () => this.hidingHeader.init(this));
	},
	calcHeaderHeight: function() {
		// This func controls the mobile menu height variable in css
		this.headerHeight = parseFloat(getComputedStyle(this.headerElem).height);
		if (this.elemAboveHeader) {
			this.headerOffsetTopDefault = this.headerOffsetTop = parseFloat(getComputedStyle(this.elemAboveHeader).height);
		}
		else this.headerOffsetTopDefault = this.headerOffsetTop = 0;
		this.setCssVar();
		this.hidingHeader.calc();
	},
	setCssVar: function() {
		if (this.headerHeight != this.headerHeightPrev) {
			document.body.style.setProperty(this.names.varHeight, this.headerHeight + 'px');
			this.headerHeightPrev = this.headerHeight;
		}
		if (this.headerOffsetTop != this.headerOffsetTopPrev) {
			document.body.style.setProperty(this.names.varTop, this.headerOffsetTop + 'px');
			this.headerOffsetTopPrev = this.headerOffsetTop;
		}
		if (this.headerOffsetTopDefault != this.headerOffsetTopDefaultPrev) {
			document.body.style.setProperty(this.names.varTopDef, this.headerOffsetTopDefault + 'px');
			this.headerOffsetTopDefaultPrev = this.headerOffsetTopDefault;
		}
	},
	mobileViewService: function() {
		this.menu.toggle();
		this.menu.hideOnViewChange();
		// this.hidingHeader.calc();
	},

	// Menu
	menu: {
		isLoaded: false,
		init: function(that, timeout, names) {
			this.isLoaded = true;
			this.root = that;
			this.timeout = timeout;
			this.menuElem = this.root.headerElem.querySelector(names.menu);
			this.buttons = this.root.headerElem.querySelectorAll(`${names.menuOpenBtn}, ${names.menuCloseBtn}, ${names.menuArea}`);
			let newMenu = this.menuElem.querySelector(names.menuItems);
			let options = {};
			if (typeof headerMenuOptions !== 'undefined') options = headerMenuOptions;
			if (options.links) {
				let clone = {};
				for (let i = 0; i < newMenu.children.length; i++) {
					clone[newMenu.children[i].dataset.name] = newMenu.children[i];
				}
				newMenu.innerHTML = '';
				for (let i = 0; i < options.links.length; i++) {
					newMenu.appendChild(clone[options.links[i]]);
				}
			}
			if (options.activeLink) {
				for (let i = 0; i < newMenu.children.length; i++) {
					if (newMenu.children[i].dataset.name == options.activeLink) {
						newMenu.children[i].firstElementChild.classList.add(names.thisPageClass);
						break;
					}
				}
			}
			options.elem = document.querySelector(names.menuOptions);
			if (options.elem) options.elem.parentElement.removeChild(options.elem);

			for (let i = 0; i < this.buttons.length; i++) {
				this.buttons[i].addEventListener('click', this.toggle.bind(this));
			}
		},
		toggle: function(e) {
			if (!this.isLoaded) return;
			if (this.root.refs.translock.check(this.timeout)) return;
			
			if (this.menuElem.classList.contains('_active')) {
				this.menuElem.classList.remove('_active');
				for (let i = 0; i < this.buttons.length; i++) {
					this.buttons[i].classList.remove('_active');
				}
				this.root.refs.scrlock.unlock(this.timeout);
				this.root.submenu.closeAll(); // submenu reference
			}
			else {
				if (e) {
					this.menuElem.classList.add('_active');
					for (let i = 0; i < this.buttons.length; i++) {
						this.buttons[i].classList.add('_active');
					}
					this.root.refs.scrlock.lock();
					this.root.hidingHeader.scroll(0, true); // hidingHeader reference
				}
			}
		},
		hideOnViewChange: function() {
			// this func prevents menu blinking on mobile view switch
			if (this.isLoaded) {
				let that = this;
				this.menuElem.style.display = 'none';
				setTimeout(() => {
					that.menuElem.style.display = '';
					that.root.calcHeaderHeight();
				}, that.timeout)
			}
		}
	},
	// /Menu

	// SubMenu
	submenu: {
		isLoaded: false,
		init: function(that, timeout, names){
			this.isLoaded = true;
			this.root = that;
			this.timeout = timeout;
			this.sMenuElems = this.root.headerElem.querySelectorAll(names.submenu);
			if (this.sMenuElems.length == 0) {
				console.log('Error: No submenu detected');
				return;
			}
			this.links = this.root.headerElem.querySelectorAll(names.submenuDropLink);
			this.backButtons = this.root.headerElem.querySelectorAll(names.menuBackBtn);
			// if menu-item contains submenu
			if (this.links[0]) {
				if (this.links[0].closest(names.menuItem).querySelector(names.submenu)) this.isOutside = false;
				else this.isOutside = true;
			}
			// setting events
			for (let i = 0; i < this.backButtons.length; i++) {
				this.backButtons[i].addEventListener('click', this.toggle.bind(this));
			}
			for (let i = 0; i < this.links.length; i++) {
				this.links[i].addEventListener('click', this.toggle.bind(this));
				this.links[i].addEventListener('mouseover', this.toggle.bind(this));
				if (!this.isOutside)
					this.links[i].closest(names.menuItem).addEventListener('mouseleave', this.toggle.bind(this));
			}
			if (this.isOutside)
				this.root.headerElem.addEventListener('mouseleave', this.toggle.bind(this));
		},
		toggle: function(e) {
			if (!e) return;
			let that = this, mobile = false;
			if (window.innerWidth <= this.root.refs.mobile) mobile = true;

			function is(name) {
				let str = that.root.names[name];
				if (str.match(/[#.]/)) str = str.substring(1);
				return e.currentTarget.classList.contains(str);
			}
			
			if (mobile) {
				if (e.type == 'click') {
					if (is('submenuDropLink')) this.open(e, mobile);
					if (is('menuBackBtn')) this.close(e, mobile);
				}
			}
			else {
				if (e.type == 'mouseover') {
					if (is('submenuDropLink')) this.open(e, mobile);
				}
				if (e.type == 'mouseleave') {
					if (is('menuItem') || is('header')) this.close(e, mobile);
				}
			}
		},
		open: function(e, m) {
			e.preventDefault();
			if (m && this.root.refs.translock.check(this.timeout)) return;
			if (this.isOutside) {
				for (let i = 0; i < this.links.length; i++) {
					this.links[i].classList.add('_active');
				}
				for (let i = 0; i < this.sMenuElems.length; i++) {
					this.sMenuElems[i].classList.add('_active');
				}
			}
			else {
				e.currentTarget.classList.add('_active');
				e.currentTarget.nextElementSibling.classList.add('_active');
			}
		},
		close: function(e, m) {
			if (m && this.root.refs.translock.check(this.timeout)) return;
			if (this.isOutside) {
				let items = this.root.headerElem.querySelectorAll(`${this.root.names.menuItem} ._active, ${this.root.names.submenu}._active`);
				for (let i = 0; i < items.length; i++) {
					items[i].classList.remove('_active');
				}
			}
			else {
				let parent = e.currentTarget.closest(this.root.names.submenu).parentElement;
				for (let i = 0; i < parent.children.length; i++) {
					parent.children[i].classList.remove('_active');
				}
			}
		},
		closeAll: function() {
			if (this.isLoaded) {
				for (let i = 0; i < this.links.length; i++) {
					this.links[i].classList.remove('_active');
				}
				for (let i = 0; i < this.sMenuElems.length; i++) {
					this.sMenuElems[i].classList.remove('_active');
				}
			}
		}
	},
	// /SubMenu

	// Hiding Header
	hidingHeader: {
		isLoaded: false,
		init: function(that) {
			this.isLoaded = true;
			this.root = that;
			this.hiddenPositionOffset = 0; // set this one if you want to move header by value that differs it's height
			this.firstScroll = true;
			window.addEventListener('scroll', this.scroll.bind(this));
		},
		calc: function() {
			if (!this.isLoaded) return;
			this.Y = this.YPrev = pageYOffset;
			this.diff = 0;
			this.currentPos = this.root.headerOffsetTopDefault;
		},
		scroll: function(e, click) {
			if (!this.isLoaded) return;
			if (window.innerWidth > this.root.refs.mobile) return;

			// this 'if' prevents header's jump after page reloading in the middle of the content
			if (this.firstScroll) {
				this.firstScroll = false;
				this.calc();
				return;
			}
			// click-move
			if (click) {
				this.currentPos = this.root.headerOffsetTop = this.root.headerOffsetTopDefault;
				this.root.setCssVar();
				return;
			}
			// lazyLoad check
			if ((pageYOffset < (this.Y + this.diff) && this.Y > this.YPrev) || (pageYOffset > (this.Y + this.diff) && this.Y < this.YPrev)) {
				this.diff = pageYOffset - this.Y;
			}
			// scroll-move
			let currentPos = this.root.headerOffsetTop;
			let visiblePos = this.root.headerOffsetTopDefault;
			let hiddenPos = visiblePos - this.root.headerHeight - this.hiddenPositionOffset;
			this.YPrev = this.Y;
			this.Y = pageYOffset - this.diff;
			currentPos -= this.Y - this.YPrev;
			if (currentPos > visiblePos) currentPos = visiblePos;
			if (currentPos < hiddenPos) currentPos = hiddenPos;
			this.root.headerOffsetTop = currentPos;
			this.root.setCssVar();
		}
	},
	// /Hiding Header
}
header.init({
	menu: true,
	submenu: true,
	hidingHeader: true,
	elemAboveHeader: true
})

////////////////////////////////////////////////////////////////////

// Modal window
// @ @include('front/modal.js')
// modal.init()

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
// @ @include('front/spoiler.js')
// spoiler.init();

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
