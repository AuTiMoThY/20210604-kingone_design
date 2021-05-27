/*--------------------------------------*\
    inni
    V 2020.0.0
            by AuOzzy
\*--------------------------------------*/

/*
* TOC
*
* custom HTML element
* inniUI
* - inniUI.init 共用  <<入口>>
* - inniUI.disableScroll()
* - inniUI.enableScroll()
* - inniUI.validateEmail(email)
* - inniUI.getTime()
* - inniUI.mmenu  手機版menu 動作
* - inniUI.goTop()
* - inniUI.selectClass()  select 外層加class
* - inniUI.highlight(elm, name) 高亮顯示
* - inniUI.tooltip  HTML元素 - 小提示
* inniPopup
* - inniPopup.init
* - inniPopup.openid(id)
* - inniPopup.closeid(id)
* - inniPopup.closethis(el)
* inniDialog
* - inniDialog.close(el)
* - inniDialog.showMsg(txt)
* ready
*/

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




/**
 * ---------------------------------------------------------------------------------
 * > inniUI
 */
var inniUI = (function(window, jQuery) {
    if (!window.jQuery) { throw new Error("requires jQuery") }

    var $ = window.jQuery;
    var _this = this;

    var breakpoints = {
        "xxs" : 0,
        "xs"  : 375,
        "sm"  : 576,
        "md"  : 768,
        "lg"  : 900,
        "llg" : 1024,
        "xl"  : 1280,
        "xxl" : 1366,
        "uxl" : 1680
    };

    var mqUp = {
        "xxs" : window.matchMedia("(min-width: "+breakpoints.xxs+"px)"),
        "xs"  : window.matchMedia("(min-width: "+breakpoints.xs+"px)"),
        "sm"  : window.matchMedia("(min-width: "+breakpoints.sm+"px)"),
        "md"  : window.matchMedia("(min-width: "+breakpoints.md+"px)"),
        "lg"  : window.matchMedia("(min-width: "+breakpoints.lg+"px)"),
        "llg" : window.matchMedia("(min-width: "+breakpoints.llg+"px)"),
        "xl"  : window.matchMedia("(min-width: "+breakpoints.xl+"px)"),
        "xxl" : window.matchMedia("(min-width: "+breakpoints.xxl+"px)"),
        "uxl" : window.matchMedia("(min-width: "+breakpoints.uxl+"px)"),
    };


    var mqDown = {
        "xxs" : window.matchMedia("(max-width: "+breakpoints.xs+"px)"),
        "xs"  : window.matchMedia("(max-width: "+breakpoints.sm+"px)"),
        "sm"  : window.matchMedia("(max-width: "+breakpoints.md+"px)"),
        "md"  : window.matchMedia("(max-width: "+breakpoints.lg+"px)"),
        "lg"  : window.matchMedia("(max-width: "+breakpoints.llg+"px)"),
        "llg" : window.matchMedia("(max-width: "+breakpoints.xl+"px)"),
        "xl"  : window.matchMedia("(max-width: "+breakpoints.xxl+"px)"),
        "xxl" : window.matchMedia("(max-width: "+breakpoints.uxl+"px)"),
        // "uxl" : window.matchMedia("(max-width: "+breakpoints.+"px)"),
    };

    // reference:
    // http://jsbin.com/xatidu/4/edit?js,output
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {32: 1, 33: 1, 34: 1, 35: 1, 36: 1};

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    return {

        /**
         * >> inniUI.init 共用  <<入口>>
         */
        init: function() {
            var _ = this;

            _.mmenu.init();

            _.selectClass(".inni_frm-select");

        },

        /**
         * ---------------------------------------------------------------------------------
         * >> inniUI.disableScroll()
         */
        disableScroll: function(){
            if (window.addEventListener) { // older FF
                window.addEventListener('DOMMouseScroll', preventDefault, false);
                // window.addEventListener("touchstart", preventDefault, {passive: true} );
            }

            window.onwheel = preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            window.ontouchmove  = preventDefault; // mobile
            document.onkeydown  = preventDefaultForScrollKeys;
        },

        /**
         * ---------------------------------------------------------------------------------
         * >> inniUI.enableScroll()
         */
        enableScroll: function() {
            if (window.removeEventListener)
                window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        },


        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.validateEmail(email)
         */
        // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        validateEmail: function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },


        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.getTime()
         */
        getTime: () => {
            var today = new Date();
            var datetime = {
                'date': today.getFullYear()+'-'+ ("0"+(today.getMonth()+1)).slice(-2)+'-'+ ("0"+today.getDate()).slice(-2),
                'time': ("0"+today.getHours()).slice(-2) + ":" + ("0"+today.getMinutes()).slice(-2)
            }
            return datetime;
        },

        /**
         * ---------------------------------------------------------------------------------
         * >> inniUI.mmenu  手機版menu 動作
         */
        mmenu:(function(){
            return {
                init: function() {
                    let _this = this;

                    $("#m_menu").stop().click(function(event) {
                        (!$(this).hasClass('js-open')) ? _this.open($(this)): _this.close($(this));
                    });
                },

                // mmenu.open
                open: function(el) {
                    // console.log('open');
                    $(el).addClass('js-open');
                    $(".page_aside").addClass('js-show');
                    $("body").addClass('js-show-mmenu');
                },

                // mmenu.close
                close: function(el) {
                    // console.log('close');
                    $(el).removeClass('js-open');
                    $(".page_aside").removeClass('js-show');
                    $("body").removeClass('js-show-mmenu');
                }
            }
        }()),

        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.goTop()
         */
        goTop: function(){
            $(window).scroll(function() {
                if ($("#top").length < 1) return false;
                var gotop_top = $("#top").offset().top;
                if ($(this).scrollTop() > 300) {
                    $("#goTop").addClass('js-show');
                }else {
                    $("#goTop").removeClass('js-show');
                }
            });

            $("#goTop").click(function(event) {
                event.preventDefault();
                // var target = $(this).attr('href').offset().top;
                $("html, body").stop().animate({scrollTop:0}, 300);
            });

        },


        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.selectClass()  select 外層加class
         */
        selectClass: function(el){
            $(el).click(function(event) {
                // event.stopPropagation();
                if (!$(this).hasClass('js-open')) {
                    $(this).addClass('js-open');
                }
                else {
                    $(this).removeClass('js-open');
                }
            });

            $(el).find('select').click(function(event) {
                // event.stopPropagation();
                $(this).removeClass('js-open');
            });

            $(document).click(function() {
                $(this).find(el).removeClass('js-open');
            });
        },

        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.highlight(elm, name) 高亮顯示
         */
        highlight: function(elm, name) {
            $(elm).each(function(index, el) {
                if ($(el).data('highlight') == name) {
                    $(el).addClass('js-highlight');
                }
            });
        },


        /**
         * -------------------------------------------------------------------------------------
         * >> inniUI.tooltip  HTML元素 - 小提示
         */
        tooltip: function(txt) {
            var html = "";
            html += `
            <module-tooltip>${txt}</module-tooltip>
            `;
            return html;
        },



    }
}(window, jQuery));


