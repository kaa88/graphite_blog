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