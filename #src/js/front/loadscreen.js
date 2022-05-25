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