/**
 * ---------------------------------------------------------------------------------
 * > inniPopup
 */
var inniPopup = (function(inniUI) {
    return {
        /**
         * >> inniPopup.init
         */
        init: function() {
            var _ = this;
            $("[data-popup]").each(function(index, el) {
                var popupID = $(el).data('popup');

                // console.log(popupID)

                $(el).click(function(event) {
                    _.openid(popupID);
                    $(".inni_popup:not(#"+popupID+")").removeClass('js-show');
                });
            });
        },
        /**
         * >> inniPopup.openid(id)
         */
        openid: (id) => {
            $("#" + id).addClass('js-show');
        },
        /**
         * >> inniPopup.closeid(id)
         */
        closeid: (id) => {
            $("#" + id).removeClass('js-show');
        },
        /**
         * >> inniPopup.closethis(el)
         */
        closethis: (el) => {
            $(el).parents(".inni_popup").removeClass('js-show');
        },


    }
}(inniUI));

/**
 * ---------------------------------------------------------------------------------
 * > inniFrm
 */
var inniFrm = (function(inniUI) {
    return {
        /**
         * >> inniFrm.show_error(input, errorEl, txt)
         * 顯示error訊息並focus
         */
        show_error: (input, errorEl, txt) => {
            input.focus();
            errorEl.addClass('js-show').html(txt);
        }
    }
}(inniUI));

