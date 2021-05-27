// https://www.geeksforgeeks.org/how-to-force-input-field-to-enter-numbers-only-using-javascript/
function onlyNumberKey(evt) {
    // Only ASCII charactar in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}


// > custom HTML element
// 頁碼
class Pagination extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      // Element functionality written in here
    }
}
customElements.define('module-pagination', Pagination);

// 提示框
class Tooltip extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      // Element functionality written in here
    }
}
customElements.define('module-tooltip', Tooltip);


// 最新消息清單
class newsList extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      // Element functionality written in here
    }
}
customElements.define('module-newslist', newsList);


// 產品清單
class productsList extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      // Element functionality written in here
    }
}
customElements.define('module-productslist', productsList);



// swiper default setting
var defalutPag = () => {
    return {
        el: '.swiper-pagination',
    }
}
var defalutNav = () => {
    return {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
}
