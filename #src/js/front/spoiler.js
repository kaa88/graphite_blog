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