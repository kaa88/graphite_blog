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