/**
 * ---------------------------------------------------------------------------------
 * > inniDialog
 */
var inniDialog = (function(inniUI) {
    return {
        /**
         * >> inniDialog.close(el)
         */
        close: (el) => {
            var $parents = $(el).parents(".inni_dialog");
            $parents.removeClass('js-show');
            setTimeout(function(){
                $parents.remove();

            }, 500);
        },

        elm: (txt) => {
            return `
            <div class="inni_dialog inni_dialog-show_msg">
              <div class="inni_dialog-bg"></div>
              <div class="inni_dialog-wrap">
                <div class="inni_dialog-container" data-simplebar data-simplebar-auto-hide="false">
                  <div class="container-inner text-center">
                    <p class="txt mb-4">${txt}</p>
                    <div class="inni_dialog-btns">
                      <button class="inni_btn inni_btn-blue inni_btn-confirm" type="button" onclick="inniDialog.close(this)">確定</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
        },

        /**
         * >> inniDialog.showMsg(txt)
         */
        showMsg: function(txt) {
            var _ = this;
            // console.log(_)
            $("body").append($(_.elm(txt)).addClass('js-show'));
            $(".inni_dialog-bg").click(function(event) {
                _.close($(this))
            });
        }
    }
}(inniUI));

// > ready
$(function() {

    inniUI.init();
    inniPopup.init();

    // $('.loader-inner').loaders();

    // setTimeout(function(){
    //     $('.inni_loading').animate({
    //         transform: "scale(0)",
    //         opacity: 0
    //     }, 300, "easeInOutCubic", function() {
    //         $('.inni_loading').remove();
    //     });
    // }, 300)

    $('input').each(function(index, el) {
        $(el).focusout(function(event) {
            if ($(this).val() != "") {
                $(this).parents(".form-group").find(".inni_frm-error").removeClass('js-show').html("");
            }
        });
        $(el).keydown(function(event){
            if ($(this).val() != "") {
                $(this).parents(".form-group").find(".inni_frm-error").removeClass('js-show').html("");
            }
        })
    });

    // 登入表單 ----------------------------------------------------------------------
    var $signin_frm = $("#signinFrm");
    $(".$signin_frm-submit").click(function(event) {
        var guiNumber = $("#guiNumber").val();
        var userId = $("#userId").val();
        var userPw = $("#userPw").val();
        var code = $("#verCode").val();

        var $guinumber_error = $(".inni_frm-error[data-error='guinumber']");
        var $id_error = $(".inni_frm-error[data-error='id']");
        var $pw_error = $(".inni_frm-error[data-error='pw']");
        var $code_error = $(".inni_frm-error[data-error='vercode']");

        // 判斷是否空值
        if (guiNumber == '') {
            inniFrm.show_error($("#guiNumber"), $guinumber_error, "請輸入統編");
            return false;
        }
        if (userId == '') {
            inniFrm.show_error($("#userId"), $id_error, "請輸入帳號");
            return false;
        }
        if (userPw == '') {
            inniFrm.show_error($("#userPw"), $pw_error, "請輸入密碼");
            return false;
        }
        if (code == '') {
            inniFrm.show_error($("#verCode"), $code_error, "請輸入驗證碼");
            return false;
        }
        $$signin_frm.submit();
    });

    // 忘記密碼表單 ----------------------------------------------------------------------
    var $forget_pw_frm = $("#forgetPwFrm");
    $(".forget_pw_frm-submit").click(function(event) {
        var signupId = $("#signupId").val();
        var email = $("#email").val();

        var $signupid_error = $(".inni_frm-error[data-error='signupid']");
        var $email_error = $(".inni_frm-error[data-error='email']");


        // 判斷是否空值
        if (signupId == '') {
            inniFrm.show_error($("#signupId"), $signupid_error, "請輸入註冊帳號");
            return false;
        }
        if (email == '') {
            inniFrm.show_error($("#email"), $email_error, "請輸入信箱");
            return false;
        }

        $forget_pw_frm.submit();
    });
});
