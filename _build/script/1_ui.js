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

            console.log("QQ")

            // _.mmenu.init();

            // _.selectClass(".inni_frm-select");

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

