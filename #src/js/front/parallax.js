/* 
	Only vertical orientation.

	Calculates onScroll parallax effect of the element that is contained in another element
	or	in a <body>. ParallaxElem must be styled with 'position: fixed/absolute'.
	By default script will calc the move distance of the parallaxElem depending on 
	the scrollElem's scroll height. Also there is a 'start' point calculated from a
	css 'top' value of the elem. You can set up 'start' and 'distance' manually.

	Init params {obj}:
	- parallaxElem - parallax elem selector (default = '.parallax')
	- scrollElem - scrolling elem selector (default = 'document.body')
	- start - 'top' property value at the scroll start (default = *css elem 'top' value*)
	- distance - elem's move distance from the start (default = 0)
*/
class Parallax {
	constructor(params = {}) {
		if (params.parallaxElem) this.parallaxElem = document.querySelector(params.parallaxElem);
		else this.parallaxElem = document.querySelector('.parallax');
		if (!this.parallaxElem) return;

		if (params.scrollElem) {
			this.scrollElem = document.querySelector(params.scrollElem);
			this.useWindow = false;
		}
		else {
			this.scrollElem = document.body;
			this.useWindow = true;
		}
		if (!this.scrollElem) return;

		this.start = params.start || parseFloat(getComputedStyle(this.parallaxElem).top);
		this.distance = params.distance || 0;
		this.calc();

		let eventListener = this.useWindow ? window : this.scrollElem;
		eventListener.addEventListener('scroll', this.move.bind(this));
		eventListener.addEventListener('resize', this.calc.bind(this));
	}
	calc() {
		let wrapHeight = this.useWindow ? window.innerHeight : this.scrollElem.clientHeight;
		this.scrollDistance = this.scrollElem.scrollHeight - wrapHeight;
		this.parallaxDistance = this.distance ? this.distance : (this.parallaxElem.offsetHeight - wrapHeight);
		this.move();
	}
	move() {
		if (this.parallaxDistance > 0) {
			let scroll = this.useWindow ? pageYOffset : this.scrollElem.scrollTop;
			this.parallaxElem.style.top = -this.parallaxDistance * scroll / this.scrollDistance + this.start + 'px';
		}
	}
}