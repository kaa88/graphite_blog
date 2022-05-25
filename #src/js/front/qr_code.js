/* 
	Init params:
	1) QR-code size in 'px' (square) (default = 100)
*/
function printQRcode(size = 100) {
	let elem = document.querySelector('.header__print-address-qr');
	if (!elem) return;
	let str = '<img src="https://chart.googleapis.com/chart?cht=qr&chs=' + size + 'x' + size + '&choe=UTF-8&chld=H|0&chl=' + window.location.href + '" alt="">';
	elem.innerHTML = str;
}