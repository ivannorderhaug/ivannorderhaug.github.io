(function(e) {
    var D = function() {
        if (!D.cache.hasOwnProperty(arguments[0])) {
            D.cache[arguments[0]] = D.parse(arguments[0])
        }
        return D.format.call(null, D.cache[arguments[0]], arguments)
    };
    D.format = function(e, t) {
        var n = 1,
            r = e.length,
            i = "",
            u, a = [],
            o, s, l, f, c, p;
        for (o = 0; o < r; o++) {
            i = m(e[o]);
            if (i === "string") {
                a.push(e[o])
            } else if (i === "array") {
                l = e[o];
                if (l[2]) {
                    u = t[n];
                    for (s = 0; s < l[2].length; s++) {
                        if (!u.hasOwnProperty(l[2][s])) {
                            throw D('[sprintf] property "%s" does not exist', l[2][s])
                        }
                        u = u[l[2][s]]
                    }
                } else if (l[1]) {
                    u = t[l[1]]
                } else {
                    u = t[n++]
                }
                if (/[^s]/.test(l[8]) && m(u) !== "number") {
                    throw D("[sprintf] expecting number but found %s", m(u))
                }
                switch (l[8]) {
                    case "b":
                        u = u.toString(2);
                        break;
                    case "c":
                        u = String.fromCharCode(u);
                        break;
                    case "d":
                        u = parseInt(u, 10);
                        break;
                    case "e":
                        u = l[7] ? u.toExponential(l[7]) : u.toExponential();
                        break;
                    case "f":
                        u = l[7] ? parseFloat(u).toFixed(l[7]) : parseFloat(u);
                        break;
                    case "o":
                        u = u.toString(8);
                        break;
                    case "s":
                        u = (u = String(u)) && l[7] ? u.slice(0, l[7]) : u;
                        break;
                    case "u":
                        u = u >>> 0;
                        break;
                    case "x":
                        u = u.toString(16);
                        break;
                    case "X":
                        u = u.toString(16).toUpperCase();
                        break
                }
                u = /[def]/.test(l[8]) && l[3] && u >= 0 ? " +" + u : u;
                c = l[4] ? l[4] === "0" ? "0" : l[4].charAt(1) : " ";
                p = l[6] - String(u).length;
                f = l[6] ? d(c, p) : "";
                a.push(l[5] ? u + f : f + u)
            }
        }
        return a.join("")
    };
    D.cache = {};
    D.parse = function(e) {
        var t = e,
            n = [],
            r = [],
            i = 0;
        while (t) {
            if ((n = /^[^\x25]+/.exec(t)) !== null) {
                r.push(n[0])
            } else if ((n = /^\x25{2}/.exec(t)) !== null) {
                r.push("%")
            } else if ((n = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t)) !== null) {
                if (n[2]) {
                    i |= 1;
                    var u = [],
                        a = n[2],
                        o = [];
                    if ((o = /^([a-z_][a-z_\d]*)/i.exec(a)) !== null) {
                        u.push(o[1]);
                        while ((a = a.slice(o[0].length)) !== "") {
                            if ((o = /^\.([a-z_][a-z_\d]*)/i.exec(a)) !== null) {
                                u.push(o[1])
                            } else if ((o = /^\[(\d+)\]/.exec(a)) !== null) {
                                u.push(o[1])
                            } else {
                                throw "[sprintf] huh?"
                            }
                        }
                    } else {
                        throw "[sprintf] huh?"
                    }
                    n[2] = u
                } else {
                    i |= 2
                }
                if (i === 3) {
                    throw "[sprintf] mixing positional and named placeholders is not (yet) supported"
                }
                r.push(n)
            } else {
                throw "[sprintf] huh?"
            }
            t = t.slice(n[0].length)
        }
        return r
    };
    var t = function(e, t, n) {
        n = t.slice(0);
        n.splice(0, 0, e);
        return D.apply(null, n)
    };

    function m(e) {
        return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
    }

    function d(e, t) {
        for (var n = []; t > 0; n[--t] = e) {}
        return n.join("")
    }
    e.sprintf = D;
    e.vsprintf = t
})(typeof global !== "undefined" ? global : self || window);
(function(r, i) {
    var n;
    if (typeof window !== "undefined") {
        n = window
    } else if (typeof self !== "undefined") {
        n = self
    } else if (typeof global !== "undefined") {
        n = global
    } else {
        throw new Error("Unknow context")
    }
    if (typeof define === "function" && define.amd) {
        define(["jquery", "wcwidth"], function(e, t) {
            r(e, t, n);
            return e
        })
    } else if (typeof module === "object" && module.exports) {
        module.exports = function(e, t, n) {
            if (t === i) {
                if (typeof window !== "undefined") {
                    t = require("jquery")
                } else {
                    t = require("jquery")(e)
                }
            }
            if (n === i) {
                n = require("wcwidth")
            }
            r(t, n, e);
            return t
        }
    } else {
        if (!n.jQuery) {
            n.$ = n.cash
        }
        r(n.jQuery || n.cash, n.wcwidth, n)
    }
})(function($, wcwidth, root, undefined) {
    "use strict";

    function debug(e) {
        if (false) {
            console.log(e)
        }
    }

    function DelayQueue() {
        var t = $.Callbacks();
        var n = false;
        this.resolve = function() {
            t.fire();
            n = true
        };
        this.add = function(e) {
            if (n) {
                e()
            } else {
                t.add(e)
            }
        }
    }
    $.omap = function(n, r) {
        var i = {};
        $.each(n, function(e, t) {
            i[e] = r.call(n, e, t)
        });
        return i
    };
    $.fn.text_length = function() {
        return this.map(function() {
            return $(this).text().length
        }).get().reduce(function(e, t) {
            return e + t
        }, 0)
    };
    var Clone = {
        clone_object: function(e) {
            var t = {};
            if (typeof e === "object") {
                if ($.isArray(e)) {
                    return this.clone_array(e)
                } else if (e === null) {
                    return e
                } else {
                    for (var n in e) {
                        if ($.isArray(e[n])) {
                            t[n] = this.clone_array(e[n])
                        } else if (typeof e[n] === "object") {
                            t[n] = this.clone_object(e[n])
                        } else {
                            t[n] = e[n]
                        }
                    }
                }
            }
            return t
        },
        clone_array: function(e) {
            if (!is_function(Array.prototype.map)) {
                throw new Error("Your browser don't support ES5 array map " + "use es5-shim")
            }
            return e.slice(0).map(function(e) {
                if (typeof e === "object") {
                    return this.clone_object(e)
                } else {
                    return e
                }
            }.bind(this))
        }
    };
    var clone = function(e) {
        return Clone.clone_object(e)
    };
    if ("Map" in root && !("clear" in Map.prototype)) {
        Map.prototype.clear = function() {
            this.forEach(function(e, t, n) {
                n.delete(t)
            })
        }
    }
    var localStorage;
    (function() {
        var e = function() {
            try {
                var e = "test",
                    t = window.localStorage;
                t.setItem(e, "1");
                t.removeItem(e);
                return true
            } catch (e) {
                return false
            }
        };
        var t = function() {
            try {
                document.cookie.split(";");
                return true
            } catch (e) {
                return false
            }
        };
        var n = e();

        function r(e, t) {
            var n;
            if (typeof e === "string" && typeof t === "string") {
                localStorage[e] = t;
                return true
            } else if (typeof e === "object" && typeof t === "undefined") {
                for (n in e) {
                    if (e.hasOwnProperty(n)) {
                        localStorage[n] = e[n]
                    }
                }
                return true
            }
            return false
        }

        function i(e, t) {
            var n, r, i;
            n = new Date;
            n.setTime(n.getTime() + 31536e6);
            r = "; expires=" + n.toGMTString();
            if (typeof e === "string" && typeof t === "string") {
                document.cookie = e + "=" + t + r + "; path=/";
                return true
            } else if (typeof e === "object" && typeof t === "undefined") {
                for (i in e) {
                    if (e.hasOwnProperty(i)) {
                        document.cookie = i + "=" + e[i] + r + "; path=/"
                    }
                }
                return true
            }
            return false
        }

        function u(e) {
            return localStorage[e]
        }

        function a(e) {
            var t, n, r, i;
            t = e + "=";
            n = document.cookie.split(";");
            for (r = 0; r < n.length; r++) {
                i = n[r];
                while (i.charAt(0) === " ") {
                    i = i.slice(1, i.length)
                }
                if (i.indexOf(t) === 0) {
                    return i.slice(t.length, i.length)
                }
            }
            return null
        }

        function o(e) {
            return delete localStorage[e]
        }

        function s(e) {
            return i(e, "", -1)
        }
        if (!t() && !n) {
            localStorage = {};
            $.extend({
                Storage: {
                    set: r,
                    get: u,
                    remove: o
                }
            })
        } else {
            if (n) {
                localStorage = window.localStorage
            }
            $.extend({
                Storage: {
                    set: n ? r : i,
                    get: n ? u : a,
                    remove: n ? o : s
                }
            })
        }
    })();
    var debounce = function() {
        var E = "Expected a function";

        function x(e) {
            var t = typeof e;
            return e != null && (t == "object" || t == "function")
        }

        function $() {
            return Date.now()
        }
        return function e(r, i, t) {
            var n = Math.max,
                u = Math.min;
            var a, o, s, l, f, c, p = 0,
                D = false,
                m = false,
                d = true;
            if (typeof r != "function") {
                throw new TypeError(E)
            }
            i = i || 0;
            if (x(t)) {
                D = !!t.leading;
                m = "maxWait" in t;
                s = m ? n(t.maxWait || 0, i) : s;
                d = "trailing" in t ? !!t.trailing : d
            }

            function h(e) {
                var t = a,
                    n = o;
                a = o = undefined;
                p = e;
                l = r.apply(n, t);
                return l
            }

            function v(e) {
                p = e;
                f = setTimeout(y, i);
                return D ? h(e) : l
            }

            function g(e) {
                var t = e - c,
                    n = e - p,
                    r = i - t;
                return m ? u(r, s - n) : r
            }

            function _(e) {
                var t = e - c,
                    n = e - p;
                return c === undefined || t >= i || t < 0 || m && n >= s
            }

            function y() {
                var e = $();
                if (_(e)) {
                    return b(e)
                }
                f = setTimeout(y, g(e))
            }

            function b(e) {
                f = undefined;
                if (d && a) {
                    return h(e)
                }
                a = o = undefined;
                return l
            }

            function C() {
                if (f !== undefined) {
                    clearTimeout(f)
                }
                p = 0;
                a = c = o = f = undefined
            }

            function F() {
                return f === undefined ? l : b($())
            }

            function w() {
                var e = $(),
                    t = _(e);
                a = arguments;
                o = this;
                c = e;
                if (t) {
                    if (f === undefined) {
                        return v(c)
                    }
                    if (m) {
                        f = setTimeout(y, i);
                        return h(c)
                    }
                }
                if (f === undefined) {
                    f = setTimeout(y, i)
                }
                return l
            }
            w.cancel = C;
            w.flush = F;
            return w
        }
    }();
    var jQuery = $;
    (function(e) {
        jQuery.fn.extend({
            everyTime: function(e, t, n, r, i) {
                return this.each(function() {
                    jQuery.timer.add(this, e, t, n, r, i)
                })
            },
            oneTime: function(e, t, n) {
                return this.each(function() {
                    jQuery.timer.add(this, e, t, n, 1)
                })
            },
            stopTime: function(e, t) {
                return this.each(function() {
                    jQuery.timer.remove(this, e, t)
                })
            }
        });
        jQuery.extend({
            timer: {
                guid: 1,
                global: {},
                regex: /^([0-9]+)\s*(.*s)?$/,
                powers: {
                    ms: 1,
                    cs: 10,
                    ds: 100,
                    s: 1e3,
                    das: 1e4,
                    hs: 1e5,
                    ks: 1e6
                },
                timeParse: function(e) {
                    if (e === undefined || e === null) {
                        return null
                    }
                    var t = this.regex.exec(jQuery.trim(e.toString()));
                    if (t[2]) {
                        var n = parseInt(t[1], 10);
                        var r = this.powers[t[2]] || 1;
                        return n * r
                    } else {
                        return e
                    }
                },
                add: function(e, t, n, r, i, u) {
                    var a = 0;
                    if (jQuery.isFunction(n)) {
                        if (!i) {
                            i = r
                        }
                        r = n;
                        n = t
                    }
                    t = jQuery.timer.timeParse(t);
                    if (typeof t !== "number" || isNaN(t) || t <= 0) {
                        return
                    }
                    if (i && i.constructor !== Number) {
                        u = !!i;
                        i = 0
                    }
                    i = i || 0;
                    u = u || false;
                    if (!e.$timers) {
                        e.$timers = {}
                    }
                    if (!e.$timers[n]) {
                        e.$timers[n] = {}
                    }
                    r.$timerID = r.$timerID || this.guid++;
                    var o = function() {
                        if (u && o.inProgress) {
                            return
                        }
                        o.inProgress = true;
                        if (++a > i && i !== 0 || r.call(e, a) === false) {
                            jQuery.timer.remove(e, n, r)
                        }
                        o.inProgress = false
                    };
                    o.$timerID = r.$timerID;
                    if (!e.$timers[n][r.$timerID]) {
                        e.$timers[n][r.$timerID] = setInterval(o, t)
                    }
                    if (!this.global[n]) {
                        this.global[n] = []
                    }
                    this.global[n].push(e)
                },
                remove: function(e, t, n) {
                    var r = e.$timers,
                        i;
                    if (r) {
                        if (!t) {
                            for (var u in r) {
                                if (r.hasOwnProperty(u)) {
                                    this.remove(e, u, n)
                                }
                            }
                        } else if (r[t]) {
                            if (n) {
                                if (n.$timerID) {
                                    clearInterval(r[t][n.$timerID]);
                                    delete r[t][n.$timerID]
                                }
                            } else {
                                for (var a in r[t]) {
                                    if (r[t].hasOwnProperty(a)) {
                                        clearInterval(r[t][a]);
                                        delete r[t][a]
                                    }
                                }
                            }
                            for (i in r[t]) {
                                if (r[t].hasOwnProperty(i)) {
                                    break
                                }
                            }
                            if (!i) {
                                i = null;
                                delete r[t]
                            }
                        }
                        for (i in r) {
                            if (r.hasOwnProperty(i)) {
                                break
                            }
                        }
                        if (!i) {
                            e.$timers = null
                        }
                    }
                }
            }
        });
        if (/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())) {
            e(window).one("unload", function() {
                var e = jQuery.timer.global;
                for (var t in e) {
                    if (e.hasOwnProperty(t)) {
                        var n = e[t],
                            r = n.length;
                        while (--r) {
                            jQuery.timer.remove(n[r], t)
                        }
                    }
                }
            })
        }
    })(jQuery);
    (function(f) {
        if (!String.prototype.split.toString().match(/\[native/)) {
            return
        }
        var c = String.prototype.split,
            p = /()??/.exec("")[1] === f,
            n;
        n = function(e, t, n) {
            if (Object.prototype.toString.call(t) !== "[object RegExp]") {
                return c.call(e, t, n)
            }
            var r = [],
                i = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.extended ? "x" : "") + (t.sticky ? "y" : ""),
                u = 0,
                a, o, s, l;
            t = new RegExp(t.source, i + "g");
            e += "";
            if (!p) {
                a = new RegExp("^" + t.source + "$(?!\\s)", i)
            }
            n = n === f ? -1 >>> 0 : n >>> 0;
            while (o = t.exec(e)) {
                s = o.index + o[0].length;
                if (s > u) {
                    r.push(e.slice(u, o.index));
                    if (!p && o.length > 1) {
                        o[0].replace(a, function() {
                            for (var e = 1; e < arguments.length - 2; e++) {
                                if (arguments[e] === f) {
                                    o[e] = f
                                }
                            }
                        })
                    }
                    if (o.length > 1 && o.index < e.length) {
                        Array.prototype.push.apply(r, o.slice(1))
                    }
                    l = o[0].length;
                    u = s;
                    if (r.length >= n) {
                        break
                    }
                }
                if (t.lastIndex === o.index) {
                    t.lastIndex++
                }
            }
            if (u === e.length) {
                if (l || !t.test("")) {
                    r.push("")
                }
            } else {
                r.push(e.slice(u))
            }
            return r.length > n ? r.slice(0, n) : r
        };
        String.prototype.split = function(e, t) {
            return n(this, e, t)
        };
        return n
    })();
    $.fn.caret = function(e) {
        var t = this[0];
        var n = t.contentEditable === "true";
        if (arguments.length === 0) {
            if (window.getSelection) {
                if (n) {
                    if (!this.is(":focus")) {
                        t.focus()
                    }
                    var r = window.getSelection().getRangeAt(0),
                        i = r.cloneRange();
                    i.selectNodeContents(t);
                    i.setEnd(r.endContainer, r.endOffset);
                    return i.toString().length
                }
                return t.selectionStart
            }
            if (document.selection) {
                t.focus();
                if (n) {
                    var r = document.selection.createRange(),
                        i = document.body.createTextRange();
                    i.moveToElementText(t);
                    i.setEndPoint("EndToEnd", r);
                    return i.text.length
                }
                var e = 0,
                    u = t.createTextRange(),
                    i = document.selection.createRange().duplicate(),
                    a = i.getBookmark();
                u.moveToBookmark(a);
                while (u.moveStart("character", -1) !== 0) e++;
                return e
            }
            return 0
        }
        if (e === -1) e = this[n ? "text" : "val"]().length;
        if (window.getSelection) {
            if (n) {
                if (!this.is(":focus")) {
                    t.focus()
                }
                var o = window.getSelection();
                o.collapse(o.focusNode, e)
            } else t.setSelectionRange(e, e)
        } else if (document.body.createTextRange) {
            var u = document.body.createTextRange();
            u.moveToElementText(t);
            u.moveStart("character", e);
            u.collapse(true);
            u.select()
        }
        if (!n && !this.is(":focus")) {
            t.focus()
        }
        return e
    };

    function make_callback_plugin(e) {
        var s = $.extend({
            init: $.noop,
            destroy: $.noop,
            name: "event"
        }, e);
        return function(r, i) {
            var u = arguments.length === 0;
            var a = arguments[0] === "unbind";
            if (!u && !a && !is_function(r)) {
                throw new Error("Invalid argument, it need to a function or string " + '"unbind" or no arguments.')
            }
            if (a) {
                r = is_function(arguments[1]) ? arguments[1] : null
            }
            var o = "callbacks_" + s.name;
            return this.each(function() {
                var t = $(this);
                var n;

                function e(e) {
                    n.fireWith(t, [e])
                }
                if (u || a) {
                    n = t.data(o);
                    if (u) {
                        n && n.fire()
                    } else {
                        if (r && n) {
                            n.remove(r);
                            if (!n.has()) {
                                n = null
                            }
                        } else {
                            n = null
                        }
                        if (!n) {
                            t.removeData(o);
                            s.destroy.call(this, e, i)
                        }
                    }
                } else if (t.data(o)) {
                    $(this).data(o).add(r)
                } else {
                    n = $.Callbacks();
                    n.add(r);
                    t.data(o, n);
                    s.init.call(this, e, i)
                }
            })
        }
    }
    $.fn.resizer = make_callback_plugin({
        name: "resize",
        init: function(e, t) {
            var n = $.extend({
                prefix: ""
            }, t);
            var r = $(this);
            var i;
            var u = true;
            if (r.is("body")) {
                $(window).on("resize.resizer", e)
            } else if (window.ResizeObserver) {
                i = new ResizeObserver(function() {
                    if (!u) {
                        e()
                    }
                    u = false
                });
                i.observe(this);
                r.data("observer", i)
            } else {
                var a = $("<iframe/>").addClass(n.prefix + "resizer").appendTo(this)[0];
                $(a.contentWindow).on("resize", e)
            }
        },
        destroy: function() {
            var e = $(this);
            if (window.ResizeObserver) {
                var t = e.data("observer");
                if (t) {
                    t.unobserve(this);
                    e.removeData("observer")
                }
            } else {
                var n = e.find('> iframe[class$="resizer"]');
                if (n.length) {
                    $(n[0].contentWindow).off("resize").remove();
                    n.remove()
                } else if (e.is("body")) {
                    $(window).off("resize.resizer")
                }
            }
        }
    });
    $.fn.touch_scroll = make_callback_plugin({
        name: "touch",
        init: function(r) {
            var i;
            var u;
            $(this).on("touchstart.scroll", function(e) {
                e = e.originalEvent;
                if (e.target.tagName.toLowerCase() !== "a" && e.touches.length === 1) {
                    u = i = e.touches[0]
                }
            }).on("touchmove.scroll", function(e) {
                e = e.originalEvent;
                if (i && e.touches.length === 1) {
                    var t = e.touches[0];
                    var n = r({
                        origin: i,
                        previous: u,
                        current: t
                    });
                    if (n === false) {
                        e.preventDefault()
                    }
                    u = t
                }
            }).on("touchend.scroll", function() {
                if (i || u) {
                    i = u = null
                }
            })
        },
        destroy: function() {
            $(this).off("touchstart.scroll touchmove.scroll touchend.scroll")
        }
    });

    function jquery_resolve(e) {
        var t = jQuery.Deferred();
        t.resolve(e);
        return t.promise()
    }

    function unpromise(e, t, n) {
        if (e !== undefined) {
            if (is_function(e.catch)) {
                e.catch(n)
            }
            if (is_function(e.done)) {
                return e.done(t)
            } else if (is_function(e.then)) {
                return e.then(t)
            } else if (e instanceof Array) {
                var r = e.filter(function(e) {
                    return e && (is_function(e.done) || is_function(e.then))
                });
                if (r.length) {
                    var i = $.when.apply($, e).then(function() {
                        return t([].slice.call(arguments))
                    });
                    if (is_function(e.catch)) {
                        i.catch(n)
                    }
                    return i
                }
            }
            return t(e)
        }
    }
    $.fn.is_fully_in_viewport = function() {
        function t(e, t) {
            var n = e.getBoundingClientRect();
            var r = t[0].getBoundingClientRect();
            var i = n.top - r.top;
            var u = n.bottom - r.top;
            var a = t.height();
            return u > 0 && i <= a
        }
        if (root.IntersectionObserver) {
            return function(e) {
                var t = this[0];
                var n = jQuery.Deferred();
                var r = new root.IntersectionObserver(function(e) {
                    n.resolve(e[0].isIntersecting && e[0].ratio === 1);
                    r.unobserve(t)
                }, {
                    root: e[0]
                });
                r.observe(t);
                return n.promise()
            }
        } else {
            return function(e) {
                return jquery_resolve(t(this[0], e))
            }
        }
    }();
    var entity_re = /(&(?:[a-z\d]+|#\d+|#x[a-f\d]+);)/i;
    var combine_chr_re = /(.(?:[\u0300-\u036F]|[\u1AB0-\u1abE]|[\u1DC0-\u1DF9]|[\u1DFB-\u1DFF]|[\u20D0-\u20F0]|[\uFE20-\uFE2F])+)/;
    var astral_symbols_re = /([\uD800-\uDBFF][\uDC00-\uDFFF])/;
    var emoji_re = /(\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE])|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC3B\u200D\u2744|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDF])\u200D[\u2640\u2642])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F?|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD]))/;
    var mobile_re = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
    var tablet_re = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    var format_split_re = /(\[\[(?:-?[@!gbiuso])*;[^;]*;[^\]]*\](?:[^\]\\]*(?:\\\\)*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?)/i;
    var format_parts_re = /\[\[((?:-?[@!gbiuso])*);([^;]*);([^;\]]*);?([^;\]]*);?([^\]]*)\]([^\]\\]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]+)\]?/gi;
    var format_re = /\[\[((?:-?[@!gbiuso])*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi;
    var format_exist_re = /\[\[((?:-?[@!gbiuso])*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]/gi;
    var format_full_re = /^(\[\[(?:(?:-?[@!gbiuso])*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\])([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)(\])$/i;
    var format_begin_re = /(\[\[(?:-?[@!gbiuso])*;[^;]*;[^\]]*\])/i;
    var format_start_re = /^(\[\[(?:-?[@!gbiuso])*;[^;]*;[^\]]*\])/i;
    var format_end_re = /\[\[(?:-?[@!gbiuso])*;[^;]*;[^\]]*\]?$/i;
    var self_closing_re = /^(?:\[\[)?[^;]*@[^;]*;/;
    var color_re = /^(?:#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\([^)]+\)|hsla?\([^)]+\))$/i;
    var url_re = /(\b(?:file|ftp|https?):\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'\\<>\][)])+)/gi;
    var url_nf_re = /\b(?![^"\s[\]]*])(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'\\<>\][)])+)/gi;
    var email_re = /((([^<>('")[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g;
    var url_full_re = /^(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\\\][)])+)$/gi;
    var email_full_re = /^((([^<>('")[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/g;
    var command_re = /((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimsuy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/gi;
    var extended_command_re = /^\s*((terminal|cmd)::([a-z_]+)\(([\s\S]*)\))\s*$/;
    var format_exec_split_re = /(\[\[(?:-?[@!gbiuso])*;[^\]]+\](?:\\[[\]]|[^\]])*\]|\[\[[\s\S]+?\]\])/;
    var format_exec_re = /(\[\[[\s\S]+?\]\])/;
    var float_re = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    var re_re = /^\/((?:\\\/|[^/]|\[[^\]]*\/[^\]]*\])+)\/([gimsuy]*)$/;
    var string_re = /("(?:[^"\\]|\\(?:\\\\)*"|\\\\)*"|'(?:[^'\\]|\\(?:\\\\)*'|\\\\)*'|`(?:[^`\\]|\\(?:\\\\)*`|\\\\)*`)/;
    var unclosed_strings_re = /^(?=((?:[^"']+|"[^"\\]*(?:\\[^][^"\\]*)*"|'[^'\\]*(?:\\[^][^'\\]*)*')*))\1./;
    var broken_image = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14"><title id="title2">rounded</title><path id="terminal-broken-image" d="m 14,10 h 2 v 1 a 3,3 0 0 1 -3,3 H 3 A 3,3 0 0 1 0,11 H 4.5 A 1.00012,1.00012 0 0 0 5.207,10.707 L 6.5,9.414 7.793,10.707 a 0.99963,0.99963 0 0 0 1.41406,0 l 2.36719,-2.36719 1.80127,1.44092 A 0.99807,0.99807 0 0 0 14,10 Z M 16,3 V 8 H 14.35059 L 12.12451,6.21924 A 0.99846,0.99846 0 0 0 10.793,6.293 L 8.5,8.586 7.207,7.293 a 0.99962,0.99962 0 0 0 -1.41406,0 L 4.08594,9 H 0 V 3 A 3,3 0 0 1 3,0 h 10 a 3,3 0 0 1 3,3 z M 6,4.5 A 1.5,1.5 0 1 0 4.5,6 1.5,1.5 0 0 0 6,4.5 Z" /></svg>';
    var use_broken_image = '<svg class="terminal-broken-image" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#terminal-broken-image"/></svg>';
    var animation_supported = function() {
        if (typeof document === "undefined") {
            return false
        }
        var e = false,
            t = "Webkit Moz O ms Khtml".split(" "),
            n = document.createElement("div");
        if (n.style.animationName) {
            e = true
        }
        if (e === false) {
            for (var r = 0; r < t.length; r++) {
                var i = t[r] + "AnimationName";
                if (n.style[i] !== undefined) {
                    e = true;
                    break
                }
            }
        }
        n = null;
        return e
    }();
    var agent = (root.navigator || window.navigator).userAgent;
    var is_IE = /MSIE|Trident/.test(agent) || /rv:11.0/i.test(agent);
    var is_IEMobile = /IEMobile/.test(agent);
    var is_ch_unit_supported = function() {
        if (is_IE && !is_IEMobile) {
            return false
        }
        if (typeof document === "undefined") {
            return true
        }
        var e = document.createElement("div");
        e.style.width = "1ch";
        return e.style.width === "1ch"
    }();
    var is_css_variables_supported = root.CSS && root.CSS.supports && root.CSS.supports("--fake-var", 0);
    var is_android = navigator.userAgent.toLowerCase().indexOf("android") !== -1;
    var is_key_native = function e() {
        if (!("KeyboardEvent" in root && "key" in root.KeyboardEvent.prototype)) {
            return false
        }
        var t = root.KeyboardEvent.prototype;
        var n = Object.getOwnPropertyDescriptor(t, "key").get;
        return !!n.toString().match(/\[native code\]/)
    }();
    var is_browser = function() {
        try {
            return this === window
        } catch (e) {
            return false
        }
    }();
    var is_mobile = function(e) {
        var t = false;
        if (mobile_re.test(e) || tablet_re.test(e.substr(0, 4))) {
            t = true
        }
        if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
            return true
        }
        return t
    }(navigator.userAgent || navigator.vendor || root.opera);
    var ch_unit_bug = false;
    if (is_browser) {
        $(function() {
            function e(e) {
                return e[0].getBoundingClientRect().width
            }
            var t = '<span style="font-family: monospace;visibility:hidden;';
            var n = $(t + 'width:1ch;overflow: hidden">&nbsp;</span>');
            n.appendTo("body");
            var r = $(t + '">&nbsp;</span>').appendTo("body");
            ch_unit_bug = Math.abs(e(n) - e(r)) > 1e-4;
            n.remove();
            r.remove()
        })
    }

    function css(t, n, e) {
        if (t instanceof $.fn.init) {
            t.each(function() {
                css(this, n, e)
            })
        } else if ($.isPlainObject(n)) {
            Object.keys(n).forEach(function(e) {
                t.style.setProperty(e, n[e])
            })
        } else if (typeof e === "undefined") {
            return t.style.getPropertyValue(n)
        } else {
            t.style.setProperty(n, e)
        }
    }

    function a11y_hide(e) {
        e.attr({
            role: "presentation",
            "aria-hidden": "true"
        })
    }
    var excepctions = [];

    function alert_exception(e, t) {
        if (arguments[0] instanceof $.terminal.Exception) {
            e = arguments[0].type;
            t = arguments[0]
        }
        var n = (e ? e + ": " : "") + exception_message(t);
        if (excepctions.indexOf(n) === -1) {
            excepctions.push(n);
            setTimeout(function() {
                throw t
            }, 0)
        }
    }

    function generate_id() {
        var e = Math.random() * 46656 | 0;
        var t = Math.random() * 46656 | 0;
        e = ("000" + e.toString(36)).slice(-3);
        t = ("000" + t.toString(36)).slice(-3);
        return e + t
    }

    function scrollbar_event(e, t) {
        var n = t.offset().left;
        return t.outerWidth() <= e.clientX - n
    }

    function exception_message(e) {
        if (typeof e === "string") {
            return e
        } else if (typeof e.fileName === "string") {
            return e.fileName + ": " + e.message
        } else {
            return e.message
        }
    }

    function Cycle() {
        var r = [].slice.call(arguments);
        var i = 0;
        $.extend(this, {
            get: function() {
                return r
            },
            index: function() {
                return i
            },
            rotate: function(e, t) {
                if (t === undefined) {
                    t = i
                } else if (t === i) {
                    return
                }
                if (!e) {
                    var n = r.filter(function(e) {
                        return typeof e !== "undefined"
                    });
                    if (!n.length) {
                        return
                    }
                }
                if (!r.length) {
                    return
                }
                if (r.length === 1) {
                    return r[0]
                } else {
                    if (i === r.length - 1) {
                        i = 0
                    } else {
                        ++i
                    }
                    if (typeof r[i] !== "undefined") {
                        return r[i]
                    } else {
                        return this.rotate(true, t)
                    }
                }
            },
            length: function() {
                return r.length
            },
            remove: function(e) {
                delete r[e]
            },
            set: function(e) {
                for (var t = r.length; t--;) {
                    if (r[t] === e) {
                        i = t;
                        return
                    }
                }
                this.append(e);
                i = r.length - 1
            },
            front: function() {
                if (r.length) {
                    var e = i;
                    var t = false;
                    while (!r[e]) {
                        e++;
                        if (e > r.length) {
                            if (t) {
                                break
                            }
                            e = 0;
                            t = true
                        }
                    }
                    return r[e]
                }
            },
            map: function(n) {
                return r.map(function(e, t) {
                    if (typeof e !== "undefined") {
                        return n(e, t)
                    }
                    return null
                }).filter(Boolean)
            },
            forEach: function(n) {
                return r.forEach(function(e, t) {
                    if (typeof e !== "undefined") {
                        n(e, t)
                    }
                })
            },
            append: function(e) {
                r.push(e)
            }
        })
    }

    function Stack(e) {
        var t = is_array(e) ? e : e ? [e] : [];
        $.extend(this, {
            data: function() {
                return t
            },
            map: function(e) {
                return $.map(t, e)
            },
            size: function() {
                return t.length
            },
            pop: function() {
                if (t.length === 0) {
                    return null
                } else {
                    var e = t[t.length - 1];
                    t = t.slice(0, t.length - 1);
                    return e
                }
            },
            push: function(e) {
                t = t.concat([e]);
                return e
            },
            top: function() {
                return t.length > 0 ? t[t.length - 1] : null
            },
            clone: function() {
                return new Stack(t.slice(0))
            }
        })
    }

    function WorkerCache(e) {
        var t = $.extend({
            validation: $.noop,
            action: $.noop,
            onCache: $.noop
        }, e);
        this._onCache = t.onCache.bind(this);
        this._action = t.action.bind(this);
        this._validation = t.validation.bind(this);
        if ("Map" in root) {
            this._cache = new Map
        }
    }
    WorkerCache.prototype.validate = function(e) {
        var t = this._validation(e);
        var n = t === undefined || t === true;
        if (!n) {
            this._cache.clear()
        }
        return n
    };
    WorkerCache.prototype.get = function(e) {
        if (!this._cache) {
            return this._action(e)
        }
        var t;
        if (this.validate(e) && this._cache.has(e)) {
            t = this._cache.get(e);
            this._onCache({
                cache: t
            });
            return t
        }
        t = this._action(e);
        this._cache.set(e, t);
        return t
    };

    function History(e, t, n) {
        var r = true;
        var i = "";
        if (typeof e === "string" && e !== "") {
            i = e + "_"
        }
        i += "commands";
        var u;
        if (n) {
            u = []
        } else {
            u = $.Storage.get(i);
            u = u ? JSON.parse(u) : []
        }
        var a = u.length - 1;
        $.extend(this, {
            append: function(e) {
                if (r) {
                    if (u[u.length - 1] !== e) {
                        u.push(e);
                        if (t && u.length > t) {
                            u = u.slice(-t)
                        }
                        a = u.length - 1;
                        if (!n) {
                            $.Storage.set(i, JSON.stringify(u))
                        }
                    }
                }
            },
            set: function(e) {
                if (is_array(e)) {
                    u = e;
                    if (!n) {
                        $.Storage.set(i, JSON.stringify(u))
                    }
                }
            },
            data: function() {
                return u
            },
            reset: function() {
                a = u.length - 1
            },
            last: function() {
                return u[u.length - 1]
            },
            end: function() {
                return a === u.length - 1
            },
            position: function() {
                return a
            },
            current: function() {
                return u[a]
            },
            next: function() {
                var e = a;
                if (a < u.length - 1) {
                    ++a
                }
                if (e !== a) {
                    return u[a]
                }
            },
            previous: function() {
                var e = a;
                if (a > 0) {
                    --a
                }
                if (e !== a) {
                    return u[a]
                }
            },
            clear: function() {
                u = [];
                this.purge()
            },
            enabled: function() {
                return r
            },
            enable: function() {
                r = true
            },
            purge: function() {
                if (!n) {
                    $.Storage.remove(i)
                }
            },
            disable: function() {
                r = false
            },
            toggle: function(e) {
                if (typeof e === "undefined") {
                    r = !r
                } else {
                    r = e
                }
            }
        })
    }

    function OutputLines(e) {
        this._settings = e;
        this._lines = [];
        this._snapshot = []
    }
    OutputLines.prototype.make_snapshot = function(e) {
        this._snapshot.push(e)
    };
    OutputLines.prototype.get_partial = function() {
        var e = this._snapshot[this._snapshot.length - 1];
        return e
    };
    OutputLines.prototype.update_snapshot = function(e, t) {
        this._snapshot[e] = t
    };
    OutputLines.prototype.limit_snapshot = function(e) {
        this._snapshot = this._snapshot.slice(e)
    };
    OutputLines.prototype.clear_snapshot = function() {
        this._snapshot = []
    };
    OutputLines.prototype.get_snapshot = function() {
        return this._snapshot.reduce(function(e, t) {
            return e.concat(t)
        }, []).join("\n")
    };
    OutputLines.prototype.join = function() {
        var e = [].slice.call(arguments);
        if (e.some(is_function)) {
            return function() {
                return e.reduce(function(e, t) {
                    if (is_function(e)) {
                        e = e()
                    }
                    if (is_function(t)) {
                        t = t()
                    }
                    if (is_promise(e) || is_promise(t)) {
                        return $.when(e, t).then(function(e, t) {
                            return e + t
                        })
                    }
                    return t
                })
            }
        } else if (e.some(is_promise)) {
            return e.reduce(function(e, t) {
                return $.when(e, t).then(function(e, t) {
                    return e + t
                })
            })
        }
        return e.join("")
    };
    OutputLines.prototype.import = function(e) {
        this._lines = e
    };
    OutputLines.prototype.push = function(e) {
        var t = e[0];
        var n = e[1];
        if (this.has_newline()) {
            this._lines.push(e)
        } else {
            var r = this.last_line();
            r[0] = this.join(r[0], t);
            r[1].newline = n.newline
        }
    };
    OutputLines.prototype.clear = function(r) {
        this._lines.forEach(function(e, t) {
            var n = e[1];
            if (is_function(n.onClear)) {
                n.onClear.call(self, r(t))
            }
        });
        this._lines = [];
        this._snapshot = []
    };
    OutputLines.prototype.data = function() {
        return this._lines
    };
    OutputLines.prototype.has_newline = function() {
        if (this._lines.length === 0) {
            return true
        }
        return this.last_line()[1].newline
    };
    OutputLines.prototype.last_line = function() {
        var e = this._lines.length;
        return this._lines[e - 1]
    };
    OutputLines.prototype.update = function(e, t, n) {
        if (t === null) {
            this._lines.splice(e, 1)
        } else {
            this._lines[e][0] = t;
            if (n) {
                this._lines[e][1] = $.extend(this._lines[e][1], n)
            }
            return this._lines[e][1]
        }
    };
    OutputLines.prototype.length = function() {
        return this._lines.length
    };
    OutputLines.prototype.valid_index = function(e) {
        return !!this._lines[e]
    };
    OutputLines.prototype.render = function(e, t) {
        var n = this._settings();
        var i = [];
        this._snapshot = [];
        if (n.outputLimit >= 0) {
            var r;
            if (n.outputLimit === 0) {
                r = e
            } else {
                r = n.outputLimit
            }
            this._lines.forEach(function(e, t) {
                var n = e[0];
                var r = e[1];
                i.push({
                    value: n,
                    index: t,
                    options: r
                })
            });
            var u = i.length - r - 1;
            i = i.slice(u)
        } else {
            i = this._lines.map(function(e, t) {
                return {
                    value: e[0],
                    index: t,
                    options: e[1]
                }
            })
        }
        return t(i)
    };

    function FormatBuffer(e) {
        this._options = e;
        if ("Map" in root) {
            this._format_cache = new Map
        }
        this._output_buffer = []
    }
    FormatBuffer.NEW_LINE = 1;
    FormatBuffer.prototype.format = function e(t, n, r) {
        var i = this._format_cache && this._settings.useCache;
        if (i) {
            var u = JSON.stringify([t, this._settings]);
            if (this._format_cache.has(u)) {
                return this._format_cache.get(u)
            }
        }
        var a = {
            line: $.terminal.format(t, this._settings),
            raw: r,
            newline: n
        };
        if (i) {
            this._format_cache.set(u, a)
        }
        return a
    };
    FormatBuffer.prototype.empty = function() {
        return !this._output_buffer.length
    };
    FormatBuffer.prototype.append = function(e, t, n, r) {
        this._settings = $.extend({
            useCache: true
        }, this._options(n));
        this._output_buffer.push(FormatBuffer.NEW_LINE);
        if (e instanceof Array) {
            var i = r.split("\n");
            for (var u = 0, a = e.length; u < a; ++u) {
                if (e[u] === "" || e[u] === "\r") {
                    this._output_buffer.push({
                        line: "",
                        raw: ""
                    })
                } else {
                    var o = this.format(e[u], u === a - 1, i[u]);
                    this._output_buffer.push(o)
                }
            }
        } else if (!n.raw) {
            this._output_buffer.push(this.format(e, false, r))
        } else {
            this._output_buffer.push({
                line: e,
                raw: r
            })
        }
        this._output_buffer.push({
            finalize: n.finalize,
            index: t,
            newline: n.newline
        })
    };
    FormatBuffer.prototype.clear_cache = function() {
        if (this._format_cache) {
            this._format_cache.clear()
        }
    };
    FormatBuffer.prototype.output = function() {
        return this._output_buffer.slice()
    };
    FormatBuffer.prototype.is_empty = function() {
        return !this._output_buffer.length
    };
    FormatBuffer.prototype.clear = function() {
        this._output_buffer = []
    };
    FormatBuffer.prototype.forEach = function(e) {
        var t = 0;
        while (t < this._output_buffer.length) {
            var n = this._output_buffer[t++];
            if (n === FormatBuffer.NEW_LINE) {
                e()
            } else {
                e(n)
            }
        }
    };
    FormatBuffer.prototype.flush = function(e) {
        this.forEach(e);
        this.clear()
    };

    function with_prompt(e, n, t) {
        function r(e) {
            var t = $.terminal.escape_brackets("[ERR]> ");
            n("[[;red;]" + t + "]");
            alert_exception("Prompt", e)
        }

        function i(e) {
            n(e);
            u.resolve()
        }
        var u = new $.Deferred;
        switch (typeof e) {
            case "string":
                i(e);
                break;
            case "function":
                try {
                    var a = e.call(t, function(e) {
                        i(e)
                    });
                    if (typeof a === "string") {
                        i(a)
                    }
                    if (a && a.then) {
                        a.then(i).catch(r)
                    }
                } catch (e) {
                    r(e)
                }
                break
        }
        return u.promise()
    }
    var cmd_index = 0;
    $.cmd = {
        defaults: {
            mask: false,
            caseSensitiveSearch: true,
            historySize: 60,
            prompt: "> ",
            enabled: true,
            history: true,
            onPositionChange: $.noop,
            onCommandChange: $.noop,
            inputStyle: "textarea",
            mobileDelete: is_mobile,
            onPaste: $.noop,
            clickTimeout: 200,
            holdTimeout: 400,
            holdRepeatTimeout: 200,
            mobileIngoreAutoSpace: [],
            repeatTimeoutKeys: [],
            tabindex: 1,
            tabs: 4
        }
    };
    $.fn.cmd = function(e) {
        var x = $.extend({}, $.cmd.defaults, e);

        function a(e) {
            return x.mobileIngoreAutoSpace.length && x.mobileIngoreAutoSpace.indexOf(e) !== -1 && is_android
        }
        var k = this;
        var t = k.data("cmd");
        if (t) {
            return t
        }
        var o = cmd_index++;
        k.addClass("cmd");
        var A = $('<div class="cmd-wrapper"/>').appendTo(k);
        A.append('<span class="cmd-prompt"></span>');
        A.append('<div class="cmd-cursor-line">' + "<span></span>" + '<span class="cmd-cursor">' + '<span data-text class="end"><span>&nbsp;</span></span>' + "</span>" + "<span></span>" + "</div>");
        var n = A.find(".cmd-cursor-line");
        a11y_hide(n);
        var B;
        if (is_mobile) {
            B = function() {
                var t = $('<div class="cmd-editable"/>').attr({
                    contenteditable: "plaintext-only",
                    autocapitalize: "off",
                    autocorrect: "off",
                    spellcheck: "false",
                    tabindex: x.tabindex
                }).insertAfter(k);
                t.on("focus", function() {
                    k.enable()
                }).on("blur", function() {
                    k.disable()
                });
                var e;
                var n = {
                    $node: t,
                    val: function(e) {
                        if (typeof e === "undefined") {
                            return t.text()
                        } else {
                            t.html(e)
                        }
                    },
                    reset: function() {
                        clearTimeout(e);
                        e = setTimeout(function() {
                            t.css({
                                top: "",
                                bottom: ""
                            })
                        }, 400)
                    },
                    focus: function() {
                        css(t[0], {
                            top: "calc(var(--terminal-scroll, 0) * 1px)"
                        });
                        n.reset()
                    },
                    blur: function() {
                        t.css({
                            top: "100%",
                            bottom: 0
                        }).blur();
                        window.getSelection().removeAllRanges();
                        n.reset()
                    }
                };
                return n
            }();
            k.addClass("cmd-mobile")
        } else {
            B = function() {
                var e = generate_id();
                var t = $("<textarea>").attr({
                    autocapitalize: "off",
                    spellcheck: "false",
                    id: e,
                    tabindex: x.tabindex
                }).addClass("cmd-clipboard").appendTo(k);
                t.before('<label class="visually-hidden" for="' + e + '">' + "Clipbard textarea for jQuery Terminal</label>");
                return {
                    $node: t,
                    val: function(e) {
                        if (typeof e === "undefined") {
                            return t.val()
                        } else {
                            return t.val(e)
                        }
                    }
                }
            }();
            B.val(" ")
        }
        if (x.width) {
            k.width(x.width)
        }
        var p;
        var m;
        var i;
        var T;
        var u;
        var s = 0;
        var D;
        var d = k.find(".cmd-prompt");
        var l = false;
        var f = "";
        var c = null;
        var r;
        var S = "";
        var h;
        var v = "";
        var R = 0;
        var g;
        var _;
        var j = 0;
        var y, b;
        var O = k.find(".cmd-cursor");
        var C;
        var L;
        var F = 0;
        var w = "￿";
        var I = /\uFFFF$/;
        var E = /^\uFFFF$/;

        function z(e) {
            var t = $(e.target);
            if (t.is("span,img,a")) {
                t = t.closest("[data-text]");
                return t.index() + t.parent("span").prevAll().find("[data-text]").length + t.closest('[role="presentation"]').prevUntil(".cmd-prompt").find("[data-text]").length
            } else if (t.is('div[role="presentation"]')) {
                var n = !t.next().length;
                return t.find("[data-text]").length + t.prevUntil(".cmd-prompt").find("[data-text]").length - (n ? 0 : 1)
            }
        }
        var P = {
            SPACEBAR: " ",
            UP: "ArrowUP",
            DOWN: "ArrowDown",
            LEFT: "ArrowLeft",
            RIGHT: "ArrowRight",
            DEL: "Delete",
            MULTIPLY: "*",
            DIVIDE: "/",
            SUBTRACT: "-",
            ADD: "+"
        };

        function N(e) {
            var t = e.key.toUpperCase();
            if (P[t]) {
                return P[t]
            }
            return t
        }

        function M(e) {
            if (e.key) {
                var t = N(e).toUpperCase();
                if (t === "CONTROL") {
                    return "CTRL"
                } else {
                    var n = [];
                    if (e.ctrlKey) {
                        n.push("CTRL")
                    }
                    if (e.metaKey && t !== "META") {
                        n.push("META")
                    }
                    if (e.shiftKey && t !== "SHIFT") {
                        n.push("SHIFT")
                    }
                    if (e.altKey && t !== "ALT") {
                        n.push("ALT")
                    }
                    if (n.length && t === " ") {
                        t = "SPACEBAR"
                    }
                    if (e.key) {
                        n.push(t)
                    }
                    return n.join("+")
                }
            }
        }
        var H = {
            3: "Cancel",
            6: "Help",
            8: "Backspace",
            9: "Tab",
            12: "Clear",
            13: "Enter",
            16: "Shift",
            17: "Control",
            18: "Alt",
            19: "Pause",
            20: "CapsLock",
            27: "Escape",
            28: "Convert",
            29: "NonConvert",
            30: "Accept",
            31: "ModeChange",
            32: " ",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "ArrowLeft",
            38: "ArrowUp",
            39: "ArrowRight",
            40: "ArrowDown",
            41: "Select",
            42: "Print",
            43: "Execute",
            44: "PrintScreen",
            45: "Insert",
            46: "Delete",
            48: ["0", ")"],
            49: ["1", "!"],
            50: ["2", "@"],
            51: ["3", "#"],
            52: ["4", "$"],
            53: ["5", "%"],
            54: ["6", "^"],
            55: ["7", "&"],
            56: ["8", "*"],
            57: ["9", "("],
            91: "OS",
            93: "ContextMenu",
            144: "NumLock",
            145: "ScrollLock",
            181: "VolumeMute",
            182: "VolumeDown",
            183: "VolumeUp",
            186: [";", ":"],
            187: ["=", "+"],
            188: [",", "<"],
            189: ["-", "_"],
            190: [".", ">"],
            191: ["/", "?"],
            192: ["`", "~"],
            219: ["[", "{"],
            220: ["\\", "|"],
            221: ["]", "}"],
            222: ["'", '"'],
            224: "Meta",
            225: "AltGraph",
            246: "Attn",
            247: "CrSel",
            248: "ExSel",
            249: "EraseEof",
            250: "Play",
            251: "ZoomOut"
        };
        var W;
        for (W = 1; W < 25; W++) {
            H[111 + W] = "F" + W
        }
        var q = "";
        for (W = 65; W < 91; W++) {
            q = String.fromCharCode(W);
            H[W] = [q.toLowerCase(), q.toUpperCase()]
        }
        var U = {};
        Object.keys(H).forEach(function(t) {
            if (is_array(H[t])) {
                H[t].forEach(function(e) {
                    U[e.toUpperCase()] = t
                })
            } else {
                U[H[t].toUpperCase()] = t
            }
        });
        var K;
        var J = {
            "ALT+D": Q({
                clipboard: true
            }),
            "HOLD+ALT+D": Q({
                clipboard: true,
                hold: true
            }),
            "HOLD+DELETE": Q({
                clipboard: false,
                hold: true
            }),
            "HOLD+SHIFT+DELETE": Q({
                clipboard: false,
                hold: true
            }),
            ENTER: function() {
                if (b && S && !x.mask && (is_function(x.historyFilter) && x.historyFilter(S) || x.historyFilter instanceof RegExp && S.match(x.historyFilter) || !x.historyFilter)) {
                    b.append(S)
                }
                var e = S;
                B.$node.blur();
                b.reset();
                Qe = "";
                He = true;
                var t;
                if (x.commands) {
                    t = x.commands.call(k, e)
                }
                if (is_function(g)) {
                    if (t && is_function(t.then)) {
                        t.then(je)
                    } else {
                        je()
                    }
                }
                k.set("");
                B.val("");
                B.$node.focus();
                return false
            },
            "SHIFT+ENTER": function() {
                k.insert("\n");
                return true
            },
            BACKSPACE: ae,
            "SHIFT+BACKSPACE": ae,
            TAB: function() {
                k.insert("\t")
            },
            "CTRL+D": function() {
                k["delete"](1);
                return false
            },
            DELETE: function() {
                k["delete"](1);
                return true
            },
            "HOLD+ARROWUP": ie,
            ARROWUP: ie,
            "CTRL+ARROWUP": Z,
            "CTRL+P": Z,
            ARROWDOWN: ue,
            "HOLD+ARROWDOWN": ue,
            "CTRL+N": ee,
            "CTRL+ARROWDOWN": ee,
            ARROWLEFT: oe,
            "HOLD+ARROWLEFT": debounce(oe, 10),
            "CTRL+B": oe,
            "CTRL+ARROWLEFT": function() {
                var e = R - 1;
                var t = 0;
                if (S[e] === " ") {
                    --e
                }
                for (var n = e; n > 0; --n) {
                    if (S[n] === " " && S[n + 1] !== " ") {
                        t = n + 1;
                        break
                    } else if (S[n] === "\n" && S[n + 1] !== "\n") {
                        t = n;
                        break
                    }
                }
                k.position(t)
            },
            "CTRL+R": function() {
                if (l) {
                    ge(true)
                } else {
                    r = g;
                    he();
                    h = S;
                    k.set("");
                    Te();
                    l = true
                }
                return false
            },
            "CTRL+G": function() {
                if (l) {
                    g = r;
                    je();
                    k.set(h);
                    Te();
                    l = false;
                    f = "";
                    return false
                }
            },
            ARROWRIGHT: se,
            "HOLD+ARROWRIGHT": debounce(se, 10),
            "CTRL+F": se,
            "CTRL+ARROWRIGHT": function() {
                if (S[R] === " ") {
                    ++R
                }
                var e = /\S[\n\s]{2,}|[\n\s]+\S?/;
                var t = S.slice(R).match(e);
                if (!t || t[0].match(/^\s+$/)) {
                    k.position(bare_text(S).length)
                } else if (t[0][0] !== " ") {
                    R += t.index + 1
                } else {
                    R += t.index + t[0].length - 1;
                    if (t[0][t[0].length - 1] !== " ") {
                        --R
                    }
                }
                Te()
            },
            F12: V,
            END: fe(true),
            "CTRL+END": fe(),
            "CTRL+E": fe(),
            HOME: le(true),
            "CTRL+HOME": le(),
            "CTRL+A": le(),
            "SHIFT+INSERT": G,
            "CTRL+SHIFT+T": V,
            "CTRL+W": Y({
                clipboard: true,
                hold: false
            }),
            "HOLD+BACKSPACE": Y({
                clipboard: false,
                hold: true
            }),
            "HOLD+SHIFT+BACKSPACE": Y({
                clipboard: false,
                hold: true
            }),
            "CTRL+H": function() {
                if (S !== "" && R > 0) {
                    k["delete"](-1)
                }
                return false
            },
            "CTRL+X": V,
            "CTRL+C": function() {
                return get_selected_html() === ""
            },
            "CTRL+T": V,
            "CTRL+Y": function() {
                if (v !== "") {
                    k.insert(v)
                }
            },
            "CTRL+V": G,
            "META+V": G,
            "CTRL+K": function() {
                var e = text(S).length;
                if (e > R) {
                    v = k["delete"](e - R);
                    text_to_clipboard(B.$node, v)
                }
                return false
            },
            "CTRL+U": function() {
                if (S !== "" && R !== 0) {
                    v = k["delete"](-R);
                    text_to_clipboard(B.$node, v)
                }
                return false
            },
            "CTRL+TAB": function() {
                return false
            },
            "META+`": V,
            "META+R": V,
            "META+L": V
        };

        function Q(i) {
            i = i || {};
            if (i.hold && !x.mobileDelete) {
                return function e() {
                    k["delete"](1);
                    return false
                }
            }
            return function e() {
                var t = / *[^ ]+ *(?= )|[^ ]+$/;
                var n = S.slice(R);
                var r = n.match(t);
                if (r) {
                    v = r[0];
                    if (i.clipboard) {
                        text_to_clipboard(B.$node, v)
                    }
                }
                k.set(S.slice(0, R) + S.slice(R).replace(t, ""), true);
                return false
            }
        }

        function Y(n) {
            n = n || {};
            if (n.hold && !x.mobileDelete) {
                return function e() {
                    k["delete"](-1)
                }
            }
            return function e() {
                if (S !== "" && R !== 0) {
                    var t = S.slice(0, R).match(/([^ ]* *$)/);
                    if (t[0].length) {
                        v = k["delete"](-t[0].length);
                        if (n.clipboard) {
                            text_to_clipboard(B.$node, v)
                        }
                    }
                }
                return false
            }
        }

        function V() {
            return true
        }

        function G() {
            B.val("");
            F = 0;
            if (k.isenabled() && !B.$node.is(":focus")) {
                B.$node.trigger("focus", [true])
            }
            B.$node.one("input", X);
            return true
        }

        function X() {
            if (F++ > 0) {
                return
            }

            function n() {
                B.val(S);
                De()
            }

            function r(e) {
                k.insert(e);
                n()
            }
            if (k.isenabled()) {
                k.oneTime(100, function() {
                    var e = B.val().replace(/\r/g, "");
                    if (is_function(x.onPaste)) {
                        var t = x.onPaste.call(k, {
                            target: k,
                            text: e
                        });
                        if (t !== undefined) {
                            if (t && is_function(t.then || t.done)) {
                                (t.then || t.done).call(t, r)
                            } else if (typeof t === "string") {
                                r(t)
                            } else if (t === false) {
                                n()
                            }
                            return
                        }
                    }
                    r(e)
                })
            }
        }

        function Z() {
            if (Le) {
                h = S;
                k.set(b.current())
            } else {
                k.set(b.previous())
            }
            Le = false;
            return false
        }

        function ee() {
            if (b.end()) {
                Le = true;
                k.set(h)
            } else {
                k.set(b.next())
            }
            return false
        }

        function te(e) {
            return e.match(/\n/)
        }

        function ne(e, t) {
            var n = e.split("\n").map(function(e) {
                return $.terminal.length(e)
            });
            if (t) {
                n[0] += t
            }
            var r = n.filter(function(e) {
                return e >= p
            });
            return !!r.length
        }

        function re(e) {
            var t = i;
            var n = $.terminal.split_equal(t + e, p);
            var r = new RegExp("^" + $.terminal.escape_regex(t));
            n = n.map($.terminal.unescape_brackets);
            n[0] = n[0].replace(r, "");
            return n
        }

        function ie() {
            var e = we(S);
            e = $.terminal.strip(e);
            var t = $.terminal.substring(e, 0, R);
            var n = k.column();
            var r = k.find(".cmd-cursor-line");
            var i = r.prevUntil("span").length;
            if (i === 1 && n <= D) {
                k.position(0);
                return false
            }
            if (i === 0) {
                return Z()
            }
            if (te(t) || ne(t, D)) {
                var u = r.prev();
                var a = u.is(".cmd-end-line");
                var o = re(e);
                u = o[i - 1];
                var s = o[i].substring(n).length;
                var l;
                if (s > 0) {
                    l = n;
                    if (i - 1 === 0) {
                        l -= D
                    }
                    l = n + u.substring(l).length;
                    if (a) {
                        ++l
                    }
                } else {
                    l = n + 1
                }
                k.position(-l, true);
                return false
            } else {
                return Z()
            }
        }

        function ue() {
            var e = we(S);
            e = $.terminal.strip(e);
            var t = $.terminal.substring(e, R);
            if (te(t) || ne(t)) {
                var n = re(e);
                var r = k.column();
                var i = k.find(".cmd-cursor-line");
                var u = i.prevUntil("span");
                var a = u.length;
                var o = i.is(".cmd-end-line");
                var s = i.next().is(".cmd-end-line");
                var l = n[a + 1];
                if (!l) {
                    return ee()
                }
                var f = n[a].substring(r).length;
                var c;
                if (f === 0) {
                    c = l.length;
                    if (s) {
                        c++
                    }
                } else {
                    c = Math.min(r, l.length) + f;
                    if (a === 0) {
                        c += D
                    }
                    if (o) {
                        c += 1
                    }
                }
                k.position(c, true);
                return false
            } else {
                return ee()
            }
        }

        function ae() {
            if (l) {
                f = f.slice(0, -1);
                he()
            } else if (S !== "" && R > 0) {
                k["delete"](-1)
            }
            k.oneTime(1, function() {
                He = true
            })
        }

        function oe() {
            if (R > 0) {
                k.position(-1, true)
            }
        }

        function se() {
            if (R < bare_text(S).length) {
                k.position(1, true)
            }
            return false
        }

        function le(e) {
            function t() {
                k.position(0)
            }
            if (e) {
                return function() {
                    if (S.match(/\n/)) {
                        var e = S.substring(0, k.position());
                        k.position(e.lastIndexOf("\n") + 1)
                    } else {
                        t()
                    }
                }
            } else {
                return t
            }
        }

        function fe(e) {
            function i() {
                k.position(text(S).length)
            }
            if (e) {
                return function() {
                    if (S.match(/\n/)) {
                        var e = S.split("\n");
                        var t = k.position();
                        var n = 0;
                        for (var r = 0; r < e.length; ++r) {
                            n += e[r].length;
                            if (n > t) {
                                k.position(n + r);
                                return
                            }
                        }
                    }
                    i()
                }
            } else {
                return i
            }
        }

        function ce() {
            var e = B.$node;
            var t = e.is(":focus");
            if (_) {
                if (!t) {}
                k.oneTime(10, function() {
                    if (!e.is(":focus") && _) {
                        e.trigger("focus", [true])
                    }
                })
            } else if (t && !_) {
                e.trigger("blur", [true])
            }
        }

        function pe() {
            if (animation_supported) {
                var e = window.getComputedStyle(O[0]);
                var t = e.getPropertyValue("--animation");
                t = t.replace(/^\s*|\s*$/g, "");
                var n = k.attr("class");
                if (n.match(/-animation/)) {
                    n = n.replace(/[a-z]+-animation/g, "")
                }
                if (t && !t.match(/blink/)) {
                    var r = t.replace(/terminal-/, "") + "-animation";
                    if (!n.match(r)) {
                        n += " " + r
                    }
                }
                n = n.replace(/\s+/g, " ");
                if (n !== k.attr("class").replace(/\s+/g, " ")) {
                    k.attr("class", n)
                }
            }
        }

        function De(e) {
            if (!k.isenabled()) {
                return
            }
            k.oneTime(10, function() {
                if (!is_mobile && B.val() !== S && !e) {
                    B.val(" " + S)
                }
                if (_) {
                    k.oneTime(10, function() {
                        try {
                            var e = !is_mobile ? R + 1 : R;
                            if (B.$node.caret() !== e) {
                                B.$node.caret(e)
                            }
                        } catch (e) {}
                    })
                }
            })
        }
        if (animation_supported && !is_android) {
            C = function(e) {
                if (e) {
                    O.addClass("cmd-blink")
                } else {
                    O.removeClass("cmd-blink")
                }
            };
            L = function() {
                var e = O.clone();
                e.insertBefore(O);
                O.remove();
                O = e
            }
        } else {
            var me = false;
            C = function(e) {
                if (e && !me) {
                    me = true;
                    O.addClass("cmd-inverted cmd-blink");
                    k.everyTime(500, "blink", de)
                } else if (me && !e) {
                    me = false;
                    k.stopTime("blink", de);
                    O.removeClass("cmd-inverted cmd-blink")
                }
            };
            L = function() {
                C(false);
                C(true)
            }
        }

        function de() {
            O.toggleClass("cmd-inverted")
        }

        function he() {
            g = "(reverse-i-search)`" + f + "': ";
            je()
        }

        function ve() {
            g = r;
            l = false;
            c = null;
            f = ""
        }

        function ge(e) {
            var t = b.data();
            var n, r;
            var i = t.length;
            if (e && c > 0) {
                i -= c
            }
            if (f.length > 0) {
                for (var u = f.length; u > 0; u--) {
                    r = $.terminal.escape_regex(f.slice(0, u));
                    if (x.caseSensitiveSearch) {
                        n = new RegExp(r)
                    } else {
                        n = new RegExp(r, "i")
                    }
                    for (var a = i; a--;) {
                        if (n.test(t[a])) {
                            c = t.length - a;
                            k.position(t[a].indexOf(r));
                            k.set(t[a], true);
                            Te();
                            if (f.length !== u) {
                                f = f.slice(0, u);
                                he()
                            }
                            return
                        }
                    }
                }
            }
            f = ""
        }

        function _e() {
            var e = k.find(".cmd-prompt");
            var t = e.html();
            e.html("<span>&nbsp;</span>");
            var n = e.find("span")[0].getBoundingClientRect().width;
            e.html(t);
            return n
        }

        function ye(e) {
            var t = k.width();
            return Math.floor(t / e)
        }

        function be(e) {
            function t(e) {
                return $.terminal.split_equal(e, p)
            }

            function n(n) {
                var r = [];
                n.forEach(function(e, t) {
                    if ($.terminal.strip(e).match(E)) {
                        r[t] = false;
                        if (t > 0) {
                            r[t - 1] += w
                        }
                    } else {
                        r[t] = n[t]
                    }
                });
                return r.filter(function(e) {
                    return e !== false
                })
            }
            var r = d.find(".cmd-line");
            var i;
            if (r.length) {
                i = r.nextUntil(".cmd-line").text()
            } else {
                i = d.text()
            }
            i = $.terminal.escape_brackets(i);
            var u = new RegExp("^" + $.terminal.escape_regex(i));
            var a;
            if (e.match(/\n/)) {
                var o = e.split("\n");
                var s = p - D - 1;
                for (var l = 0; l < o.length - 1; ++l) {
                    o[l] += w
                }
                if (strlen(o[0]) > s) {
                    a = t(i + o[0]);
                    a[0] = a[0].replace(u, "");
                    a = n(a)
                } else {
                    a = [o[0]]
                }
                for (l = 1; l < o.length; ++l) {
                    if (strlen(o[l]) > p) {
                        var f = t(o[l]);
                        if (l < o.length - 1) {
                            f = n(f)
                        }
                        a = a.concat(f)
                    } else {
                        a.push(o[l])
                    }
                }
            } else {
                a = t(i + e, p);
                a[0] = a[0].replace(u, "")
            }
            if (a.length > 1) {
                var c = $.terminal.length(a[a.length - 1]);
                if (c === p) {
                    a.push("")
                }
            }
            return a
        }
        var Ce = new WorkerCache({
            validation: function(e) {
                var t = false;
                if ((!this._previous_value || this._previous_value === e) && (!this._cols || this._cols === p)) {
                    t = true
                }
                this._previous_value = e;
                this._cols = p;
                return t
            },
            action: be
        });

        function Fe(e) {
            return Ce.get(e)
        }

        function we(t, e) {
            try {
                t = $.terminal.escape_formatting(t);
                var n = $.extend({}, x, {
                    unixFormattingEscapeBrackets: true,
                    position: R,
                    command: true
                });
                var r = $.terminal.apply_formatters(t, n);
                var i = $.terminal.normalize(r[0]);
                var u = $.terminal.length(i);
                if (!e) {
                    j = r[1];
                    if (j > u) {
                        j = u
                    }
                }
                return i
            } catch (e) {
                alert_exception("[Formatting]", e.stack);
                return t
            }
        }

        function Ee(e, t) {
            var n = $.terminal.encode(xe(e), {
                tabs: x.tabs,
                before: t
            });
            return $.terminal.format(n, {
                charWidth: x.charWidth,
                allowedAttributes: x.allowedAttributes || []
            })
        }

        function xe(e) {
            return $.terminal.partition(e).join("")
        }

        function $e(e, t) {
            return $.terminal.length(e, t)
        }

        function ke(e) {
            return strlen(text(e)) > p - D - 1 || e.match(/\n/)
        }

        function Ae(e, t, n) {
            return $.terminal.substring(e, t, n)
        }

        function Be(e) {
            if ($.terminal.is_formatting(e)) {
                return e.replace(format_parts_re, "$4").match(/^emoji /)
            }
            return false
        }
        var Te = function() {
            var g = O.prev();
            var _ = O.next();
            var y = O.parent();

            function b(e, t) {
                var n = e.match(I);
                if (n) {
                    e = e.replace(I, " ")
                }
                y.toggleClass("cmd-end-line", !!n);
                var r = false;
                var i = $.extend({
                    prompt: "",
                    last: false
                }, t);
                var u = i.position;
                var a = $e(e);
                var o = i.prompt;
                var s;
                if (u === a) {
                    g.html(Ee(e));
                    s = "&nbsp;";
                    F();
                    _.html("")
                } else if (u === 0) {
                    g.html("");
                    s = Ae(e, 0, 1);
                    O.html(Ee(s));
                    _.html(Ee(Ae(e, 1), o + s))
                } else {
                    var l = $.terminal.substring(e, 0, u);
                    g.html(Ee(l, o));
                    s = Ae(e, u, u + 1);
                    var f = (o + l).replace(/^.*\t/, "");
                    O.html(Ee(s, f));
                    if (u === a - 1) {
                        r = true;
                        _.html("")
                    } else {
                        if (s.match(/\t/)) {
                            f = ""
                        } else {
                            f += s
                        }
                        _.html(Ee(Ae(e, u + 1), f))
                    }
                }
                if (ch_unit_bug) {
                    if (typeof wcwidth !== "undefined") {
                        var c = strlen(text(s));
                        if (c === 1 && Be(s)) {
                            c = 2
                        }
                        O.width(m * c)
                    } else {
                        O.width(m)
                    }
                }
                O.toggleClass("cmd-end-line", r);
                pe();
                var p = $.terminal.length(O.text());
                if (p > 1) {
                    var D = O.find("[data-text]")[0];
                    D.style.setProperty("--length", p)
                }
                L()
            }

            function C(e, t) {
                var n = e.match(I);
                var r = '<div role="presentation" aria-hidden="true"';
                if (n) {
                    e = e.replace(I, " ");
                    r += ' class="cmd-end-line"'
                }
                r += ">" + Ee(e, t || "") + "</div>";
                return r
            }

            function F() {
                O.html('<span data-text class="end"><span>&nbsp;<span></span>')
            }

            function w(e) {
                var n = y;
                $.each(e, function(e, t) {
                    n = $(C(t)).insertAfter(n)
                })
            }

            function E(e) {
                $.each(e, function(e, t) {
                    y.before(C(t, e === 0 ? T : ""))
                })
            }
            return function() {
                var e;
                switch (typeof x.mask) {
                    case "boolean":
                        e = x.mask ? S.replace(/./g, "*") : S;
                        break;
                    case "string":
                        e = S.replace(/./g, x.mask);
                        break
                }
                var t = we(e);
                var n;
                if ($e(t) === text(e).length) {
                    n = R
                } else {
                    n = j
                }
                var r;
                A.css({
                    display: "none"
                });
                A.find("div:not(.cmd-cursor-line)").remove();
                g.html("");
                if (ke(t)) {
                    var i = t.match(/\t/g);
                    var u = t;
                    if (i) {
                        t = t.replace(/\t/g, "\0\0\0\0")
                    }
                    var a = Fe(t);
                    if (i) {
                        a = $.map(a, function(e) {
                            return e.replace(/\x00\x00\x00\x00/g, "\t")
                        })
                    }
                    var o = $e(a[0]);
                    if (o === 0 && a.length === 1) {} else if (n < o) {
                        b(a[0], {
                            length: a.length,
                            position: n,
                            prompt: T
                        });
                        w(a.slice(1))
                    } else if (n === o) {
                        y.before(C(a[0], T));
                        b(a[1] || "", {
                            length: a.length,
                            position: 0,
                            last: a.length <= 2
                        });
                        if (a.length > 2) {
                            w(a.slice(2))
                        }
                    } else {
                        var s = a.slice(-1)[0];
                        var l = $e(u);
                        var f = l - n;
                        var c = $e(s);
                        var p = 0;
                        if (f === -1) {
                            f = 0
                        }
                        if (f <= c) {
                            E(a.slice(0, -1));
                            if (c === f) {
                                p = 0
                            } else {
                                p = c - f
                            }
                            b(s, {
                                length: a.length,
                                position: p,
                                last: true
                            })
                        } else {
                            var D;
                            var m;
                            p = n;
                            for (r = 0; r < a.length; ++r) {
                                var d = $.terminal.length(a[r]);
                                if (p > d) {
                                    p -= d
                                } else {
                                    break
                                }
                            }
                            m = a[r];
                            D = r;
                            if (p === $e(m)) {
                                p = 0;
                                m = a[++D];
                                if (m === undefined) {
                                    var h = $.terminal.defaults.strings.redrawError;
                                    throw new Error(h)
                                }
                            }
                            b(m, {
                                length: a.length,
                                position: p
                            });
                            E(a.slice(0, D));
                            w(a.slice(D + 1))
                        }
                    }
                    k.find(".cmd-cursor-line ~ div:last-of-type").append("<span></span>")
                } else if (t === "") {
                    g.html("");
                    F();
                    _.html("")
                } else {
                    b(t, {
                        length: 1,
                        position: n
                    })
                }
                var v = y.prevUntil(".cmd-prompt").length;
                if (is_css_variables_supported) {
                    k[0].style.setProperty("--cursor-line", v)
                } else {
                    B.$node.css("top", v * 14 + "px")
                }
                A.css({
                    display: ""
                })
            }
        }();
        var Se = function() {
            function u(e, t) {
                var n = $.extend({}, x, {
                    position: t,
                    command: true
                });
                return $.terminal.apply_formatters(e, n)[1]
            }

            function s(e, t, n) {
                var r = u(n, t);
                if (r === e) {
                    var i = u(n, t + 1);
                    if (i > e) {
                        return 0
                    }
                    return 1
                } else if (r < e) {
                    return 1
                } else {
                    return -1
                }
            }
            return function(e, t) {
                if (t === 0) {
                    return 0
                }
                e = bare_text(e);
                var n = e.length;
                var r = $.terminal.escape_brackets(S);
                var i = binary_search(0, n, t, s, [r]);
                var u = $.terminal.split_characters(e);
                if (n > u.length) {
                    var a = 0;
                    for (var o = 0; o < u.length; ++o) {
                        a += u[o].length;
                        if (a >= i) {
                            return a
                        }
                    }
                }
                return i
            }
        }();
        var Re;
        var je = function() {
            function r(e) {
                if (!e) {
                    u = 0;
                    D = u + s;
                    return e
                }
                var t = $.terminal.split_equal(e, p).map(function(e) {
                    if (!$.terminal.have_formatting(e)) {
                        return "[[;;]" + $.terminal.escape_brackets(e) + "]"
                    }
                    return $.terminal.format_split(e).map(function(e) {
                        if ($.terminal.is_formatting(e)) {
                            return e
                        }
                        return "[[;;]" + $.terminal.escape_brackets(e) + "]"
                    }).join("")
                });
                var n = {
                    charWidth: x.charWidth
                };
                T = t[t.length - 1];
                var r = $.terminal.encode(t[t.length - 1], {
                    tabs: x.tabs
                });
                var i = $.terminal.format(r, n);
                u = strlen(text(r));
                D = u + s;
                return t.slice(0, -1).map(function(e) {
                    e = $.terminal.encode(e, {
                        tabs: x.tabs
                    });
                    return '<span class="cmd-line">' + $.terminal.format(e, n) + "</span>"
                }).concat([i]).join("\n")
            }

            function e(e) {
                if (e) {
                    e = $.terminal.apply_formatters(e, {
                        prompt: true
                    });
                    e = $.terminal.normalize(e);
                    e = crlf(e)
                }
                var t = r(e);
                i = e;
                t = t || $.terminal.format("[[;;]​]");
                if (d.html() !== t) {
                    d.html(t);
                    var n = d.find("> span span");
                    B.$node.attr("data-cmd-prompt", d.text());
                    if (is_ch_unit_supported) {
                        d.hide();
                        n.each(function() {
                            var e = $(this);
                            var t = strlen(e.text());
                            if (t === 0) {
                                e.css("width", 1)
                            } else {
                                e.css("width", t + "ch")
                            }
                        });
                        d.show()
                    }
                }
            }
            return function() {
                if (Re && Re.set) {
                    Re.set = $.noop;
                    Re = null
                }
                var t = Re = {
                    set: e
                };
                with_prompt(g, function(e) {
                    t.set(e)
                }, k)
            }
        }();

        function Oe() {
            if (is_function(x.onCommandChange)) {
                x.onCommandChange.call(k, S)
            }
        }
        $.extend(k, {
            option: function(e, t) {
                if (typeof t === "undefined") {
                    return x[e]
                } else {
                    x[e] = t
                }
                return k
            },
            name: function(e) {
                if (e !== undefined) {
                    y = e;
                    var t = b && b.enabled() || !b;
                    b = new History(y, x.historySize, x.history === "memory");
                    if (!t) {
                        b.disable()
                    }
                    return k
                } else {
                    return y
                }
            },
            purge: function() {
                b.clear();
                return k
            },
            history: function() {
                return b
            },
            delete: function(e, t) {
                var n, r;
                if (e === 0) {
                    return ""
                } else if (e < 0) {
                    if (R > 0) {
                        n = S.slice(0, R).slice(e);
                        r = bare_text(S);
                        r = r.slice(0, R + e) + r.slice(R, r.length);
                        if (!t) {
                            k.position(R + e)
                        }
                    }
                } else if (S !== "") {
                    r = text(S);
                    if (R < r.length) {
                        n = r.slice(R).slice(0, e);
                        r = r.slice(0, R) + r.slice(R + e, r.length)
                    }
                }
                if (n) {
                    S = r
                }
                Te();
                De();
                Oe();
                return n
            },
            set: function(e, t, n) {
                if (e !== undefined) {
                    S = e;
                    if (!t) {
                        k.position(bare_text(S).length)
                    }
                    Te();
                    De();
                    if (!n) {
                        Oe()
                    }
                }
                return k
            },
            keymap: function(e, t) {
                function n(e, t) {
                    var n = J[e];
                    if (is_function(n)) {
                        n = n.bind(k)
                    }
                    return function(e) {
                        return t.call(k, e, n)
                    }
                }
                if (e === null) {
                    K = J;
                    return k
                } else if (typeof e === "undefined") {
                    return K
                } else if (typeof e === "string") {
                    if (typeof t === "undefined") {
                        if (K[e]) {
                            return K[e]
                        } else if (J[e]) {
                            return J[e]
                        }
                    } else {
                        K[e] = n(e, t)
                    }
                } else {
                    K = $.extend({}, K ? K : J, $.omap(e || {}, n));
                    return k
                }
            },
            insert: function(e, t) {
                var n = bare_text(S);
                var r = bare_text(e).length;
                if (R === n.length) {
                    e = n + e
                } else if (R === 0) {
                    e = e + n
                } else {
                    e = n.slice(0, R) + e + n.slice(R)
                }
                S = e;
                if (!t) {
                    k.position(r, true, true)
                }
                De();
                Te();
                Oe();
                return k
            },
            get: function() {
                return S
            },
            commands: function(e) {
                if (e) {
                    x.commands = e;
                    return k
                } else {
                    return e
                }
            },
            destroy: function() {
                rt.unbind("keypress.cmd", it);
                rt.unbind("keydown.cmd", tt);
                rt.unbind("input.cmd", st);
                k.stopTime("blink", de);
                k.find(".cmd-wrapper").remove();
                k.find(".cmd-prompt, .cmd-clipboard, .cmd-editable").remove();
                k.removeClass("cmd").removeData("cmd").off(".cmd");
                return k
            },
            column: function(e) {
                var t = S.substring(0, R);
                if (R === 0 || !S.length) {
                    return 0
                }
                var n = /\n?([^\n]*)$/;
                var r = t.match(n);
                var i = r[1].length;
                if (!te(t) && (e || ne(t, D))) {
                    i += D
                }
                if (i === 0) {
                    return i
                }
                i %= p;
                if (i === 0) {
                    return p
                }
                return i
            },
            line: function() {
                var e = S.substring(0, R);
                if (R === 0 || !S.length) {
                    return 0
                }
                return e.split(/\n/).length - 1
            },
            __set_prompt_margin: function(e) {
                s = e;
                D = u + s
            },
            prompt: function(e) {
                if (e === true) {
                    return i
                } else if (e === undefined) {
                    return g
                } else {
                    var t = e !== g;
                    if (typeof e === "string" || typeof e === "function") {
                        g = e
                    } else {
                        throw new Error("prompt must be a function or string")
                    }
                    if (t) {
                        je();
                        Te()
                    }
                    return k
                }
            },
            kill_text: function() {
                return v
            },
            position: function(e, t, n) {
                if (typeof e === "number") {
                    var r = R;
                    var i = bare_text(S).length;
                    if (t) {
                        R += e
                    } else if (e < 0) {
                        R = 0
                    } else if (e > i) {
                        R = i
                    } else {
                        R = e
                    }
                    if (r !== R) {
                        Te();
                        if (!n && is_function(x.onPositionChange)) {
                            x.onPositionChange(R, j)
                        }
                        De(true)
                    }
                    return k
                } else {
                    return R
                }
            },
            refresh: function() {
                je();
                Te();
                De(true);
                return k
            },
            display_position: function(e, t) {
                if (e === undefined) {
                    return j
                } else {
                    var n = we($.terminal.escape_formatting(S), true);
                    var r = $e(n);
                    var i = bare_text(S).length;
                    var u;
                    if (t) {
                        u = j + e
                    } else if (e > r) {
                        u = r
                    } else {
                        u = e
                    }
                    if (r === i) {
                        j = u;
                        return k.position(u)
                    }
                    if (r === u) {
                        j = u;
                        return k.position(i)
                    }
                    var a = Se(S, u);
                    if (a !== -1) {
                        j = u;
                        k.position(a)
                    }
                    return k
                }
            },
            visible: function() {
                var e = k.visible;
                return function() {
                    e.apply(k, []);
                    Te();
                    je();
                    return k
                }
            }(),
            show: function() {
                var e = k.show;
                return function() {
                    e.apply(k, []);
                    Te();
                    je();
                    return k
                }
            }(),
            resize: function(e) {
                m = _e();
                var t;
                if (typeof e === "number") {
                    t = e
                } else {
                    t = ye(m)
                }
                if (p !== t || arguments[0] === true) {
                    p = t;
                    Te();
                    je()
                }
                return k
            },
            invoke_key: function(e) {
                if (!_) {
                    warn('invoke_key("' + e + '") called on disabled terminal')
                }
                var t = e.toUpperCase().split("+");
                var n = t.pop();
                var r = t.indexOf("CTRL") !== -1;
                var i = t.indexOf("SHIFT") !== -1;
                var u = t.indexOf("ALT") !== -1;
                var a = t.indexOf("META") !== -1;
                var o = $.Event("keydown", {
                    ctrlKey: r,
                    shiftKey: i,
                    altKey: u,
                    metaKey: a,
                    which: U[n],
                    key: n
                });
                var s = $(document.documentElement || window);
                s.trigger(o);
                o = $.Event("keypress");
                o.key = n;
                o.which = o.keyCode = 0;
                s.trigger(o);
                return k
            },
            clip: function() {
                return B
            },
            enable: function(e) {
                if (!_) {
                    _ = true;
                    k.addClass("enabled");
                    try {
                        if (!B.$node.is(":focus")) {
                            B.$node.focus()
                        }
                        B.$node.caret(R)
                    } catch (e) {}
                    C(true);
                    if (!e && is_function(g)) {
                        je()
                    }
                    pe();
                    De()
                }
                ce();
                return k
            },
            isenabled: function() {
                return _
            },
            disable: function(e) {
                _ = false;
                k.removeClass("enabled");
                C(false);
                if (!e) {
                    ce()
                }
                return k
            },
            mask: function(e) {
                if (typeof e === "undefined") {
                    return x.mask
                } else {
                    x.mask = e;
                    Te();
                    return k
                }
            }
        });
        k.name(x.name || x.prompt || "");
        if (x.prompt !== false) {
            g = x.prompt;
            je()
        }
        if (x.enabled === true) {
            k.enable()
        }
        m = _e();
        p = ye(m);
        if (!x.history) {
            b.disable()
        }
        var Le = true;
        var Ie = false;
        var ze = false;
        var Pe = false;
        var Ne = false;
        var Me = false;
        var He = true;
        var We = false;
        var qe = false;
        var Ue = false;
        var Ke = false;
        var Je;
        var Qe = "";
        var Ye;

        function Ve(e) {
            return e.key.toUpperCase() === "BACKSPACE" || e.which === 8
        }

        function Ge(e) {
            return e.key && e.key.length === 1 && !e.ctrlKey
        }

        function Xe(e) {
            var t = ["HOLD+SHIFT+BACKSPACE", "HOLD+BACKSPACE"];
            return t.indexOf(e) !== -1 && x.mobileDelete || x.repeatTimeoutKeys.indexOf(e) !== -1
        }

        function Ze(e) {
            return e.which === 35 || e.which === 36 || e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 13 || e.which === 27
        }
        var et = false;

        function tt(e) {
            debug('keydown "' + e.key + '" ' + e.fake + " " + e.which);
            var t;
            qe = (e.key || "").toLowerCase() === "process" || e.which === 0;
            ze = Ne && Pe && !Ve(e);
            try {
                if (!e.fake) {
                    Pe = Ge(e);
                    Me = String(e.key).toLowerCase() === "unidentified";
                    We = Ve(e)
                }
            } catch (e) {}
            if (e.key === "Unidentified") {
                He = true;
                return
            }
            if (!e.fake && ["meta", "os"].indexOf(e.key.toLowerCase()) === -1) {
                He = false
            }
            Ne = true;
            B.$node.off("input", X);
            var n = M(e);
            if (is_function(x.keydown)) {
                e.key = N(e);
                t = x.keydown.call(k, e);
                if (t !== undefined) {
                    if (!t) {
                        Je = true
                    }
                    return t
                }
            }
            if (n !== Ye) {
                nt()
            }
            if (_ || n === "CTRL+C" && is_terminal_selected(k)) {
                if (Ue) {
                    Ye = n;
                    n = "HOLD+" + n;
                    if (Ke) {
                        return
                    }
                    if (x.holdRepeatTimeout > 0 && Xe(n)) {
                        Ke = true;
                        k.oneTime(x.holdRepeatTimeout, "delay", function() {
                            Ke = false
                        })
                    }
                } else {
                    k.oneTime(x.holdTimeout, "hold", function() {
                        Ue = true
                    });
                    Ye = n
                }
                if (!e.fake && is_android) {
                    if (et) {
                        nt();
                        et = false;
                        return false
                    }
                    if (a(n)) {
                        et = true
                    } else if (a(Ye)) {
                        et = false
                    }
                }
                L();
                Je = ["CTRL+V", "META+V"].indexOf(n) !== -1;
                if (n.toLowerCase() === "enter") {
                    Le = true
                }
                if (l && Ze(e)) {
                    ve();
                    je();
                    if (e.which === 27) {
                        k.set("")
                    }
                    Te();
                    if (e.which === 13) {
                        tt.call(this, e)
                    }
                } else if (is_function(K[n])) {
                    t = K[n](e);
                    if (t === true) {
                        return
                    }
                    if (t !== undefined) {
                        return t
                    }
                } else if (e.altKey) {
                    return
                } else {
                    Ie = false;
                    return
                }
            }
        }

        function nt() {
            k.stopTime("hold");
            k.stopTime("delay");
            Ke = Ue = false
        }
        var rt = $(document.documentElement || window);
        k.keymap(x.keymap || {});

        function it(e) {
            debug('keypress "' + e.key + '" ' + e.fake);
            nt();
            var t;
            if (!e.fake) {
                Ne = false
            }
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                return
            }
            if (Ie) {
                return
            }
            if (is_function(x.keypress)) {
                t = x.keypress.call(k, e);
                if (t !== undefined) {
                    if (!t) {
                        Je = true
                    }
                    return t
                }
            }
            if (_) {
                if (e.fake) {
                    return
                }
                var n;
                if (is_key_native) {
                    n = e.key;
                    var r = n.toUpperCase();
                    if (P[r]) {
                        n = P[r]
                    }
                }
                if (!n || Me) {
                    n = String.fromCharCode(e.which)
                }
                if ($.inArray(e.which, [13, 0, 8]) > -1) {
                    if (e.keyCode === 123) {
                        return
                    }
                    return false
                } else if (n && (!e.ctrlKey || e.ctrlKey && e.ctrlKey) && (!(e.altKey && e.which === 100) || e.altKey) && !ze) {
                    if (l) {
                        f += n;
                        ge();
                        he()
                    } else if (n.length === 1) {
                        k.insert(n)
                    }
                }
            }
        }

        function ut(e, t, n) {
            var r = $.Event(e);
            r.which = n;
            r.key = t;
            r.fake = true;
            rt.trigger(r)
        }
        var at = false;

        function ot() {
            Qe = S;
            Je = false;
            He = true
        }

        function st() {
            debug("input " + He + " || " + qe + " ((" + Ne + " || " + ze + ") && !" + Je + " && (" + Pe + " || " + Me + ") && !" + We + ")");
            var e = B.val();
            if (!is_mobile) {
                e = e.replace(/^ /, "")
            }
            if (He || qe || (Ne || ze) && !Je && (Pe || Me) && !We) {
                if (e && e === S) {
                    if (is_android) {
                        if (He) {
                            ut("keydown", "Enter", 13)
                        }
                    }
                    ot();
                    return
                }
                var t = R;
                if (He) {
                    var n = Qe;
                    We = n.slice(0, n.length - 1).length === e.length
                }
                if (at) {
                    at = false;
                    B.val(S);
                    return
                }
                if (l) {
                    f = e;
                    ge();
                    he()
                } else {
                    var r = e.slice(R);
                    if (r.length === 1 || We) {
                        var i = get_next_character(r);
                        if (a(i)) {
                            at = true
                        }
                        if (He) {
                            var u;
                            if (We) {
                                u = 8
                            } else {
                                u = r.toUpperCase().charCodeAt(0)
                            }
                            ut("keydown", We ? "Backspace" : r, u)
                        }
                        if (Ne && !We) {
                            ut("keypress", i, r.charCodeAt(0))
                        }
                    }
                    if (We) {
                        Qe = S;
                        return
                    }
                    if (Je) {
                        Je = false;
                        return
                    }
                    k.set(e)
                }
                if (We) {
                    k.position(t - 1)
                } else {
                    k.position(t + Math.abs(e.length - Qe.length))
                }
            }
            ot()
        }
        rt.bind("keypress.cmd", it);
        rt.bind("keydown.cmd", tt);
        rt.bind("keyup.cmd", nt);
        rt.bind("input.cmd", st);
        (function() {
            if (is_mobile) {
                $(k[0]).add(B.$node).on("touchstart.cmd", function() {
                    if (!k.isenabled()) {
                        B.focus()
                    } else {
                        B.blur()
                    }
                });
                k.disable();
                return
            }
            var u = false;
            var a = 0;
            k.on("mousedown.cmd", function() {
                u = true
            }).on("mouseup.cmd", function(n) {
                function e() {
                    var e = $(n.target);
                    var t = e.is(".cmd-prompt");
                    if (!t && i && get_selected_html() === "") {
                        if (_) {
                            if (e.is(".cmd")) {
                                k.position(text(S).length)
                            } else {
                                k.display_position(z(n))
                            }
                        }
                    }
                    a = 0
                }
                var t;
                if (n.originalEvent === undefined) {
                    t = n.button
                } else {
                    t = n.originalEvent.button
                }
                if (t === 0 && get_selected_html() === "") {
                    var r = "click_" + o;
                    if (++a === 1) {
                        var i = u;
                        if (_) {
                            if (x.clickTimeout === 0) {
                                e()
                            } else {
                                k.oneTime(x.clickTimeout, r, e)
                            }
                        } else {
                            a = 0
                        }
                    } else {
                        k.stopTime(r);
                        a = 0
                    }
                }
                u = false
            })
        })();
        k.data("cmd", k);
        if (!("KeyboardEvent" in window && "key" in window.KeyboardEvent.prototype)) {
            setTimeout(function() {
                throw new Error("key event property not supported try https://github." + "com/inexorabletash/polyfill/blob/master/keyboard.js")
            }, 0)
        }
        return k
    };
    var strlen = function() {
        if (typeof wcwidth === "undefined") {
            return function(e) {
                e = e.replace(/\u200B/g, "");
                return $.terminal.length(e)
            }
        } else {
            return wcwidth
        }
    }();

    function count_selfclosing_formatting(e) {
        var n = 0;
        if ($.terminal.have_formatting(e)) {
            var r = new RegExp(format_parts_re.source, "i");
            $.terminal.format_split(e).forEach(function(e) {
                if ($.terminal.is_formatting(e)) {
                    var t = e.match(r);
                    if (t && t[1].match(/@/) && t[6] === "") {
                        n++
                    }
                }
            })
        }
        return n
    }
    var entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&Agrave;": "À",
        "&Aacute;": "Á",
        "&Acirc;": "Â",
        "&Atilde;": "Ã",
        "&Auml;": "Ä",
        "&Aring;": "Å",
        "&AElig;": "Æ",
        "&Ccedil;": "Ç",
        "&Egrave;": "È",
        "&Eacute;": "É",
        "&Ecirc;": "Ê",
        "&Euml;": "Ë",
        "&Igrave;": "Ì",
        "&Iacute;": "Í",
        "&Icirc;": "Î",
        "&Iuml;": "Ï",
        "&ETH;": "Ð",
        "&Ntilde;": "Ñ",
        "&Ograve;": "Ò",
        "&Oacute;": "Ó",
        "&Ocirc;": "Ô",
        "&Otilde;": "Õ",
        "&Ouml;": "Ö",
        "&Oslash;": "Ø",
        "&Ugrave;": "Ù",
        "&Uacute;": "Ú",
        "&Ucirc;": "Û",
        "&Uuml;": "Ü",
        "&Yacute;": "Ý",
        "&THORN;": "Þ",
        "&szlig;": "ß",
        "&agrave;": "à",
        "&aacute;": "á",
        "&acirc;": "â",
        "&atilde;": "ã",
        "&auml;": "ä",
        "&aring;": "å",
        "&aelig;": "æ",
        "&ccedil;": "ç",
        "&egrave;": "è",
        "&eacute;": "é",
        "&ecirc;": "ê",
        "&euml;": "ë",
        "&igrave;": "ì",
        "&iacute;": "í",
        "&icirc;": "î",
        "&iuml;": "ï",
        "&eth;": "ð",
        "&ntilde;": "ñ",
        "&ograve;": "ò",
        "&oacute;": "ó",
        "&ocirc;": "ô",
        "&otilde;": "õ",
        "&ouml;": "ö",
        "&oslash;": "ø",
        "&ugrave;": "ù",
        "&uacute;": "ú",
        "&ucirc;": "û",
        "&uuml;": "ü",
        "&yacute;": "ý",
        "&thorn;": "þ",
        "&yuml;": "ÿ",
        "&nbsp;": " ",
        "&iexcl;": "¡",
        "&cent;": "¢",
        "&pound;": "£",
        "&curren;": "¤",
        "&yen;": "¥",
        "&brvbar;": "¦",
        "&sect;": "§",
        "&uml;": "¨",
        "&copy;": "©",
        "&ordf;": "ª",
        "&laquo;": "«",
        "&not;": "¬",
        "&shy;": "­",
        "&reg;": "®",
        "&macr;": "¯",
        "&deg;": "°",
        "&plusmn;": "±",
        "&sup2;": "²",
        "&sup3;": "³",
        "&acute;": "´",
        "&micro;": "µ",
        "&para;": "¶",
        "&cedil;": "¸",
        "&sup1;": "¹",
        "&ordm;": "º",
        "&raquo;": "»",
        "&frac14;": "¼",
        "&frac12;": "½",
        "&frac34;": "¾",
        "&iquest;": "¿",
        "&times;": "×",
        "&divide;": "÷",
        "&forall;": "∀",
        "&part;": "∂",
        "&exist;": "∃",
        "&empty;": "∅",
        "&nabla;": "∇",
        "&isin;": "∈",
        "&notin;": "∉",
        "&ni;": "∋",
        "&prod;": "∏",
        "&sum;": "∑",
        "&minus;": "−",
        "&lowast;": "∗",
        "&radic;": "√",
        "&prop;": "∝",
        "&infin;": "∞",
        "&ang;": "∠",
        "&and;": "∧",
        "&or;": "∨",
        "&cap;": "∩",
        "&cup;": "∪",
        "&int;": "∫",
        "&there4;": "∴",
        "&sim;": "∼",
        "&cong;": "≅",
        "&asymp;": "≈",
        "&ne;": "≠",
        "&equiv;": "≡",
        "&le;": "≤",
        "&ge;": "≥",
        "&sub;": "⊂",
        "&sup;": "⊃",
        "&nsub;": "⊄",
        "&sube;": "⊆",
        "&supe;": "⊇",
        "&oplus;": "⊕",
        "&otimes;": "⊗",
        "&perp;": "⊥",
        "&sdot;": "⋅",
        "&Alpha;": "Α",
        "&Beta;": "Β",
        "&Gamma;": "Γ",
        "&Delta;": "Δ",
        "&Epsilon;": "Ε",
        "&Zeta;": "Ζ",
        "&Eta;": "Η",
        "&Theta;": "Θ",
        "&Iota;": "Ι",
        "&Kappa;": "Κ",
        "&Lambda;": "Λ",
        "&Mu;": "Μ",
        "&Nu;": "Ν",
        "&Xi;": "Ξ",
        "&Omicron;": "Ο",
        "&Pi;": "Π",
        "&Rho;": "Ρ",
        "&Sigma;": "Σ",
        "&Tau;": "Τ",
        "&Upsilon;": "Υ",
        "&Phi;": "Φ",
        "&Chi;": "Χ",
        "&Psi;": "Ψ",
        "&Omega;": "Ω",
        "&alpha;": "α",
        "&beta;": "β",
        "&gamma;": "γ",
        "&delta;": "δ",
        "&epsilon;": "ε",
        "&zeta;": "ζ",
        "&eta;": "η",
        "&theta;": "θ",
        "&iota;": "ι",
        "&kappa;": "κ",
        "&lambda;": "λ",
        "&mu;": "μ",
        "&nu;": "ν",
        "&xi;": "ξ",
        "&omicron;": "ο",
        "&pi;": "π",
        "&rho;": "ρ",
        "&sigmaf;": "ς",
        "&sigma;": "σ",
        "&tau;": "τ",
        "&upsilon;": "υ",
        "&phi;": "φ",
        "&chi;": "χ",
        "&psi;": "ψ",
        "&omega;": "ω",
        "&thetasym;": "ϑ",
        "&upsih;": "ϒ",
        "&piv;": "ϖ",
        "&OElig;": "Œ",
        "&oelig;": "œ",
        "&Scaron;": "Š",
        "&scaron;": "š",
        "&Yuml;": "Ÿ",
        "&fnof;": "ƒ",
        "&circ;": "ˆ",
        "&tilde;": "˜",
        "&ensp;": " ",
        "&emsp;": " ",
        "&thinsp;": " ",
        "&zwnj;": "‌",
        "&zwj;": "‍",
        "&lrm;": "‎",
        "&rlm;": "‏",
        "&ndash;": "–",
        "&mdash;": "—",
        "&lsquo;": "‘",
        "&rsquo;": "’",
        "&sbquo;": "‚",
        "&ldquo;": "“",
        "&rdquo;": "”",
        "&bdquo;": "„",
        "&dagger;": "†",
        "&Dagger;": "‡",
        "&bull;": "•",
        "&hellip;": "…",
        "&permil;": "‰",
        "&prime;": "′",
        "&Prime;": "″",
        "&lsaquo;": "‹",
        "&rsaquo;": "›",
        "&oline;": "‾",
        "&euro;": "€",
        "&trade;": "™",
        "&larr;": "←",
        "&uarr;": "↑",
        "&rarr;": "→",
        "&darr;": "↓",
        "&harr;": "↔",
        "&crarr;": "↵",
        "&lceil;": "⌈",
        "&rceil;": "⌉",
        "&lfloor;": "⌊",
        "&rfloor;": "⌋",
        "&loz;": "◊",
        "&spades;": "♠",
        "&clubs;": "♣",
        "&hearts;": "♥",
        "&diams;": "♦"
    };

    function render_entities(e) {
        return e.replace(/&#(x?)([0-9]+);/g, function(e, t, n) {
            n = parseInt(n, t ? 16 : 10);
            return String.fromCharCode(n)
        }).replace(/(&[^;]+;)/g, function(e, t) {
            return entities[t] || t
        })
    }

    function bare_text(e) {
        if (!e.match(/&/)) {
            return e
        }
        return render_entities(safe(e))
    }

    function text(e) {
        return bare_text($.terminal.strip(e))
    }

    function safe(e) {
        if (!e.match(/[<>&]/)) {
            return e
        }
        return e.replace(/&(?![^;]+;)/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")
    }

    function crlf(e) {
        return e.replace(/\r/g, "")
    }

    function char_len(e) {
        return entity_re.test(e) ? 1 : e.length
    }

    function make_re_fn(n) {
        return function(e) {
            var t = e.match(n);
            if (starts_with(t)) {
                return t[1]
            }
        }
    }

    function starts_with(e) {
        return e && e.index === 0
    }

    function make_next_char_fun(t) {
        var i = [];
        [entity_re, emoji_re, combine_chr_re].forEach(function(e) {
            if (t.match(e)) {
                i.push(make_re_fn(e))
            }
        });
        if (t.match(astral_symbols_re)) {
            i.push(function(e) {
                var t = e.match(astral_symbols_re);
                if (starts_with(t)) {
                    var n = e.match(combine_chr_re);
                    if (n && n.index === 1) {
                        return e.slice(0, 3)
                    }
                    return t[1]
                }
            })
        }
        return function(e) {
            for (var t = 0; t < i.length; ++t) {
                var n = i[t];
                var r = n(e);
                if (r) {
                    return r
                }
            }
            return e[0]
        }
    }

    function get_next_character(e) {
        var t = e.match(entity_re);
        if (starts_with(t)) {
            return t[1]
        }
        var n = e.match(combine_chr_re);
        if (starts_with(n)) {
            return n[1]
        }
        var r = e.match(emoji_re);
        if (starts_with(r)) {
            return r[1]
        } else if (e.charCodeAt(0) < 255) {
            return e[0]
        } else {
            var i = e.match(astral_symbols_re);
            if (starts_with(i)) {
                n = e.match(combine_chr_re);
                if (n && n.index === 1) {
                    return e.slice(0, 3)
                }
                return e.slice(0, 2)
            } else {
                return e[0]
            }
        }
    }

    function normalize_position(e, r) {
        if (r === 0) {
            return r
        }
        e = $.terminal.strip(e);
        var t = $.terminal.split_characters(e).reduce(function(e, t) {
            if (typeof e === "number") {
                return e
            }
            var n = e.length + char_len(t);
            if (n >= r) {
                return e.position + 1
            }
            return {
                position: e.position + 1,
                length: n
            }
        }, {
            position: 0,
            length: 0
        });
        if (typeof t === "number") {
            return t
        } else {
            return t.position
        }
    }

    function char_width_prop(e, t) {
        if (e === 0) {
            return "width: 1px"
        } else if (is_ch_unit_supported) {
            return "width: " + e + "ch"
        } else if (!is_css_variables_supported) {
            if (t.charWidth) {
                return "width: " + t.charWidth * e + "px"
            }
        } else {
            return "--length: " + e
        }
        return ""
    }

    function extra_css(e, t) {
        if (typeof wcwidth !== "undefined") {
            var n = bare_text(e);
            var r = strlen(n);
            if (r > 1 && r !== $.terminal.length(n)) {
                return char_width_prop(r, t)
            }
        }
        return ""
    }

    function wide_characters(e, n) {
        if (typeof wcwidth !== "undefined") {
            var t = bare_text(e);
            var r = $.terminal.split_characters(t);
            if (r.length === 1) {
                return e
            }
            var i = r.map(function(e) {
                return {
                    len: strlen(e),
                    chr: e
                }
            }).reduce(function(e, t) {
                var n = e[e.length - 1];
                if (n) {
                    if (n.len !== t.len) {
                        return e.concat([{
                            sum: t.len,
                            len: t.len,
                            specs: [t]
                        }])
                    } else {
                        e.pop();
                        return e.concat([{
                            sum: n.sum + t.len,
                            len: n.len,
                            specs: n.specs.concat(t)
                        }])
                    }
                }
                return [{
                    sum: t.len,
                    specs: [t],
                    len: t.len
                }]
            }, []);
            return i.map(function(e) {
                if (e.len === 1) {
                    return u(e)
                }
                var t = char_width_prop(e.sum, n);
                if (e.sum === r.length || !t.length) {
                    return "<span>" + u(e) + "</span>"
                } else if (e.specs.length > 1) {
                    return a(t, e.specs.map(function(e) {
                        return a(char_width_prop(e.len), e.chr)
                    }).join(""))
                } else {
                    return a(t, u(e))
                }
            }).join("")
        }

        function u(e) {
            return e.specs.map(function(e) {
                return e.chr
            }).join("")
        }

        function a(e, t) {
            return '<span style="' + e + '">' + t + "</span>"
        }
        return e
    }

    function binary_search(e, t, n, r, i) {
        var u = t - e;
        var a = e + Math.floor(u / 2);
        var o = [n, a].concat(i);
        var s = r.apply(null, o);
        if (s === 0) {
            return a
        } else if (s > 0 && u > 1) {
            return binary_search(a, t, n, r, i)
        } else if (s < 0 && u > 1) {
            return binary_search(e, a, n, r, i)
        } else {
            return -1
        }
    }

    function is_terminal_selected(e) {
        if (is_function(window.getSelection)) {
            var t = window.getSelection();
            if (t.toString()) {
                var n = t.getRangeAt(0).startContainer.parentNode;
                var r = $(n).closest(".terminal");
                return r.length && (e && r.find(".cmd").is(e) || !e)
            }
        }
    }

    function get_selected_html() {
        var e = "";
        if (is_function(window.getSelection)) {
            var t = window.getSelection();
            if (t.rangeCount) {
                var n = document.createElement("div");
                for (var r = 0, i = t.rangeCount; r < i; ++r) {
                    n.appendChild(t.getRangeAt(r).cloneContents())
                }
                e = n.innerHTML
            }
        }
        return e
    }

    function with_selection(e) {
        var t = "";
        var n = [];
        if (is_function(window.getSelection)) {
            var r = window.getSelection();
            if (r.rangeCount) {
                var i = document.createElement("div");
                for (var u = 0, a = r.rangeCount; u < a; ++u) {
                    var o = r.getRangeAt(u).cloneRange();
                    n.push(o);
                    i.appendChild(o.cloneContents())
                }
                t = i.innerHTML
            }
        }
        e(t);
        if (n.length) {
            r.removeAllRanges();
            n.forEach(function(e) {
                r.addRange(e)
            })
        }
        return t !== ""
    }

    function process_selected_line() {
        var e = $(this);
        var t = e.text();
        if (e.hasClass("cmd-end-line")) {
            t += "\n"
        }
        return t
    }

    function process_div(e) {
        return $(e).find("> div, > span").map(process_selected_line).get().join("\n").replace(/\n$/, "")
    }

    function process_selected_html(e) {
        var t;
        var n = "";
        var r = $("<div>" + e + "</div>");
        if (e.match(/<\/div>/)) {
            t = r.find("div[data-index]").map(function() {
                return process_div(this)
            }).get().join("\n");
            if (!t && e.match(/style="width: 100%;?"/)) {
                t = process_div(r)
            }
            n = t
        }
        var i = r.find(".cmd-prompt");
        if (i.length) {
            if (n.length) {
                n += "\n"
            }
            n += i.text()
        }
        var u = r.find('[role="presentation"]');
        if (u.length) {
            n += u.map(process_selected_line).get().join("")
        }
        if (!n.length && e) {
            n = r.text()
        }
        return n.replace(/\xA0/g, " ")
    }
    var support_copy = function() {
        if (typeof document === "undefined") {
            return false
        }
        if (!is_function(document.queryCommandSupported)) {
            return false
        }
        return document.queryCommandSupported("copy")
    }();
    var text_to_clipboard;
    if (support_copy) {
        text_to_clipboard = function e(t, n) {
            var r = t.val();
            var i = t.is(":focus");
            var u = t.caret();
            if (window.navigator && window.navigator.clipboard) {
                navigator.clipboard.writeText(n)
            } else if (i) {
                t.val(n).focus();
                t[0].select();
                document.execCommand("copy");
                t.val(r);
                t.caret(u)
            } else {
                var a = $("<textarea/>").css({
                    position: "fixed",
                    top: 0,
                    left: 0
                }).appendTo("body");
                a.val(n).focus();
                a[0].select();
                document.execCommand("copy");
                a.blur();
                a.remove()
            }
            return true
        }
    } else {
        text_to_clipboard = $.noop
    }
    var get_textarea_selection = function() {
        function e() {
            return ""
        }
        if (typeof document === "undefined") {
            return e
        }
        var t = document.createElement("textarea");
        var n = "selectionStart" in t;
        t = null;
        if (n) {
            return function(e) {
                var t = e.selectionEnd - e.selectionStart;
                return e.value.substr(e.selectionStart, t)
            }
        } else if (document.selection) {
            return function() {
                var e = document.selection.createRange();
                return e.text()
            }
        } else {
            return e
        }
    }();

    function clear_textarea_selection(e) {
        e.selectionStart = e.selectionEnd = 0
    }

    function common_string(e, t, n) {
        if (!t.length) {
            return ""
        }
        var r = string_case(e);
        var i = [];
        for (var u = e.length; u < t[0].length; ++u) {
            var a = false;
            var o = t[0].charAt(u),
                s = o.toLowerCase();
            for (var l = 1; l < t.length; ++l) {
                a = true;
                var f = t[l].charAt(u),
                    c = f.toLowerCase();
                if (o !== f) {
                    if (n || r === "mixed") {
                        a = false;
                        break
                    } else if (s === c) {
                        if (r === "lower") {
                            o = o.toLowerCase()
                        } else if (r === "upper") {
                            o = o.toUpperCase()
                        } else {
                            a = false;
                            break
                        }
                    } else {
                        a = false;
                        break
                    }
                }
            }
            if (a) {
                i.push(o)
            } else {
                break
            }
        }
        return e + i.join("")
    }

    function trigger_terminal_change(t) {
        terminals.forEach(function(e) {
            e.settings().onTerminalChange.call(e, t)
        })
    }
    var select = function() {
        if (root.getSelection) {
            var e = root.getSelection();
            if (e.setBaseAndExtent) {
                return function(e, t) {
                    var n = root.getSelection();
                    n.setBaseAndExtent(e, 0, t, 1)
                }
            } else {
                return function(e, t) {
                    var n = root.getSelection();
                    var r = document.createRange();
                    r.setStart(e, 0);
                    r.setEnd(t, t.childNodes.length);
                    n.removeAllRanges();
                    n.addRange(r)
                }
            }
        } else {
            return $.noop
        }
    }();

    function process_command(e, t) {
        var n = e.trim();
        var r = n.match(command_re) || [];
        if (r.length) {
            var i = r.shift();
            var u = $.map(r, function(e) {
                if (e.match(/^["']/)) {
                    e = e.replace(/\n/g, "\\u0000\\u0000\\u0000\\u0000");
                    e = t(e);
                    return e.replace(/\x00\x00\x00\x00/g, "\n")
                }
                return t(e)
            });
            var a = $.map(r, function(e) {
                var t = e.match(/^(['"`]).*\1$/);
                return t && t[1] || ""
            });
            var o = n.slice(i.length).trim();
            return {
                command: e,
                name: i,
                args: u,
                args_quotes: a,
                rest: o
            }
        } else {
            return {
                command: e,
                name: "",
                args: [],
                args_quotes: [],
                rest: ""
            }
        }
    }
    $.terminal = {
        version: "2.32.1",
        date: "Wed, 09 Mar 2022 08:28:58 +0000",
        color_names: ["transparent", "currentcolor", "black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen", "rebeccapurple"],
        Cycle: Cycle,
        History: History,
        Stack: Stack,
        valid_color: function e(t) {
            if (t.match(color_re)) {
                return true
            } else {
                return $.inArray(t.toLowerCase(), $.terminal.color_names) !== -1
            }
        },
        unclosed_strings: function e(t) {
            return !!t.match(unclosed_strings_re)
        },
        escape_regex: function e(t) {
            if (typeof t === "string") {
                var n = /([-\\^$[\]()+{}?*.|])/g;
                return t.replace(n, "\\$1")
            }
        },
        have_formatting: function e(t) {
            return typeof t === "string" && !!t.match(format_exist_re)
        },
        is_formatting: function e(t) {
            return typeof t === "string" && !!t.match(format_full_re)
        },
        is_extended_command: function e(t) {
            return typeof t === "string" && t.match(format_exec_re) && !$.terminal.is_formatting(t)
        },
        each_extended_command: function(e, n) {
            var t = e.split(format_exec_split_re);
            return $.map(t, function(e) {
                if ($.terminal.is_extended_command(e)) {
                    var t = e.replace(/^\[\[|\]\]$/g, "");
                    return n(t) || ""
                }
                return e
            }).join("")
        },
        format_split: function e(t) {
            return t.split(format_split_re).filter(Boolean)
        },
        tracking_replace: function e(t, n, r, i) {
            if (!(n instanceof RegExp)) {
                throw new Error("tracking_replace: Second argument need to be RegExp")
            }

            function u(e, t, n) {
                return e.slice(t, n)
            }

            function a(e) {
                return $.terminal.strip(e).length
            }
            var o = "";
            var s;
            var l = 0;
            var f;
            var c = i;
            var p;
            n.lastIndex = 0;
            while (s = n.exec(t)) {
                if (n.global) {
                    var D = a(u(t, 0, n.lastIndex));
                    p = D - a(s[0])
                } else {
                    p = s.index;
                    D = p + a(s[0])
                }
                if (l < p) {
                    o += u(t, l, p)
                }
                l = D;
                if (typeof r === "function") {
                    f = r.apply(null, s)
                } else {
                    f = r.replace(/\$(\$|\d)/g, function(e, t) {
                        if (t === "$") {
                            return "$"
                        }
                        return s[t]
                    })
                }
                o += f;
                if (p < i) {
                    var m = a(f);
                    m += count_selfclosing_formatting(f);
                    if (D < i) {
                        c = Math.max(0, c + m - a(s[0]))
                    } else {
                        c += m - (i - p)
                    }
                }
                if (!n.global) {
                    break
                }
            }
            if (l < a(t)) {
                o += u(t, l)
            }
            if (t === o) {
                return [t, i]
            }
            return [o, c]
        },
        iterate_formatting: function e(t, n) {
            function r(e) {
                return t.slice(e - 6, e) === "&nbsp;" || t.slice(e - 1, e).match(/\s/)
            }

            function i(e) {
                return t.slice(e).match(entity_re)
            }

            function u(e) {
                return t[e] === "[" && t[e + 1] === "["
            }

            function a(e) {
                return t[e - 1] !== "\\" && t[e] === "\\" && t[e + 1] === "]"
            }

            function o(e) {
                return x && (t[e] !== "]" || !D) && !k
            }
            var s = make_next_char_fun(t);

            function l() {
                var e = s(E);
                if (e.length > 1 && $.terminal.length(E) > 1) {
                    return e.length - 1
                }
                return 0
            }

            function f() {
                return r(w) && (x || k) && (g === -1 && y !== w || g !== -1)
            }
            var c = false;

            function p() {
                if (w === t.length - 1 && !c) {
                    c = true
                } else {
                    c = m && !!E.match(/^.]$/)
                }
                return c
            }
            var D = $.terminal.have_formatting(t);
            var m = "";
            var d = false;
            var h = 0;
            var v;
            var g = -1;
            var _ = -1;
            var y;
            var b = 0;
            var C = 0;
            var F = /(&[^;]+);$/;
            for (var w = 0; w < t.length; w++) {
                var E = t.slice(w);
                v = E.match(format_start_re);
                if (v) {
                    m = v[1];
                    d = false
                } else if (m) {
                    if (t[w] === "]") {
                        if (d) {
                            m = "";
                            d = false
                        } else {
                            d = true
                        }
                    }
                } else {
                    d = true
                }
                var x = m && d || !m;
                var k = u(w);
                if (f()) {
                    g = w;
                    _ = h
                }
                var A = t[w].match(/[[\]]/);
                C = 0;
                if (x) {
                    if (t[w] === "&") {
                        v = i(w);
                        if (v) {
                            w += v[1].length - 2;
                            continue
                        }++h;
                        ++b
                    } else if (a(w)) {
                        ++h;
                        ++b;
                        C = 1;
                        w += 1
                    } else if (!A || !D) {
                        ++h;
                        ++b
                    }
                }
                if (o(w)) {
                    if (strlen(t[w]) === 2) {
                        b++
                    }
                    var B = s(E);
                    var T = B.length;
                    if (B === ";") {
                        v = t.slice(0, w + 1).match(F);
                        if (v) {
                            C = v[1].length;
                            T = C + 1
                        }
                    }
                    var S = {
                        last: p(),
                        count: h,
                        index: w - C,
                        formatting: m,
                        length: b,
                        text: d,
                        size: T,
                        space: g,
                        space_count: _
                    };
                    var R = n(S);
                    if (R === false) {
                        break
                    } else if (R) {
                        if (R.count !== undefined) {
                            h = R.count
                        }
                        if (R.length !== undefined) {
                            b = R.length
                        }
                        if (R.space !== undefined) {
                            y = g;
                            g = R.space
                        }
                        if (R.index !== undefined) {
                            w = R.index;
                            continue
                        }
                    }
                } else if (w === t.length - 1 && !c) {
                    n({
                        last: true,
                        count: h + 1,
                        index: w,
                        formatting: m,
                        length: 0,
                        text: d,
                        space: g
                    })
                }
                if (d) {
                    w += l()
                }
            }
        },
        partition: function e(n) {
            if (!$.terminal.have_formatting(n)) {
                var t = $.terminal.split_characters(n);
                return t.map(i)
            }
            var r = [];

            function i(e) {
                if (e.match(/\\$/)) {
                    e += "\\"
                }
                return "[[;;]" + e + "]"
            }

            function u(e) {
                if ($.terminal.is_formatting(e)) {
                    if (e.match(/\\]$/)) {
                        e = e.replace(/\\]/g, "\\\\]")
                    }
                } else {
                    e = i(e)
                }
                return e
            }
            $.terminal.iterate_formatting(n, function(e) {
                if (e.text) {
                    var t = [];
                    if (e.formatting) {
                        t.push(e.formatting)
                    }
                    t.push(n.substring(e.index, e.index + e.size));
                    if (e.formatting) {
                        t.push("]")
                    }
                    r.push(u(t.join("")))
                }
            });
            return r
        },
        substring: function e(t, n, r) {
            var i = $.terminal.split_characters(t);
            if (!i.slice(n, r).length) {
                return ""
            }
            if (!$.terminal.have_formatting(t)) {
                return i.slice(n, r).join("")
            }
            var u = 0;
            var a;
            var o = "";
            var s = "";
            var l;
            var f = 1;
            $.terminal.iterate_formatting(t, function(e) {
                if (n && e.count === n + 1) {
                    u = e.index;
                    if (e.formatting) {
                        o = e.formatting
                    }
                }
                if (r && e.count === r) {
                    s = e.formatting;
                    l = e.index;
                    f = e.size
                }
                if (e.count === r + 1) {
                    a = e.index;
                    if (e.formatting) {
                        a = l + f
                    }
                }
            });
            if (n && !u) {
                return ""
            }
            if (a === undefined) {
                a = t.length
            }
            t = o + t.slice(u, a);
            if (s) {
                t = t.replace(/(\[\[^\]]+)?\]$/, "");
                t += "]"
            }
            return t
        },
        normalize: function e(t) {
            t = t.replace(format_re, function(e, t, n) {
                if (t.match(self_closing_re) && n === "") {
                    return "[[" + t + "] ]"
                }
                if (n === "") {
                    return ""
                }

                function r(e) {
                    return e.replace(/\\\]/g, "&#93;").replace(/\n/g, "\\n").replace(/&nbsp;/g, " ")
                }
                t = r(t);
                var i = t.match(/;/g).length;
                if (i >= 4) {
                    var u = t.split(/;/);
                    var a = u.slice(0, 4).join(";");
                    var o = u.slice(4).join(";");
                    return "[[" + a + ";" + (o || n) + "]" + n + "]"
                } else if (i === 2) {
                    i = ";;"
                } else if (i === 3) {
                    i = ";"
                }
                t += i + r(n);
                return "[[" + t + "]" + n + "]"
            });
            return $.terminal.amp(t)
        },
        split_equal: function e(t, c, p) {
            var D = "";
            var m = [];
            var n = $.terminal.normalize(t).split(/\n/g);
            for (var r = 0, i = n.length; r < i; ++r) {
                if (n[r] === "") {
                    m.push("");
                    continue
                }
                var d = n[r];
                var h = make_next_char_fun(d);
                var v = 0;
                var g;
                var _ = d.length;
                var y = !!d.match(/\[\[[^\]]+\](?:[^\][]|\\\])+\]$/);
                var b = !!d.match(/^(&nbsp;|\s)/);
                $.terminal.iterate_formatting(d, function(e) {
                    var t, n;
                    if (e.length >= c || e.last || e.length === c - 1 && strlen(d[e.index + 1]) === 2) {
                        var r = false;
                        if (p && e.space !== -1) {
                            var i = text(d).substring(e.space_count);
                            i = i.slice(0, c).replace(/\s+$/, "");
                            var u = strlen(i);
                            if (i.match(/\s/) || u < c) {
                                r = true
                            }
                        }
                        var a = e.index + e.size;
                        if (y) {
                            a += 1
                        }
                        var o;
                        if (p && e.space !== -1 && a !== _ && r) {
                            g = d.slice(v, e.space);
                            o = e.space - 1
                        } else {
                            n = d.slice(e.index);
                            t = h(n);
                            g = d.slice(v, e.index) + t;
                            if (e.last && y && t !== "]") {
                                g += "]"
                            }
                            o = e.index + t.length - 1
                        }
                        if (p) {
                            g = g.replace(/(&nbsp;|\s)+$/g, "");
                            if (!b) {
                                g = g.replace(/^(&nbsp;|\s)+/g, "")
                            }
                        }
                        v = (o || e.index) + 1;
                        if (D) {
                            var s = g.match(/^[^\]]*\]/);
                            g = D + g;
                            if (s) {
                                D = ""
                            }
                        }
                        var l = g.match(format_re);
                        if (l) {
                            var f = l[l.length - 1];
                            if (f[f.length - 1] !== "]") {
                                D = f.match(format_begin_re)[1];
                                g += "]"
                            } else if (g.match(format_end_re)) {
                                g = g.replace(format_end_re, "");
                                D = f.match(format_begin_re)[1]
                            }
                        }
                        m.push(g);
                        return {
                            index: o,
                            length: 0,
                            space: -1
                        }
                    }
                })
            }
            return m
        },
        amp: function e(t) {
            return t.replace(/&(?!#[0-9]+;|#x[0-9a-f]+;|[a-z]+;)/gi, "&amp;")
        },
        encode: function e(t, n) {
            var s = $.extend({
                tabs: 4,
                before: ""
            }, n);
            return $.terminal.amp(t).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").split("\n").map(function(e) {
                var o = e.split(/((?:\[\[[^\]]+\])?\t(?:\])?)/);
                o = o.filter(Boolean);
                return o.map(function(e, a) {
                    if (e.match(/\t/)) {
                        return e.replace(/\t([^\t]*)$/, function(e, t) {
                            if (a !== 0 && o[a - 1].match(/\t\]?$/)) {
                                var n = new Array(s.tabs + 1).join("&nbsp;");
                                return n + t
                            } else {
                                var r = o.slice(a - 1, a).join("");
                                if (s.before && a <= 1) {
                                    r = s.before + r
                                }
                                var i = $.terminal.length(r);
                                var u = s.tabs - i % s.tabs;
                                if (u === 0) {
                                    u = 4
                                }
                                return new Array(u + 1).join("&nbsp;") + t
                            }
                        })
                    }
                    return e
                }).join("")
            }).join("\n")
        },
        nested_formatting: function e(t) {
            if (!$.terminal.have_formatting(t)) {
                return t
            }
            var u = [];
            var n = /((?:\[\[(?:[^\][]|\\\])+\])?(?:[^\][]|\\\])*\]?)/;
            var a = /\[\[([^\][]+)\][\s\S]*/;
            var o = /^\[\[([^;]*);([^;]*);([^\]]*)\]/;
            var f = 3;
            var c = 5;

            function r(e, t, n) {
                return n.indexOf(e) === t
            }

            function p(e, t) {
                e = i(e);
                if (!t) {
                    return e
                }
                return $.extend(t, e)
            }

            function i(e) {
                var i = {};
                e.split(/\s*;\s*/).forEach(function(e) {
                    var t = e.split(":").map(function(e) {
                        return e.trim()
                    });
                    var n = t[0];
                    var r = t[1];
                    i[n] = r
                });
                return i
            }

            function D(e) {
                var t = e.slice();
                if (e[c]) {
                    t[c] = l(e[c])
                }
                if (e[f]) {
                    t[f] = m(e[f])
                }
                t[0] = s(e[0]);
                return t.join(";")
            }

            function s(e) {
                var t = e.filter(function(e) {
                    return e[0] === "-"
                }).map(function(e) {
                    return e[1]
                });
                return e.filter(function(e) {
                    return t.indexOf(e) === -1 && t.indexOf(e[1]) === -1
                }).join("")
            }

            function l(e) {
                return JSON.stringify(e, function(e, t) {
                    if (e === "style") {
                        return d(t)
                    }
                    return t
                })
            }

            function m(e) {
                return e.filter(r).join(" ")
            }

            function d(t) {
                return Object.keys(t).map(function(e) {
                    return e + ":" + t[e]
                }).join(";")
            }

            function h(e) {
                function t(t) {
                    if (!i[c]) {
                        i[c] = {}
                    }
                    try {
                        var e = JSON.parse(t);
                        if (e.style) {
                            var n = e.style;
                            var r = i[c].style;
                            e.style = p(n, r);
                            i[c] = $.extend(e, i[c], {
                                style: p(n, r)
                            })
                        } else {
                            i[c] = $.extend(e, i[c])
                        }
                    } catch (e) {
                        warn("Invalid JSON " + t)
                    }
                }
                var i = [
                    [], "", ""
                ];
                if (!e.length) {
                    return i
                }
                for (var n = e.length; n--;) {
                    var r = $.terminal.parse_formatting(e[n]);
                    if (r.length > 5) {
                        var u = r.slice(5).join(";");
                        r = r.slice(0, 5).concat(u)
                    }
                    var a = r[0].split(/(-?[@!gbiuso])/g).filter(Boolean);
                    a.forEach(function(e) {
                        if (i[0].indexOf(e) === -1) {
                            i[0].push(e)
                        }
                    });
                    for (var o = 1; o < r.length; ++o) {
                        var s = r[o].trim();
                        if (s) {
                            if (o === f) {
                                if (!i[f]) {
                                    i[f] = []
                                }
                                var l = s.split(/\s+/);
                                i[f] = i[f].concat(l)
                            } else if (o === c) {
                                t(s)
                            } else if (!i[o]) {
                                i[o] = s
                            }
                        }
                    }
                }
                return D(i)
            }
            return t.split(n).filter(Boolean).map(function(e) {
                var t;
                if (e.match(/^\[\[/) && !$.terminal.is_extended_command(e)) {
                    var n = e.replace(a, "$1");
                    var r = $.terminal.is_formatting(e);
                    e = e.replace(o, "");
                    u.push(n);
                    if ($.terminal.nested_formatting.__inherit__) {
                        t = h(u)
                    } else {
                        t = n
                    }
                    if (!r) {
                        e += "]"
                    } else {
                        u.pop()
                    }
                    e = "[[" + t + "]" + e
                } else {
                    var i = false;
                    if (e.match(/\]/)) {
                        i = true
                    }
                    if (u.length) {
                        if ($.terminal.nested_formatting.__inherit__) {
                            t = h(u)
                        } else {
                            t = u[u.length - 1]
                        }
                        e = "[[" + t + "]" + e
                    }
                    if (i) {
                        u.pop()
                    } else if (u.length) {
                        e += "]"
                    }
                }
                return e
            }).join("")
        },
        escape_formatting: function e(t) {
            return $.terminal.escape_brackets(t)
        },
        apply_formatters: function e(t, u) {
            if (t === "") {
                if (u && typeof u.position === "number") {
                    return ["", u.position]
                } else {
                    return ""
                }
            }

            function i(e, t, n, r) {
                if (!e.__no_warn__ && $.terminal.length(n) !== $.terminal.length(r)) {
                    warn("Your formatter[" + t + "] change length of the string, " + "you should use [regex, replacement] formatter or function " + " that return [replacement, position] instead")
                }
            }

            function p(t) {
                if (!u || !t) {
                    return true
                }
                var e = ["echo", "command", "prompt"];
                var n = e.some(function(e) {
                    return t[e] === true
                });
                if (!n) {
                    return true
                }
                for (var r = e.length; r--;) {
                    var i = e[r];
                    if (t[i] === true && u[i] === true) {
                        return true
                    }
                }
                return false
            }
            u = u || {};
            var n = u.formatters || $.terminal.defaults.formatters;
            var D = 0;

            function m(e, t) {
                var n = $.extend({}, u, {
                    position: t[1]
                });
                var r = e(t[0], n);
                if (typeof r === "string") {
                    i(e, D - 1, r, t[0]);
                    if (typeof r === "string") {
                        return [r, n.position]
                    }
                    return t
                } else if (is_array(r) && r.length === 2) {
                    return r
                } else {
                    return t
                }
            }
            var r;
            if (typeof u.position === "number") {
                r = [t, u.position]
            } else {
                r = [t, 0]
            }
            try {
                var a = n.reduce(function(o, s) {
                    D++;
                    if (typeof s === "function" && s.__meta__) {
                        return m(s, o)
                    } else {
                        var l = 0;
                        var f = false;
                        var e = $.terminal.format_split(o[0]);
                        var t = e.map(function(e) {
                            var t;
                            var n = text(e).length;
                            if (o[1] < l + n && !f) {
                                t = o[1] - l;
                                f = true
                            } else if (f) {
                                t = -1
                            } else {
                                t = o[1]
                            }
                            var r = l;
                            var i;
                            l += n;
                            if ($.terminal.is_formatting(e)) {
                                if (f) {
                                    return [e, t]
                                }
                                return [e, -1]
                            } else {
                                if (is_array(s)) {
                                    var u = s[2] || {};
                                    i = [e, t < 0 ? 0 : t];
                                    if (i[0].match(s[0]) && p(s[2])) {
                                        if (u.loop) {
                                            while (i[0].match(s[0])) {
                                                i = $.terminal.tracking_replace(i[0], s[0], s[1], i[1])
                                            }
                                        } else {
                                            i = $.terminal.tracking_replace(i[0], s[0], s[1], i[1])
                                        }
                                    }
                                    if (t < 0) {
                                        return [i[0], -1]
                                    }
                                } else if (typeof s === "function") {
                                    i = m(s, [e, t])
                                }
                                if (typeof i !== "undefined") {
                                    if (i[1] !== -1) {
                                        i[1] += r
                                    }
                                    var a = text(i[0]).length;
                                    if (a !== n) {}
                                    return i
                                }
                                return [e, -1]
                            }
                        });
                        var n = t.filter(function(e) {
                            return e[1] !== -1
                        })[0];
                        var r = t.map(function(e) {
                            return e[0]
                        }).join("");
                        var i;
                        if (typeof n === "undefined") {
                            i = o[1]
                        } else {
                            i = n[1]
                        }
                        var u = text(r).length;
                        u += count_selfclosing_formatting(r);
                        if (i > u) {
                            i = u
                        }
                        if (r === o[0]) {
                            return o
                        }
                        var a = $.terminal.strip(o[0]);
                        var c = $.terminal.strip(r);
                        if (a === c) {
                            return [r, o[1]]
                        }
                        return [r, i]
                    }
                }, r);
                if (typeof u.position === "number") {
                    var o = $.terminal.strip(a[0]).length;
                    if ($.terminal.length(a[0]) < o) {
                        var s = a[1];
                        s = normalize_position(a[0], s);
                        var l = $.terminal.length(a[0]);
                        if (s > l) {
                            s = l
                        }
                        a[1] = s
                    }
                    return a
                } else {
                    return a[0]
                }
            } catch (e) {
                var f = "Error in formatter [" + (D - 1) + "]";
                n.splice(D - 1);
                throw new $.terminal.Exception("formatting", f, e.stack)
            }
        },
        format: function i(e, t) {
            var v = $.extend({}, {
                linksNoReferrer: false,
                linksNoFollow: false,
                allowedAttributes: [],
                charWidth: undefined,
                escape: true,
                anyLinks: false
            }, t || {});

            function r(e) {
                if (e.length && v.allowedAttributes.length) {
                    return e.filter(function(e) {
                        if (e === "data-text") {
                            return false
                        }
                        var t = false;
                        var n = v.allowedAttributes;
                        for (var r = 0; r < n.length; ++r) {
                            if (n[r] instanceof RegExp) {
                                if (n[r].test(e)) {
                                    t = true;
                                    break
                                }
                            } else if (n[r] === e) {
                                t = true;
                                break
                            }
                        }
                        return t
                    })
                }
                return []
            }

            function g(e, t) {
                if (e === "") {
                    return t
                } else {
                    return e.replace(/&#93;/g, "]").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")
                }
            }

            function _(n) {
                if (n) {
                    var e = r(Object.keys(n));
                    if (e.length) {
                        return " " + e.map(function(e) {
                            var t = n[e].replace(/"/g, "&quot;");
                            return e + '="' + t + '"'
                        }).join(" ")
                    }
                }
                return ""
            }

            function y() {
                var e = ["noopener"];
                if (v.linksNoReferrer) {
                    e.unshift("noreferrer")
                }
                if (v.linksNoFollow) {
                    e.unshift("nofollow")
                }
                return e
            }

            function n(e) {
                return e.match(/^\.{1,2}\//) || e.match(/^\//) || !(e.match(/\//) || e.match(/^[^:]+:/))
            }

            function u(n) {
                return function(e) {
                    if (v.anyLinks) {
                        return true
                    }
                    var t = n(e);
                    if (!t) {
                        warn("Invalid URL " + e + " only http(s) ftp and Path " + "are allowed")
                    }
                    return t
                }
            }
            var b = u(function(e) {
                return e.match(/^((https?|file|ftp):\/\/|\.{0,2}\/)/) || n(e)
            });
            var C = u(function(e) {
                return e.match(/^(https?:|file:|blob:|data:)/) || n(e)
            });

            function i(e, t, n, r, i, u, a) {
                function o(e) {
                    var t;
                    if (e.match(email_re)) {
                        t = '<a href="mailto:' + e + '"'
                    } else {
                        if (!b(e)) {
                            e = ""
                        }
                        t = '<a target="_blank"';
                        if (e) {
                            t += ' href="' + e + '"'
                        }
                        t += ' rel="' + y().join(" ") + '"'
                    }
                    return t
                }

                function s(e) {
                    var t = "<img";
                    if (C(e)) {
                        t += ' src="' + e + '"';
                        if (a) {
                            t += ' alt="' + a + '"'
                        }
                    }
                    return t
                }
                var l;
                if (u.match(/;/)) {
                    try {
                        var f = u.split(";");
                        var c = f.slice(1).join(";").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                        if (c.match(/^\s*\{[^}]*\}\s*$/)) {
                            l = JSON.parse(c);
                            u = f[0]
                        }
                    } catch (e) {}
                }
                if (a === "" && !t.match(/@/)) {
                    return ""
                }
                a = safe(a);
                a = a.replace(/\\\]/g, "&#93;");
                if (v.escape) {
                    a = a.replace(/\\\\/g, "\\")
                }
                var p = "";
                if (t.indexOf("b") !== -1) {
                    p += "font-weight:bold;"
                }
                var D = [];
                if (t.indexOf("u") !== -1) {
                    D.push("underline")
                }
                if (t.indexOf("s") !== -1) {
                    D.push("line-through")
                }
                if (t.indexOf("o") !== -1) {
                    D.push("overline")
                }
                if (D.length) {
                    p += "text-decoration:" + D.join(" ") + ";"
                }
                if (t.indexOf("i") !== -1) {
                    p += "font-style:italic;"
                }
                if ($.terminal.valid_color(n)) {
                    p += ["color:" + n, "--color:" + n, "--original-color:" + n].join(";") + ";";
                    if (t.indexOf("!") !== -1) {
                        p += "--link-color:" + n + ";"
                    }
                    if (t.indexOf("g") !== -1) {
                        p += "text-shadow:0 0 5px " + n + ";"
                    }
                }
                if ($.terminal.valid_color(r)) {
                    p += ["background-color:" + r, "--background:" + r].join(";") + ";"
                }
                var m = g(u, a);
                var d = extra_css(a, v);
                if (d) {
                    a = wide_characters(a, v);
                    p += d
                }
                var h;
                if (t.indexOf("!") !== -1) {
                    h = o(m)
                } else if (t.indexOf("@") !== -1) {
                    h = s(m)
                } else {
                    h = "<span"
                }
                if (l && l.style) {
                    l.style = p + l.style;
                    p = ""
                }
                h += _(l);
                if (p !== "") {
                    h += ' style="' + p + '"'
                }
                if (i !== "") {
                    h += ' class="' + i + '"'
                }
                if (t.indexOf("!") !== -1) {
                    h += " data-text>" + a + "</a>"
                } else if (t.indexOf("@") !== -1) {
                    h += " data-text/>"
                } else {
                    h += ' data-text="' + m + '">' + "<span>" + a + "</span></span>"
                }
                return h
            }
            if (typeof e === "string") {
                var a = $.terminal.format_split(e);
                e = $.map(a, function(e) {
                    if (e === "") {
                        return e
                    } else if ($.terminal.is_formatting(e)) {
                        e = e.replace(/\[\[[^\]]+\]/, function(e) {
                            return e.replace(/&nbsp;/g, " ")
                        });
                        return e.replace(format_parts_re, i)
                    } else {
                        e = safe(e);
                        e = e.replace(/\\\]/, "&#93;");
                        var t = g(e);
                        var n = extra_css(e, v);
                        var r;
                        if (n.length) {
                            e = wide_characters(e, v);
                            r = '<span style="' + n + '"'
                        } else {
                            r = "<span"
                        }
                        return r + ' data-text="' + t + '">' + e + "</span>"
                    }
                }).join("");
                return e.replace(/<span><br\s*\/?><\/span>/gi, "<br/>")
            } else {
                return ""
            }
        },
        escape_brackets: function e(t) {
            return t.replace(/\[/g, "&#91;").replace(/\]/g, "&#93;").replace(/\\/g, "&#92;")
        },
        unescape_brackets: function e(t) {
            return t.replace(/&#91;/g, "[").replace(/&#93;/g, "]").replace(/&#92;/g, "\\")
        },
        length: function(e, t) {
            if (!e) {
                return 0
            }
            return $.terminal.split_characters(t ? e : text(e)).length
        },
        split_characters: function e(t) {
            var n = [];
            var r = make_next_char_fun(t);
            while (t.length) {
                var i = r(t);
                t = t.slice(i.length);
                n.push(i)
            }
            return n
        },
        columns: function(e, t, n) {
            e = e.map(function(e) {
                if (typeof e !== "string") {
                    return String(e)
                }
                return e
            });
            var r = e.map(function(e) {
                return $.terminal.strip(e)
            });
            var i = r.map(function(e) {
                return strlen(e)
            });
            if (typeof n === "undefined") {
                n = 4
            }
            var u = Math.max.apply(null, i) + n;
            var a = Math.floor(t / u) - 1;
            if (a < 1) {
                return e.join("\n")
            }
            var o = [];
            for (var s = 0, l = e.length; s < l; s += a) {
                var f = e.slice(s, s + a);
                var c = f.pop();
                o.push(f.reduce(function(e, t) {
                    var n = $.terminal.strip(t);
                    var r = new Array(u - n.length + 1).join(" ");
                    e.push(t + r);
                    return e
                }, []).join("") + c)
            }
            return o.join("\n")
        },
        strip: function e(t) {
            if (!$.terminal.have_formatting(t)) {
                return t
            }
            return $.terminal.format_split(t).map(function(e) {
                if ($.terminal.is_formatting(e)) {
                    e = e.replace(format_parts_re, "$6");
                    return e.replace(/\\([[\]])/g, function(e, t) {
                        return t
                    })
                }
                return e
            }).join("")
        },
        active: function e() {
            return terminals.front()
        },
        last_id: function e() {
            var t = terminals.length();
            return t - 1
        },
        parse_argument: function e(t, n) {
            function r(e) {
                return e.split(string_re).map(function(e) {
                    if (e.match(/^['"`]/)) {
                        if (e === '""' || e === "''" || e === "``") {
                            return ""
                        }
                        var t = e[0];
                        var n = new RegExp("(\\\\\\\\(?:\\\\\\\\)*)" + t, "g");
                        e = e.replace(n, "$1").replace(/^[`'"]|[`'"]$/g, "");
                        if (t === "'") {
                            e = e.replace(/"/g, '\\"')
                        }
                    }
                    e = '"' + e + '"';
                    return JSON.parse(e)
                }).join("")
            }
            if (n === false) {
                if (t[0] === "'" && t[t.length - 1] === "'") {
                    return t.replace(/^'|'$/g, "")
                } else if (t[0] === "`" && t[t.length - 1] === "`") {
                    return t.replace(/^`|`$/g, "")
                } else if (t[0] === '"' && t[t.length - 1] === '"') {
                    return t.replace(/^"|"$/g, "").replace(/\\([" ])/g, "$1")
                } else if (t.match(/\/.*\/[gimy]*$/)) {
                    return t
                } else if (t.match(/['"`]]/)) {
                    return r(t)
                } else {
                    return t.replace(/\\ /g, " ")
                }
            }
            if (t === "true") {
                return true
            } else if (t === "false") {
                return false
            }
            var i = t.match(re_re);
            if (i) {
                return new RegExp(i[1], i[2])
            } else if (t.match(/['"`]/)) {
                return r(t)
            } else if (t.match(/^-?[0-9]+$/)) {
                return parseInt(t, 10)
            } else if (t.match(float_re)) {
                return parseFloat(t)
            } else {
                return t.replace(/\\(['"() ])/g, "$1")
            }
        },
        parse_arguments: function e(t) {
            return $.map(t.match(command_re) || [], $.terminal.parse_argument)
        },
        split_arguments: function e(t) {
            return $.map(t.match(command_re) || [], function(e) {
                return $.terminal.parse_argument(e, false)
            })
        },
        parse_command: function e(t) {
            return process_command(t, $.terminal.parse_argument)
        },
        split_command: function e(t) {
            return process_command(t, function(e) {
                return $.terminal.parse_argument(e, false)
            })
        },
        parse_options: function e(t, n) {
            var a = $.extend({}, {
                boolean: []
            }, n);
            if (typeof t === "string") {
                return e($.terminal.split_arguments(t), n)
            }
            var o = {
                _: []
            };

            function s(e) {
                this.value = e
            }
            var r = t.reduce(function(e, t) {
                var n = typeof t === "string" ? t : "";
                if (n.match(/^--?[^-]/) && e instanceof s) {
                    o[e.value] = true
                }
                if (n.match(/^--[^-]/)) {
                    var r = n.replace(/^--/, "");
                    if (a.boolean.indexOf(r) === -1) {
                        return new s(r)
                    } else {
                        o[r] = true
                    }
                } else if (n.match(/^-[^-]/)) {
                    var i = n.replace(/^-/, "").split("");
                    if (a.boolean.indexOf(i.slice(-1)[0]) === -1) {
                        var u = i.pop()
                    }
                    i.forEach(function(e) {
                        o[e] = true
                    });
                    if (u) {
                        return new s(u)
                    }
                } else if (e instanceof s) {
                    o[e.value] = t
                } else if (t) {
                    o._.push(t)
                }
                return null
            }, null);
            if (r instanceof s) {
                o[r.value] = true
            }
            return o
        },
        parse_formatting: function(e) {
            var t = $.terminal.unescape_brackets(e).split(";");
            var n = 4;
            if (t.length >= 5) {
                var r = $.terminal.escape_brackets(t[n]);
                t[n] = r
            }
            return t
        },
        extended_command: function extended_command(term, string, options) {
            var settings = $.extend({
                invokeMethods: false
            }, options);
            var deferred = new $.Deferred;
            try {
                change_hash = false;
                var m = string.match(extended_command_re);
                if (m) {
                    if (!settings.invokeMethods) {
                        warn("To invoke terminal or cmd methods you need to enable " + "invokeMethods option");
                        deferred.reject()
                    } else {
                        string = m[1];
                        var obj = m[2] === "terminal" ? term : term.cmd();
                        var fn = m[3];
                        try {
                            var args = eval("[" + m[4] + "]");
                            if (!obj[fn]) {
                                term.error("Unknow function " + fn)
                            } else {
                                var ret = obj[fn].apply(term, args);
                                if (ret && ret.then) {
                                    return ret
                                }
                            }
                            deferred.resolve()
                        } catch (e) {
                            term.error("Invalid invocation in " + $.terminal.escape_brackets(string));
                            deferred.reject()
                        }
                    }
                } else {
                    return term.exec(string, true).done(function() {
                        change_hash = true
                    })
                }
            } catch (e) {
                deferred.reject()
            }
            return deferred.promise()
        },
        iterator: function(t) {
            function n(e) {
                if ($.terminal.is_formatting(e)) {
                    if (e.match(/\]\\\]/)) {
                        e = e.replace(/\]\\\]/g, "]\\\\]")
                    }
                }
                return e
            }
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                var r = $.terminal.length(t);
                var i = 0;
                var e = {};
                e[Symbol.iterator] = function() {
                    return {
                        next: function() {
                            if (i < r) {
                                var e = $.terminal.substring(t, i, i + 1);
                                i++;
                                return {
                                    value: n(e)
                                }
                            } else {
                                return {
                                    done: true
                                }
                            }
                        }
                    }
                };
                return e
            }
        },
        formatter: new function() {
            try {
                this[Symbol.split] = function(e) {
                    return $.terminal.format_split(e)
                };
                this[Symbol.match] = function(e) {
                    return e.match(format_re)
                };
                this[Symbol.replace] = function(e, t) {
                    return e.replace(format_parts_re, t)
                };
                this[Symbol.search] = function(e) {
                    return e.search(format_re)
                }
            } catch (e) {}
        },
        new_formatter: function(e) {
            var t = $.terminal.defaults.formatters;
            for (var n = 0; n < t.length; ++n) {
                if (t[n] === $.terminal.nested_formatting) {
                    t.splice(n, 0, e);
                    return
                }
            }
            t.push(e)
        }
    };
    $.terminal.Exception = function e(t, n, r) {
        if (arguments.length === 1) {
            this.message = arguments[0];
            this.type = "TERMINAL"
        } else {
            this.type = t;
            this.message = n;
            if (r) {
                this.stack = r
            }
        }
    };
    $.terminal.Exception.prototype = new Error;
    $.terminal.Exception.prototype.toString = function() {
        return this.message + "\n" + this.stack
    };
    $.fn.visible = function() {
        return this.css("visibility", "visible")
    };
    $.fn.hidden = function() {
        return this.css("visibility", "hidden")
    };
    var warnings = [];

    function warn(e) {
        e = "[jQuery Terminal] " + e;
        if (warnings.indexOf(e) === -1) {
            warnings.push(e);
            if (console) {
                if (console.warn) {
                    console.warn(e)
                } else if (console.log) {
                    console.log(e)
                }
            } else {
                setTimeout(function() {
                    throw new Error("WARN: " + e)
                }, 0)
            }
        }
    }
    var ids = {};
    $.jrpc = function(e, t, n, r, i) {
        var a = new $.Deferred;
        var o;
        if ($.isPlainObject(e)) {
            o = e
        } else {
            o = {
                url: e,
                method: t,
                params: n,
                success: r,
                error: i
            }
        }

        function s(e) {
            return $.isNumeric(e.id) && (typeof e.result !== "undefined" || typeof e.error !== "undefined")
        }
        ids[o.url] = ids[o.url] || 0;
        var u = {
            jsonrpc: "2.0",
            method: o.method,
            params: o.params,
            id: ++ids[o.url]
        };
        $.ajax({
            url: o.url,
            beforeSend: function e(t, n) {
                if (is_function(o.request)) {
                    o.request(t, u)
                }
                n.data = JSON.stringify(u)
            },
            success: function e(t, n, r) {
                var i = r.getResponseHeader("Content-Type");
                if (!i.match(/(application|text)\/json/)) {
                    warn("Response Content-Type is neither application/json" + " nor text/json")
                }
                var u;
                try {
                    u = JSON.parse(t)
                } catch (e) {
                    if (o.error) {
                        o.error(r, "Invalid JSON", e)
                    } else {
                        throw new $.terminal.Exception("JSON", "Invalid JSON", e.stack)
                    }
                    a.reject({
                        message: "Invalid JSON",
                        response: t
                    });
                    return
                }
                if (is_function(o.response)) {
                    o.response(r, u)
                }
                if (s(u) || o.method === "system.describe") {
                    if (o.success) {
                        o.success(u, n, r)
                    }
                    a.resolve(u)
                } else {
                    if (o.error) {
                        o.error(r, "Invalid JSON-RPC")
                    }
                    a.reject({
                        message: "Invalid JSON-RPC",
                        response: t
                    })
                }
            },
            error: o.error,
            contentType: "application/json",
            dataType: "text",
            async: true,
            cache: false,
            type: "POST"
        });
        return a.promise()
    };
    $.rpc = function(e, t, n) {
        var r = new $.Deferred;

        function i(e) {
            if (e.error) {
                r.reject(e.error)
            } else {
                r.resolve(e.result)
            }
        }

        function u(e, t, n) {
            r.reject({
                message: n
            })
        }
        $.jrpc(e, t, n, i, u);
        return r.promise()
    };

    function terminal_ready(e) {
        return !!(e.closest("body").length && e.is(":visible") && e.find(".cmd-prompt").length)
    }

    function get_char_size(e) {
        var t;
        if (terminal_ready(e)) {
            var n = e.find(".cmd-prompt").clone().css({
                visiblity: "hidden",
                position: "absolute"
            });
            n.appendTo(e.find(".cmd")).html("&nbsp;").wrap('<div class="cmd-wrapper"/>');
            t = n[0].getBoundingClientRect();
            n.parent().remove()
        } else {
            var r = $('<div class="terminal terminal-temp"><div class="terminal-' + 'wrapper"><div class="terminal-output"><div><div class="te' + 'rminal-line" style="float: left"><span>&nbsp;</span></div' + "></div></div></div>").appendTo("body");
            r.addClass(e.attr("class")).attr("id", e.attr("id"));
            if (e) {
                var i = e.attr("style");
                if (i) {
                    i = i.split(/\s*;\s*/).filter(function(e) {
                        return !e.match(/display\s*:\s*none/i)
                    }).join(";");
                    r.attr("style", i)
                }
            }
            t = r.find(".terminal-line")[0].getBoundingClientRect()
        }
        var u = {
            width: t.width,
            height: t.height
        };
        if (r) {
            r.remove()
        }
        return u
    }

    function get_num_chars(e, t) {
        var n = e.find(".terminal-fill").width();
        var r = Math.floor(n / t.width);
        return r || 1e3
    }

    function get_num_rows(e, t) {
        var n = e.find(".terminal-fill");
        var r = n.height();
        return Math.floor(r / t.height)
    }

    function all(e, t) {
        var n = e.filter(function(e) {
            return e[t]() === e
        });
        return n.length === e.length
    }

    function string_case(e) {
        var t = e.split("");
        if (all(t, "toLowerCase")) {
            return "lower"
        } else if (all(t, "toUpperCase")) {
            return "upper"
        } else {
            return "mixed"
        }
    }

    function same_case(e) {
        return string_case(e) !== "mixed"
    }

    function is_function(e) {
        return get_type(e) === "function"
    }

    function is_object(e) {
        return e && typeof e === "object"
    }

    function is_promise(e) {
        return is_object(e) && is_function(e.then || e.done)
    }

    function is_deferred(e) {
        return is_promise(e) && is_function(e.promise)
    }
    if (!Array.isArray) {
        Array.isArray = function(e) {
            return Object.prototype.toString.call(e) === "[object Array]"
        }
    }

    function is_array(e) {
        return Array.isArray(e)
    }

    function get_type(e) {
        if (typeof e === "function") {
            return "function"
        }
        if (e === null) {
            return e + ""
        }
        if (Array.isArray(e)) {
            return "array"
        }
        if (typeof e === "object") {
            return "object"
        }
        return typeof e
    }
    var version_set = !$.terminal.version.match(/^\{\{/);
    var copyright = "Copyright (c) 2022 Jakub T. Jankiewicz " + "<https://jcubic.pl/me>";
    var version_string = version_set ? " v. " + $.terminal.version : " ";
    var reg = new RegExp(" {" + version_string.length + "}$");
    var name_ver = "Terminal" + (version_set ? version_string : "");
    var signatures = []
    $.terminal.nested_formatting.__meta__ = true;
    $.terminal.nested_formatting.__inherit__ = true;
    $.terminal.nested_formatting.__no_warn__ = true;
    $.terminal.defaults = {
        prompt: "> ",
        history: true,
        exit: true,
        clear: true,
        enabled: true,
        maskChar: "*",
        wrap: true,
        checkArity: true,
        raw: false,
        tabindex: 1,
        invokeMethods: false,
        exceptionHandler: null,
        pauseEvents: true,
        softPause: false,
        mousewheel: null,
        touchscroll: null,
        memory: false,
        cancelableAjax: true,
        processArguments: true,
        execAnimation: false,
        execAnimationDelay: 100,
        linksNoReferrer: false,
        useCache: true,
        anyLinks: false,
        linksNoFollow: false,
        processRPCResponse: null,
        completionEscape: true,
        onCommandChange: null,
        mobileDelete: is_mobile,
        onPositionChange: null,
        convertLinks: true,
        extra: {},
        tabs: 4,
        historySize: 60,
        scrollObject: null,
        historyState: false,
        importHistory: false,
        historyFilter: null,
        echoCommand: true,
        scrollOnEcho: true,
        login: null,
        outputLimit: -1,
        formatters: [$.terminal.nested_formatting],
        unixFormatting: {
            escapeBrackets: false,
            ansiParser: {},
            ansiArt: false
        },
        onAjaxError: null,
        pasteImage: true,
        scrollBottomOffset: 20,
        wordAutocomplete: true,
        caseSensitiveAutocomplete: true,
        caseSensitiveSearch: true,
        clickTimeout: 200,
        holdTimeout: 400,
        holdRepeatTimeout: 200,
        repeatTimeoutKeys: [],
        mobileIngoreAutoSpace: [],
        request: $.noop,
        response: $.noop,
        describe: "procs",
        onRPCError: null,
        keymap: null,
        doubleTab: null,
        doubleTabEchoCommand: false,
        completion: false,
        onInit: $.noop,
        onClear: $.noop,
        onBlur: $.noop,
        onFocus: $.noop,
        onTerminalChange: $.noop,
        onExit: $.noop,
        onPush: $.noop,
        onPop: $.noop,
        keypress: $.noop,
        keydown: $.noop,
        renderHandler: null,
        onAfterRedraw: $.noop,
        onEchoCommand: $.noop,
        onPaste: $.noop,
        onFlush: $.noop,
        onBeforeCommand: null,
        onAfterCommand: null,
        onBeforeEcho: null,
        onAfterEcho: null,
        onBeforeLogin: null,
        onAfterLogout: null,
        onBeforeLogout: null,
        allowedAttributes: ["title", /^aria-/, "id", /^data-/],
        strings: {
            comletionParameters: "From version 1.0.0 completion function need to" + " have two arguments",
            wrongPasswordTryAgain: "Wrong username or password try again!",
            wrongPassword: "Wrong username or password!",
            ajaxAbortError: "Error while aborting ajax call!",
            wrongArity: "Wrong number of arguments. Function '%s' expects %s got" + " %s!",
            commandNotFound: "Command '%s' Not Found!",
            oneRPCWithIgnore: "You can use only one rpc with describe == false " + "or rpc without system.describe",
            oneInterpreterFunction: "You can't use more than one function (rpc " + "without system.describe or with option describe == false count" + "s as one)",
            loginFunctionMissing: "You didn't specify a login function",
            noTokenError: "Access denied (no token)",
            serverResponse: "Server responded",
            wrongGreetings: "Wrong value of greetings parameter",
            notWhileLogin: "You can't call `%s' function while in login",
            loginIsNotAFunction: "Authenticate must be a function",
            canExitError: "You can't exit from main interpreter",
            invalidCompletion: "Invalid completion",
            invalidSelector: "Sorry, but terminal said that you use invalid " + "selector!",
            invalidTerminalId: "Invalid Terminal ID",
            login: "login",
            password: "password",
            recursiveLoop: "Recursive loop in echo detected, skip",
            notAString: "%s function: argument is not a string",
            redrawError: "Internal error, wrong position in cmd redraw",
            invalidStrings: "Command %s have unclosed strings",
            defunctTerminal: "You can't call method on terminal that was destroyed"
        }
    };
    var requests = [];
    var terminals = new Cycle;
    var save_state = [];
    var hash_commands;
    var change_hash = false;
    var fire_hash_change = true;
    var first_instance = true;
    $.fn.terminal = function(e, t) {
        function n(n) {
            if (n) {
                this.storage = {}
            }
            this.set = function(e, t) {
                if (n) {
                    this.storage[e] = t
                } else {
                    $.Storage.set(e, t)
                }
            };
            this.get = function(e) {
                if (n) {
                    return this.storage[e]
                } else {
                    return $.Storage.get(e)
                }
            };
            this.remove = function(e) {
                if (n) {
                    delete this.storage[e]
                } else {
                    $.Storage.remove(e)
                }
            }
        }

        function f(e) {
            if ($.terminal.unclosed_strings(e)) {
                var t = $.terminal.escape_brackets(e);
                var n = sprintf(ue().invalidStrings, "`" + t + "`");
                throw new $.terminal.Exception(n)
            } else if (is_function(Oe.processArguments)) {
                return process_command(e, Oe.processArguments)
            } else if (Oe.processArguments) {
                return $.terminal.parse_command(e)
            } else {
                return $.terminal.split_command(e)
            }
        }

        function s(e, t) {
            if ($.terminal.Animation && e instanceof $.terminal.Animation) {
                e.start(ae);
                return false
            }
            if (is_function(Oe.renderHandler)) {
                var n = Oe.renderHandler.call(ae, e, t, ae);
                if (n === false) {
                    return false
                }
                if (typeof n === "string" || i(n) || is_promise(n)) {
                    return n
                } else {
                    return e
                }
            }
            return e
        }

        function u(e) {
            var t = e.data("index");
            var n = Ne[t];
            var r = n[1];
            if (is_function(r.unmount)) {
                r.unmount.call(ae, e)
            }
        }

        function a(t, n) {
            if (i(t)) {
                var e = $.extend({}, n, {
                    raw: true,
                    finalize: function(e) {
                        e.find(".terminal-render-item").replaceWith(t);
                        if (n && is_function(n.finalize)) {
                            n.finalize(e, ae)
                        }
                    }
                });
                return ['<div class="terminal-render-item"/>', e]
            }
        }

        function l(e, t) {
            var n = a(e, t);
            if (n) {
                ae.echo.apply(ae, n);
                return true
            }
        }

        function r(e) {
            return he.find("[data-index=" + e + "]")
        }

        function i(e) {
            return e instanceof $.fn.init || e instanceof Element
        }

        function m(e) {
            e = s(e);
            if (e === false) {
                return
            }
            if (l(e)) {
                return
            }
            if (typeof e === "string") {
                ae.echo(e)
            } else if (is_array(e)) {
                ae.echo($.map(e, function(e) {
                    return JSON.stringify(e)
                }).join(" "))
            } else if (typeof e === "object") {
                ae.echo(JSON.stringify(e))
            } else {
                ae.echo(e)
            }
        }

        function D(e, a) {
            var t = /(.*):([0-9]+):([0-9]+)$/;
            var o = e.match(t);
            if (o) {
                ae.pause(Oe.softPause);
                $.get(o[1], function(e) {
                    var t = o[1];
                    var n = e.split("\n");
                    var i = +o[2] - 1;
                    var r = i > 2 ? i - 2 : 0;
                    var u = n.slice(r, i + 3).map(function(e, t) {
                        var n = "[" + (i + t - 1) + "]: ";
                        var r = a - n.length - 4;
                        if (e.length > r) {
                            e = e.substring(0, r) + "..."
                        }
                        if (i > 2 ? t === 2 : t === i) {
                            e = "[[;#f00;]" + $.terminal.escape_brackets(e) + "]"
                        }
                        return n + e
                    }).filter(Boolean).join("\n");
                    if (u.length) {
                        ae.echo("[[b;white;]" + t + "]");
                        ae.echo(u).resume()
                    }
                }, "text")
            }
        }

        function c(e) {
            if (is_function(Oe.onRPCError)) {
                Oe.onRPCError.call(ae, e)
            } else {
                ae.error("&#91;RPC&#93; " + e.message);
                if (e.error && e.error.message) {
                    e = e.error;
                    var t = "\t" + e.message;
                    if (e.file) {
                        t += ' in file "' + e.file.replace(/.*\//, "") + '"'
                    }
                    if (e.at) {
                        t += " at line " + e.at
                    }
                    ae.error(t)
                }
            }
        }

        function p(n, r) {
            var i = function(e, t) {
                ae.pause(Oe.softPause);
                $.jrpc({
                    url: n,
                    method: e,
                    params: t,
                    request: function(e, t) {
                        try {
                            Oe.request.call(ae, e, t, ae)
                        } catch (e) {
                            y(e, "USER")
                        }
                    },
                    response: function(e, t) {
                        try {
                            Oe.response.call(ae, e, t, ae)
                        } catch (e) {
                            y(e, "USER")
                        }
                    },
                    success: function e(t) {
                        if (t.error) {
                            c(t.error)
                        } else if (is_function(Oe.processRPCResponse)) {
                            Oe.processRPCResponse.call(ae, t.result, ae)
                        } else if (t.result !== null) {
                            m(t.result)
                        }
                        ae.resume()
                    },
                    error: h
                })
            };
            return function(e, t) {
                if (e === "") {
                    return
                }
                try {
                    e = f(e)
                } catch (e) {
                    y(e, "TERMINAL (get_processed_command)");
                    return
                }
                if (!r || e.name === "help") {
                    i(e.name, e.args)
                } else {
                    var n = t.token(true);
                    if (n) {
                        i(e.name, [n].concat(e.args))
                    } else {
                        t.error("&#91;AUTH&#93; " + ue().noTokenError)
                    }
                }
            }
        }

        function d(a, o, s, l) {
            return function(e, t) {
                if (e === "") {
                    return
                }
                var n;
                try {
                    n = f(e)
                } catch (e) {
                    if (is_function(Oe.exception)) {
                        Oe.exception(e, ae)
                    } else {
                        ae.error("Error: " + (e.message || e))
                    }
                    return
                }
                var r = a[n.name];
                var i = get_type(r);
                if (i === "function") {
                    if (o && r.length !== n.args.length) {
                        ae.error("&#91;Arity&#93; " + sprintf(ue().wrongArity, n.name, r.length, n.args.length))
                    } else {
                        return r.apply(ae, n.args)
                    }
                } else if (i === "object" || i === "string") {
                    var u = [];
                    if (i === "object") {
                        u = Object.keys(r);
                        r = d(r, o, s)
                    }
                    t.push(r, {
                        prompt: n.name + "> ",
                        name: n.name,
                        completion: i === "object" ? u : undefined
                    })
                } else if (is_function(l)) {
                    l(e, ae)
                } else if (is_function(Oe.onCommandNotFound)) {
                    Oe.onCommandNotFound.call(ae, e, ae)
                } else {
                    t.error(sprintf(ue().commandNotFound, n.name))
                }
            }
        }

        function h(e, t, n) {
            ae.resume();
            if (is_function(Oe.onAjaxError)) {
                Oe.onAjaxError.call(ae, e, t, n)
            } else if (t !== "abort") {
                ae.error("&#91;AJAX&#93; " + t + " - " + ue().serverResponse + ":\n" + $.terminal.escape_brackets(e.responseText))
            }
        }

        function v(u, o, r) {
            function s(e) {
                if (e.error) {
                    c(e.error)
                } else if (is_function(Oe.processRPCResponse)) {
                    Oe.processRPCResponse.call(ae, e.result, ae)
                } else {
                    m(e.result)
                }
                ae.resume()
            }

            function l(e, t) {
                try {
                    Oe.request.call(ae, e, t, ae)
                } catch (e) {
                    y(e, "USER")
                }
            }

            function f(e, t) {
                try {
                    Oe.response.call(ae, e, t, ae)
                } catch (e) {
                    y(e, "USER")
                }
            }

            function e(e) {
                var n = e;
                if (Oe.describe !== false && Oe.describe !== "") {
                    Oe.describe.split(".").forEach(function(e) {
                        n = n[e]
                    })
                }
                if (n && n.length) {
                    var t = {};
                    $.each(n, function(e, i) {
                        if ($.isPlainObject(i) && typeof i.name === "string") {
                            t[i.name] = function() {
                                var e = o && i.name !== "help";
                                var t = Array.prototype.slice.call(arguments);
                                var n = t.length + (e ? 1 : 0);
                                if (Oe.checkArity && i.params && i.params.length !== n) {
                                    ae.error("&#91;Arity&#93; " + sprintf(ue().wrongArity, i.name, i.params.length, n))
                                } else {
                                    ae.pause(Oe.softPause);
                                    if (e) {
                                        var r = ae.token(true);
                                        if (r) {
                                            t = [r].concat(t)
                                        } else {
                                            ae.error("&#91;AUTH&#93; " + ue().noTokenError)
                                        }
                                    }
                                    $.jrpc({
                                        url: u,
                                        method: i.name,
                                        params: t,
                                        request: l,
                                        response: f,
                                        success: s,
                                        error: h
                                    })
                                }
                            }
                        }
                    });
                    var a = typeof o === "string" ? o : "login";
                    t.help = t.help || function(i) {
                        if (typeof i === "undefined") {
                            var e = n.map(function(e) {
                                return e.name
                            }).join(", ") + ", help";
                            ae.echo("Available commands: " + e)
                        } else {
                            var u = false;
                            $.each(n, function(e, t) {
                                if (t.name === i) {
                                    u = true;
                                    var n = "";
                                    n += "[[bu;;]" + t.name + "]";
                                    if (t.params) {
                                        var r = t.params;
                                        if (o && t.name !== a) {
                                            r = r.slice(1)
                                        }
                                        n += " " + r.join(" ")
                                    }
                                    if (t.help) {
                                        n += "\n" + t.help
                                    }
                                    ae.echo(n);
                                    return false
                                }
                            });
                            if (!u) {
                                if (i === "help") {
                                    ae.echo("[[bu;;]help] [method]\ndisplay help " + "for the method or list of methods if not" + " specified")
                                } else {
                                    var t = "Method `" + i + "' not found ";
                                    ae.error(t)
                                }
                            }
                        }
                    };
                    r(t)
                } else {
                    r(null)
                }
            }
            return $.jrpc({
                url: u,
                method: "system.describe",
                params: [],
                success: e,
                request: l,
                response: f,
                error: function e() {
                    r(null)
                }
            })
        }

        function g(t, a, n) {
            n = n || $.noop;
            var e = get_type(t);
            var o;
            var r = {};
            var s = 0;
            var l;
            if (e === "array") {
                o = {};
                (function t(e, n) {
                    if (e.length) {
                        var r = e[0];
                        var i = e.slice(1);
                        var u = get_type(r);
                        if (u === "string") {
                            ae.pause(Oe.softPause);
                            if (Oe.describe === false) {
                                if (++s === 1) {
                                    l = p(r, a)
                                } else {
                                    ae.error(ue().oneRPCWithIgnore)
                                }
                                t(i, n)
                            } else {
                                v(r, a, function(e) {
                                    if (e) {
                                        $.extend(o, e)
                                    } else if (++s === 1) {
                                        l = p(r, a)
                                    } else {
                                        ae.error(ue().oneRPCWithIgnore)
                                    }
                                    ae.resume();
                                    t(i, n)
                                })
                            }
                        } else if (u === "function") {
                            if (l) {
                                ae.error(ue().oneInterpreterFunction)
                            } else {
                                l = r
                            }
                            t(i, n)
                        } else if (u === "object") {
                            $.extend(o, r);
                            t(i, n)
                        }
                    } else {
                        n()
                    }
                })(t, function() {
                    n({
                        interpreter: d(o, false, a, l && l.bind(ae)),
                        completion: Object.keys(o)
                    })
                })
            } else if (e === "string") {
                if (Oe.describe === false) {
                    o = {
                        interpreter: p(t, a)
                    };
                    if ($.isArray(Oe.completion)) {
                        o.completion = Oe.completion
                    }
                    n(o)
                } else {
                    ae.pause(Oe.softPause);
                    v(t, a, function(e) {
                        if (e) {
                            r.interpreter = d(e, false, a);
                            r.completion = Object.keys(e)
                        } else {
                            r.interpreter = p(t, a)
                        }
                        n(r);
                        ae.resume()
                    })
                }
            } else if (e === "object") {
                n({
                    interpreter: d(t, Oe.checkArity, a),
                    completion: Object.keys(t)
                })
            } else {
                if (e === "undefined") {
                    t = $.noop
                } else if (e !== "function") {
                    var i = e + " is invalid interpreter value";
                    throw new $.terminal.Exception(i)
                }
                n({
                    interpreter: t,
                    completion: Oe.completion
                })
            }
        }

        function _(r, e) {
            var i = get_type(e) === "boolean" ? "login" : e;
            return function(e, t, n) {
                ae.pause(Oe.softPause);
                $.jrpc({
                    url: r,
                    method: i,
                    params: [e, t],
                    request: function(e, t) {
                        try {
                            Oe.request.call(ae, e, t, ae)
                        } catch (e) {
                            y(e, "USER")
                        }
                    },
                    response: function(e, t) {
                        try {
                            Oe.response.call(ae, e, t, ae)
                        } catch (e) {
                            y(e, "USER")
                        }
                    },
                    success: function e(t) {
                        if (!t.error && t.result) {
                            n(t.result)
                        } else {
                            n(null)
                        }
                        ae.resume()
                    },
                    error: h
                })
            }
        }

        function y(e, t, n) {
            if (is_function(Oe.exceptionHandler)) {
                Oe.exceptionHandler.call(ae, e, t)
            } else {
                ae.exception(e, t);
                if (!n) {
                    setTimeout(function() {
                        throw e
                    }, 0)
                }
            }
        }

        function b(e) {
            function t(e, n, r, i, u, a, t) {
                function o(e, t) {
                    return "[[" + [n + (e || ""), r, i, u, t || a].join(";") + "]"
                }

                function s(e) {
                    return "]" + o("!", e) + e + "]" + o()
                }
                if (!n.match(/!/)) {
                    var l = t.match(email_full_re) || t.match(url_full_re);
                    if (l) {
                        return o("!", l[1]) + t + "]"
                    } else if (t.match(email_re) || t.match(url_nf_re)) {
                        var f = t.replace(email_re, s).replace(url_nf_re, s);
                        return o("", a) + f + "]"
                    }
                }
                return e
            }

            function n(e) {
                return e.replace(email_re, "[[!;;]$1]").replace(url_nf_re, "[[!;;]$1]")
            }
            if (!$.terminal.have_formatting(e)) {
                return n(e)
            }
            return $.terminal.format_split(e).map(function(e) {
                if ($.terminal.is_formatting(e)) {
                    return e.replace(format_parts_re, t)
                } else {
                    return n(e)
                }
            }).join("")
        }

        function C(e, t) {
            return (strlen(text(e)) > t.cols || e.match(/\n/)) && (Oe.wrap === true && t.wrap === undefined || Oe.wrap === false && t.wrap === true)
        }
        var F;
        if ("Map" in root) {
            F = new Map
        }

        function w(e, n, r) {
            if (r.exec || n.options.clear_exec) {
                return $.terminal.each_extended_command(e, function(e) {
                    if (r.exec) {
                        n.options.exec = false;
                        n.options.clear_exec = true;
                        var t = e.trim();
                        if (me && me === t) {
                            me = "";
                            ae.error(ue().recursiveLoop)
                        } else {
                            me = t;
                            $.terminal.extended_command(ae, e, {
                                invokeMethods: r.invokeMethods
                            }).then(function() {
                                me = ""
                            })
                        }
                    }
                })
            }
            return e
        }

        function E(t) {
            try {
                var e = !is_function(t.value);
                var n = $.extend({
                    exec: true,
                    raw: false,
                    finalize: $.noop,
                    useCache: e,
                    invokeMethods: false,
                    formatters: true,
                    convertLinks: Oe.convertLinks
                }, t.options || {});
                var r = at(t.value);
                if (r && is_function(r.then)) {
                    return r.then(function(e) {
                        E($.extend(t, {
                            value: e,
                            options: n
                        }))
                    })
                }
                if (r !== "") {
                    if (!n.raw) {
                        if (Oe.useCache && n.useCache) {
                            var i = r;
                            if (F && F.has(i)) {
                                var u = F.get(i);
                                Pe.append(u.input, t.index, n, u.raw);
                                return true
                            }
                        }
                        if (n.formatters) {
                            try {
                                r = $.terminal.apply_formatters(r, $.extend(Oe, {
                                    echo: true
                                }))
                            } catch (e) {
                                y(e, "FORMATTING")
                            }
                        }
                        r = w(r, t, n);
                        if (r === "") {
                            return
                        }
                        if (n.convertLinks) {
                            r = b(r)
                        }
                        var a = r;
                        r = crlf($.terminal.normalize(r));
                        r = $.terminal.encode(r, {
                            tabs: Oe.tabs
                        });
                        var o;
                        var s = n.cols = ae.cols();
                        if (C(r, n)) {
                            var l = n.keepWords;
                            o = $.terminal.split_equal(r, s, l)
                        } else if (r.match(/\n/)) {
                            o = r.split(/\n/)
                        }
                    }
                } else {
                    a = ""
                }
                var f = o || r;
                if (F && i && e) {
                    F.set(i, {
                        input: f,
                        raw: a
                    })
                }
                Pe.append(f, t.index, n, a)
            } catch (e) {
                Pe.clear();
                if (is_function(Oe.exceptionHandler)) {
                    Oe.exceptionHandler.call(ae, e, "TERMINAL")
                } else {
                    alert_exception("[Internal Exception(process_line)]", e)
                }
            }
            return true
        }

        function o(e) {
            e = $.extend({}, {
                update: false,
                scroll: true
            }, e || {});
            if (!e.update) {
                Je.resize(_e);
                var t = he.empty().detach()
            }
            try {
                Pe.clear();
                unpromise(Ne.render(ae.rows(), function(e) {
                    return e.map(function(e) {
                        return E(e)
                    })
                }), function() {
                    ae.flush(e);
                    if (!e.update) {
                        Je.before(t)
                    }
                    M("onAfterRedraw")
                })
            } catch (e) {
                if (is_function(Oe.exceptionHandler)) {
                    Oe.exceptionHandler.call(ae, e, "TERMINAL (redraw)")
                } else {
                    alert_exception("[redraw]", e)
                }
            }
        }

        function x() {
            if (Oe.outputLimit >= 0) {
                var e;
                if (Oe.outputLimit === 0) {
                    e = ae.rows()
                } else {
                    e = Oe.outputLimit
                }
                var t = he.find("> div > div");
                if (t.length + 1 > e) {
                    var n = t.length - e + 1;
                    var r = t.slice(0, n);
                    var i = r.parent();
                    r.remove();
                    i.each(function() {
                        var e = $(this);
                        if (e.is(":empty")) {
                            u(e);
                            e.remove()
                        }
                    });
                    Ne.limit_snapshot(n)
                }
            }
        }

        function k() {
            if (Oe.greetings === undefined) {
                ae.echo(ae.signature, {
                    finalize: a11y_hide,
                    formatters: false
                })
            } else if (Oe.greetings) {
                var e = typeof Oe.greetings;
                if (e === "string") {
                    ae.echo(Oe.greetings)
                } else if (e === "function") {
                    ae.echo(function() {
                        try {
                            return Oe.greetings.call(ae, ae.echo)
                        } catch (e) {
                            Oe.greetings = null;
                            y(e, "greetings")
                        }
                    })
                } else {
                    ae.error(ue().wrongGreetings)
                }
            }
        }

        function A(n) {
            if (typeof n === "undefined") {
                n = ae.get_command()
            }
            var e = Je.prompt(true);
            var t = Je.mask();
            switch (typeof t) {
                case "string":
                    n = n.replace(/./g, t);
                    break;
                case "boolean":
                    if (t) {
                        n = n.replace(/./g, Oe.maskChar)
                    } else {
                        n = $.terminal.escape_formatting(n)
                    }
                    break
            }
            var r = {
                exec: false,
                formatters: false,
                finalize: function e(t) {
                    a11y_hide(t.addClass("terminal-command"));
                    M("onEchoCommand", [t, n])
                }
            };
            n = $.terminal.apply_formatters(n, {
                command: true
            });
            ae.echo(e + n, r)
        }

        function B() {
            return Ze.outerWidth() !== ae.outerWidth()
        }

        function T(e) {
            var t = terminals.get()[e[0]];
            if (!t) {
                throw new $.terminal.Exception(ue().invalidTerminalId)
            }
            var n = e[1];
            if (save_state[n]) {
                t.import_view(save_state[n])
            } else {
                change_hash = false;
                var r = e[2];
                if (r) {
                    t.exec(r).done(function() {
                        change_hash = true;
                        save_state[n] = t.export_view()
                    })
                }
            }
        }

        function S(t) {
            return function(e) {
                ae.error("[" + t + "] " + (e.message || e)).resume()
            }
        }

        function R() {
            if (change_hash) {
                fire_hash_change = false;
                location.hash = "#" + JSON.stringify(hash_commands);
                setTimeout(function() {
                    fire_hash_change = true
                }, 100)
            }
        }
        var j = true;
        var O = [];

        function L(n, e, t) {
            function r() {
                if (Oe.historyState || Oe.execHash && t) {
                    if (!save_state.length) {
                        ae.save_state()
                    } else {
                        ae.save_state(null)
                    }
                }
            }

            function i() {
                if (!t) {
                    change_hash = true;
                    if (Oe.historyState) {
                        ae.save_state(n, false)
                    }
                    change_hash = c
                }
            }

            function u() {
                f.resolve();
                M("onAfterCommand", [n])
            }

            function a(e) {
                if (typeof e !== "undefined") {
                    m(e)
                }
                u();
                ae.resume()
            }

            function o(e) {
                return is_function(e.done || e.then) && we
            }

            function s() {
                var e = l.interpreter.call(ae, n, ae);
                i();
                if (e) {
                    if (!ge) {
                        if (o(e)) {
                            qe = true
                        } else {
                            ae.pause(Oe.softPause)
                        }
                    }
                    ge = false;
                    var t = S("Command");
                    if (is_function(e.done || e.then)) {
                        return unpromise(e, a, t)
                    } else {
                        return $.when(e).done(a).catch(t)
                    }
                } else {
                    if (qe) {
                        O.push(function() {
                            u()
                        })
                    } else {
                        u()
                    }
                    return f.promise()
                }
            }
            if (j) {
                j = false;
                r()
            }
            try {
                if (M("onBeforeCommand", [n]) === false) {
                    return
                }
                if (t) {
                    me = n.trim();
                    De = $.terminal.split_command(me)
                } else {
                    De = $.terminal.split_command(n)
                }
                if (!J()) {
                    if (t && (is_function(Oe.historyFilter) && Oe.historyFilter(n) || n.match(Oe.historyFilter))) {
                        Je.history().append(n)
                    }
                }
                var l = Ke.top();
                if (!e && Oe.echoCommand) {
                    A(n)
                }
                var f = new $.Deferred;
                var c = change_hash;
                if (n.match(/^\s*login\s*$/) && ae.token(true)) {
                    i();
                    if (ae.level() > 1) {
                        ae.logout(true)
                    } else {
                        ae.logout()
                    }
                    u()
                } else if (Oe.exit && n.match(/^\s*exit\s*$/) && !Be) {
                    i();
                    var p = ae.level();
                    if (p === 1 && ae.get_token() || p > 1) {
                        if (ae.get_token(true)) {
                            ae.set_token(undefined, true)
                        }
                        ae.pop()
                    }
                    u()
                } else if (Oe.clear && n.match(/^\s*clear\s*$/) && !Be) {
                    i();
                    ae.clear();
                    u()
                } else {
                    var D = s();
                    if (D) {
                        return D
                    }
                }
                return f.promise()
            } catch (e) {
                y(e, "USER", t);
                ae.resume();
                if (t) {
                    throw e
                }
            }
        }

        function I() {
            if (M("onBeforeLogout", [], true) === false) {
                return
            }
            z();
            M("onAfterlogout", [], true);
            ae.login(rt, true, K)
        }

        function z() {
            var e = ae.prefix_name(true) + "_";
            Me.remove(e + "token");
            Me.remove(e + "login")
        }

        function P(e) {
            var t = ae.prefix_name() + "_interpreters";
            var n = Me.get(t);
            if (n) {
                n = JSON.parse(n)
            } else {
                n = []
            }
            if ($.inArray(e, n) === -1) {
                n.push(e);
                Me.set(t, JSON.stringify(n))
            }
        }

        function N(e) {
            var t = Ke.top();
            var n = ae.prefix_name(true);
            if (!J()) {
                P(n)
            }
            var r = ae.login_name(true);
            Je.name(n + (r ? "_" + r : ""));
            var i = t.prompt;
            if (is_function(i)) {
                i = ot(i)
            }
            if (i !== Je.prompt()) {
                if (is_function(t.prompt)) {
                    Je.prompt("")
                }
                Je.prompt(t.prompt)
            }
            if (typeof t.history !== "undefined") {
                ae.history().toggle(t.history)
            }
            if ($.isPlainObject(t.keymap)) {
                Je.keymap(null).keymap($.extend({}, lt, $.omap(t.keymap, function(e, t) {
                    return function() {
                        var e = [].slice.call(arguments);
                        try {
                            return t.apply(ae, e)
                        } catch (e) {
                            y(e, "USER KEYMAP")
                        }
                    }
                })))
            }
            Je.set("");
            Ee.resolve();
            if (!e && is_function(t.onStart)) {
                t.onStart.call(ae, ae)
            }
        }

        function M(t, e, n) {
            e = (e || []).concat([ae]);
            var r = Ke && Ke.top();
            if (r && is_function(r[t]) && !n) {
                try {
                    return r[t].apply(ae, e)
                } catch (e) {
                    delete r[t];
                    y(e, t)
                }
            } else if (is_function(Oe[t])) {
                try {
                    return Oe[t].apply(ae, e)
                } catch (e) {
                    Oe[t] = null;
                    y(e, t)
                }
            }
        }
        var H = function() {
            function e(e) {
                if (!e) {
                    try {
                        ae.scroll_to(ae.find(".cmd-cursor-line"));
                        return true
                    } catch (e) {
                        return true
                    }
                }
            }
            if (typeof global !== "undefined" && typeof global.it === "function") {
                return e
            }
            return debounce(e, 100, {
                leading: true,
                trailing: false
            })
        }();

        function W() {
            var e = ae.find(".cmd-cursor-line");
            return e.is_fully_in_viewport(ae).then(H)
        }

        function q(e) {
            if (typeof history !== "undefined" && history.replaceState) {
                var t = "#" + JSON.stringify(e);
                var n = location.href.replace(/#.*$/, t);
                history.replaceState(null, "", n)
            }
        }

        function U() {
            if (fire_hash_change && Oe.execHash) {
                try {
                    if (location.hash) {
                        var e = location.hash.replace(/^#/, "");
                        hash_commands = JSON.parse(decodeURIComponent(e))
                    } else {
                        hash_commands = []
                    }
                    if (hash_commands.length) {
                        T(hash_commands[hash_commands.length - 1])
                    } else if (save_state[0]) {
                        ae.import_view(save_state[0])
                    }
                } catch (e) {
                    y(e, "TERMINAL")
                }
            }
        }

        function K() {
            N();
            k();
            if (Ne.length) {
                if (ce.length) {
                    $.when.apply($, ce).then(ae.refresh)
                } else {
                    ae.refresh()
                }
            }

            function t() {
                Te = $.noop;
                if (!e && ae.enabled()) {
                    ae.resume(true)
                }
            }
            var e = false;
            if (is_function(Oe.onInit)) {
                Te = function() {
                    e = true
                };
                var n;
                try {
                    n = Oe.onInit.call(ae, ae)
                } catch (e) {
                    y(e, "OnInit")
                } finally {
                    if (!is_promise(n)) {
                        t()
                    } else {
                        n.then(t).catch(function(e) {
                            y(e, "OnInit");
                            t()
                        })
                    }
                }
            }
            if (first_instance) {
                first_instance = false;
                $(window).on("hashchange", U)
            }
        }

        function J() {
            return Be || Je.mask() !== false
        }

        function Q(e) {
            var t, n = Ke.top();
            if (is_function(n.keydown)) {
                t = n.keydown.call(ae, e, ae);
                if (t !== undefined) {
                    return t
                }
            } else if (is_function(Oe.keydown)) {
                t = Oe.keydown.call(ae, e, ae);
                if (t !== undefined) {
                    return t
                }
            }
        }
        var Y = {
            "CTRL+D": function(e, t) {
                if (!Be) {
                    if (Je.get() === "") {
                        if (Ke.size() > 1 || is_function(rt)) {
                            ae.pop("")
                        } else {
                            ae.resume()
                        }
                    } else {
                        t()
                    }
                }
                return false
            },
            "CTRL+C": function() {
                with_selection(function(e) {
                    if (e === "") {
                        var t = ae.get_command();
                        var n = ae.get_position();
                        t = t.slice(0, n) + "^C" + t.slice(n + 2);
                        A(t);
                        ae.set_command("")
                    } else {
                        var r = ae.find("textarea");
                        text_to_clipboard(r, process_selected_html(e))
                    }
                });
                return false
            },
            "CTRL+L": function() {
                ae.clear();
                return false
            },
            TAB: function(e, t) {
                var n = Ke.top(),
                    r, i;
                if (typeof n.caseSensitiveAutocomplete !== "undefined") {
                    i = n.caseSensitiveAutocomplete
                } else {
                    i = Oe.caseSensitiveAutocomplete
                }
                if (Oe.completion && get_type(Oe.completion) !== "boolean" && n.completion === undefined) {
                    r = Oe.completion
                } else {
                    r = n.completion
                }
                if (r === "settings") {
                    r = Oe.completion
                }

                function u(e) {
                    e = e.slice();
                    if (!ae.before_cursor(false).match(/\s/)) {
                        if (Oe.clear && $.inArray("clear", e) === -1) {
                            e.push("clear")
                        }
                        if (Oe.exit && $.inArray("exit", e) === -1) {
                            e.push("exit")
                        }
                    }
                    ae.complete(e, {
                        echo: true,
                        word: Oe.wordAutocomplete,
                        escape: Oe.completionEscape,
                        caseSensitive: i,
                        echoCommand: Oe.doubleTabEchoCommand,
                        doubleTab: Oe.doubleTab
                    })
                }
                if (r) {
                    switch (get_type(r)) {
                        case "function":
                            var a = ae.before_cursor(Oe.wordAutocomplete);
                            if (r.length === 3) {
                                var o = new Error(ue().comletionParameters);
                                y(o, "USER");
                                return false
                            }
                            var s = r.call(ae, a, u);
                            unpromise(s, u, S("Completion"));
                            break;
                        case "array":
                            u(r);
                            break;
                        default:
                            throw new $.terminal.Exception(ue().invalidCompletion)
                    }
                } else {
                    t()
                }
                return false
            },
            "CTRL+V": function(e, t) {
                t(e);
                ae.oneTime(200, function() {
                    ae.scroll_to_bottom()
                });
                return true
            },
            "CTRL+TAB": function() {
                if (terminals.length() > 1) {
                    ae.focus(false);
                    return false
                }
            },
            PAGEDOWN: function() {
                ae.scroll(ae.height())
            },
            PAGEUP: function() {
                ae.scroll(-ae.height())
            }
        };

        function V(t) {
            var e, n;
            if (we) {
                return false
            }
            if (ae.enabled()) {
                if (!ae.paused()) {
                    e = Q(t);
                    if (e !== undefined) {
                        return e
                    }
                    if (t.which !== 9) {
                        de = 0
                    }
                } else {
                    if (!Oe.pauseEvents) {
                        e = Q(t);
                        if (e !== undefined) {
                            return e
                        }
                    }
                    if (t.which === 68 && t.ctrlKey) {
                        if (Oe.pauseEvents) {
                            e = Q(t);
                            if (e !== undefined) {
                                return e
                            }
                        }
                        if (requests.length) {
                            for (n = requests.length; n--;) {
                                var r = requests[n];
                                if (r.readyState !== 4) {
                                    try {
                                        r.abort()
                                    } catch (e) {
                                        if (is_function(Oe.exceptionHandler)) {
                                            Oe.exceptionHandler.call(ae, t, "AJAX ABORT")
                                        } else {
                                            ae.error(ue().ajaxAbortError)
                                        }
                                    }
                                }
                            }
                            requests = []
                        }
                        ae.resume()
                    }
                    return false
                }
            }
        }

        function G(e) {
            var t = Ke.top();
            if (He && (!qe || !Oe.pauseEvents)) {
                if (is_function(t.keypress)) {
                    return t.keypress.call(ae, e, ae)
                } else if (is_function(Oe.keypress)) {
                    return Oe.keypress.call(ae, e, ae)
                }
            }
        }

        function X(f) {
            return function e(t, n) {
                var r = $.terminal.apply_formatters(t, {
                    animation: true
                });
                we = true;
                var i = ae.get_prompt();
                var u = 0;
                var a = $.terminal.length(r);
                if (t.length > 0) {
                    var o = "";
                    if (n.prompt) {
                        o = n.prompt
                    } else {
                        ae.set_prompt("")
                    }
                    var s = ae.is_bottom();
                    var l = setInterval(function() {
                        var e = $.terminal.substring(r, u, u + 1);
                        o += e;
                        ae.set_prompt(o);
                        if (e === "\n" && s) {
                            ae.scroll_to_bottom()
                        }
                        u++;
                        if (u === a) {
                            clearInterval(l);
                            setTimeout(function() {
                                f(t, i, n);
                                we = false
                            }, n.delay)
                        }
                    }, n.delay)
                }
            }
        }
        var Z = X(function(e, t, n) {
            ae.set_prompt(e);
            n.finalize()
        });
        var ee = function() {
            var r = X(function(e, t, n) {
                ae.set_prompt(t);
                ae.insert(e);
                n.finalize()
            });
            return function(e, t, n) {
                return r(t, $.extend({}, n, {
                    prompt: e + ae.get_command()
                }))
            }
        }();
        var te = X(function(e, t, n) {
            ae.set_prompt(t);
            ae.echo(e, $.extend({}, n, {
                typing: false
            }))
        });
        var ne = function() {
            var r = X(function(t, e, n) {
                ae.set_prompt(e);
                with_prompt(e, function(e) {
                    ae.echo(e + t, $.extend({}, n, {
                        typing: false
                    }))
                }, ae)
            });
            return function(e, t, n) {
                return r(t, $.extend({}, n, {
                    prompt: e
                }))
            }
        }();

        function re(a, o, s) {
            return function e(r, i) {
                var u = new $.Deferred;
                xe(function e() {
                    var t = $.extend({
                        typing: false,
                        delay: Oe.execAnimationDelay
                    }, i);
                    if (t.typing) {
                        if (typeof r !== "string") {
                            return u.reject(a + ": Typing animation require string")
                        }
                        if (typeof t.delay !== "number" || isNaN(t.delay)) {
                            return u.reject(a + ": Invalid argument, delay need to" + " be a number")
                        }
                        var n = ae.typing(a, t.delay, r, t);
                        n.then(function() {
                            u.resolve()
                        })
                    } else {
                        o(r, t)
                    }
                    if (is_function(s)) {
                        s(r, t)
                    }
                });
                if (i && i.typing) {
                    return u.promise()
                }
                return ae
            }
        }

        function ie(t) {
            return function(e) {
                t.add(e)
            }
        }

        function ue() {
            return $.extend({}, $.terminal.defaults.strings, Oe && Oe.strings || {})
        }
        var ae = this;
        if (this.length > 1) {
            return this.each(function() {
                $.fn.terminal.call($(this), e, $.extend({
                    name: ae.selector
                }, t))
            })
        }
        var oe;
        if (ae.is("body,html")) {
            if (ae.hasClass("full-screen-terminal")) {
                var se = ae.find("> .terminal").data("terminal");
                if (se) {
                    return se
                }
            }
            oe = ae;
            ae = $("<div/>").appendTo("body");
            $("body").addClass("full-screen-terminal")
        } else if (ae.data("terminal")) {
            return ae.data("terminal")
        }
        var le = $.omap({
            id: function() {
                return ve
            },
            clear: function() {
                if (M("onClear") !== false) {
                    Pe.clear();
                    Ne.clear(function(e) {
                        return r(e)
                    });
                    he[0].innerHTML = "";
                    ae.prop({
                        scrollTop: 0
                    })
                }
                return ae
            },
            export_view: function() {
                var e = M("onExport");
                e = e || {};
                return $.extend({}, {
                    focus: He,
                    mask: Je.mask(),
                    prompt: ae.get_prompt(),
                    command: ae.get_command(),
                    position: Je.position(),
                    lines: clone(Ne.data()),
                    interpreters: Ke.clone(),
                    history: Je.history().data
                }, e)
            },
            import_view: function(t) {
                if (Be) {
                    throw new Error(sprintf(ue().notWhileLogin, "import_view"))
                }
                M("onImport", [t]);
                xe(function e() {
                    ae.set_prompt(t.prompt);
                    ae.set_command(t.command);
                    Je.position(t.position);
                    Je.mask(t.mask);
                    if (t.focus) {
                        ae.focus()
                    }
                    Ne.import(clone(t.lines).filter(function(e) {
                        return e[0]
                    }));
                    if (t.interpreters instanceof Stack) {
                        Ke = t.interpreters
                    }
                    if (Oe.importHistory) {
                        Je.history().set(t.history)
                    }
                    o()
                });
                return ae
            },
            save_state: function(e, t, n) {
                if (typeof n !== "undefined") {
                    save_state[n] = ae.export_view()
                } else {
                    save_state.push(ae.export_view())
                }
                if (!$.isArray(hash_commands)) {
                    hash_commands = []
                }
                if (e !== undefined && !t) {
                    var r = [ve, save_state.length - 1, e];
                    hash_commands.push(r);
                    R()
                }
                return ae
            },
            exec: function(r, i, u) {
                function a(e) {
                    var t = L(r, e, true);
                    unpromise(t, function() {
                        De = null;
                        s.resolve()
                    }, function() {
                        De = null;
                        s.reject()
                    })
                }
                if (i && typeof i === "object") {
                    u = i;
                    i = null
                }
                var o = $.extend({
                    deferred: null,
                    silent: false,
                    typing: false,
                    delay: Oe.execAnimationDelay
                }, u);
                if (i === null) {
                    i = o.silent
                }
                if (!is_deferred(o.deferred)) {
                    o.deferred = new $.Deferred
                }
                var s = o.deferred;
                $e(function e() {
                    if ($.isArray(r)) {
                        (function e() {
                            var t = r.shift();
                            if (t) {
                                ae.exec(t, i, u).done(e)
                            } else {
                                s.resolve()
                            }
                        })()
                    } else if (qe) {
                        je.push([r, i, o])
                    } else if (o.typing && !i) {
                        var t = o.delay;
                        qe = true;
                        var n = ae.typing("enter", t, r, {
                            delay: t
                        });
                        n.then(function() {
                            qe = false;
                            a(true)
                        });
                        s.then(function() {
                            qe = false
                        })
                    } else {
                        a(i)
                    }
                });
                return s.promise()
            },
            autologin: function(e, t, n) {
                ae.trigger("terminal.autologin", [e, t, n]);
                return ae
            },
            login: function(r, i, u, a) {
                Ce.push([].slice.call(arguments));
                if (Be) {
                    throw new Error(sprintf(ue().notWhileLogin, "login"))
                }
                if (!is_function(r)) {
                    throw new Error(ue().loginIsNotAFunction)
                }
                Be = true;
                if (ae.token() && ae.level() === 1 && !Ue) {
                    Be = false;
                    ae.logout(true)
                } else if (ae.token(true) && ae.login_name(true)) {
                    Be = false;
                    if (is_function(u)) {
                        u()
                    }
                    return ae
                }
                if (Oe.history) {
                    Je.history().disable()
                }

                function o() {
                    while (ae.level() > e) {
                        ae.pop(undefined, true)
                    }
                    if (Oe.history) {
                        Je.history().enable()
                    }
                }
                var e = ae.level();

                function s(e, t, n) {
                    if (t) {
                        o();
                        var r = ae.prefix_name(true) + "_";
                        Me.set(r + "token", t);
                        Me.set(r + "login", e);
                        Be = false;
                        M("onAfterLogin", [e, t]);
                        if (is_function(u)) {
                            u()
                        }
                    } else {
                        if (i) {
                            if (!n) {
                                ae.error(ue().wrongPasswordTryAgain)
                            }
                            ae.pop(undefined, true).set_mask(false)
                        } else {
                            Be = false;
                            if (!n) {
                                ae.error(ue().wrongPassword)
                            }
                            ae.pop(undefined, true).pop(undefined, true)
                        }
                        if (is_function(a)) {
                            a()
                        }
                    }
                    if (ae.paused()) {
                        ae.resume()
                    }
                    ae.off("terminal.autologin")
                }
                ae.on("terminal.autologin", function(e, t, n, r) {
                    if (M("onBeforeLogin", [t, n]) === false) {
                        return
                    }
                    s(t, n, r)
                });
                ae.push(function(n) {
                    ae.set_mask(Oe.maskChar).push(function(e) {
                        try {
                            if (M("onBeforeLogin", [n, e]) === false) {
                                o();
                                return
                            }
                            ae.pause();
                            var t = r.call(ae, n, e, function(e, t) {
                                s(n, e, t)
                            });
                            if (t && is_function(t.then || t.done)) {
                                (t.then || t.done).call(t, function(e) {
                                    s(n, e)
                                }).catch(function(e) {
                                    ae.pop(undefined, true).pop(undefined, true);
                                    ae.error(e.message);
                                    if (is_function(a)) {
                                        a()
                                    }
                                    if (ae.paused()) {
                                        ae.resume()
                                    }
                                    ae.off("terminal.autologin")
                                })
                            }
                        } catch (e) {
                            y(e, "AUTH")
                        }
                    }, {
                        prompt: ue().password + ": ",
                        name: "password"
                    })
                }, {
                    prompt: ue().login + ": ",
                    name: "login"
                });
                return ae
            },
            settings: function() {
                return Oe
            },
            before_cursor: function(e) {
                var t = Je.position();
                var n = Je.get().slice(0, t);
                var r = n.split(/\s/);
                var i;
                if (e) {
                    if (r.length === 1) {
                        i = r[0]
                    } else {
                        var u = n.match(/(\\?")/g);
                        var a = u ? u.filter(function(e) {
                            return !e.match(/^\\/)
                        }).length : 0;
                        u = n.match(/'/g);
                        var o = u ? u.length : 0;
                        if (o % 2 === 1) {
                            i = n.match(/('[^']*)$/)[0]
                        } else if (a % 2 === 1) {
                            i = n.match(/("(?:[^"]|\\")*)$/)[0]
                        } else {
                            i = r[r.length - 1];
                            for (tt = r.length - 1; tt > 0; tt--) {
                                var s = r[tt - 1];
                                if (s[s.length - 1] === "\\") {
                                    i = r[tt - 1] + " " + i
                                } else {
                                    break
                                }
                            }
                        }
                    }
                } else {
                    i = n
                }
                return i
            },
            complete: function(r, i) {
                i = $.extend({
                    word: true,
                    echo: false,
                    escape: true,
                    echoCommand: false,
                    caseSensitive: true,
                    doubleTab: null
                }, i || {});
                var u = i.caseSensitive;
                var a = ae.before_cursor(i.word).replace(/\\"/g, '"');
                var s = false;
                if (i.word) {
                    if (a.match(/^"/)) {
                        s = '"'
                    } else if (a.match(/^'/)) {
                        s = "'"
                    }
                    if (s) {
                        a = a.replace(/^["']/, "")
                    }
                }
                if (de % 2 === 0) {
                    be = ae.before_cursor(i.word)
                } else {
                    var e = ae.before_cursor(i.word);
                    if (e !== be) {
                        return
                    }
                }
                var t = $.terminal.escape_regex(a);
                if (i.escape) {
                    t = t.replace(/(\\+)(["'() ])/g, function(e, t, n) {
                        if (n.match(/[()]/)) {
                            return t + "\\?\\" + n
                        } else {
                            return t + "?" + n
                        }
                    })
                }

                function o(e) {
                    if (s === '"') {
                        e = e.replace(/"/g, '\\"')
                    }
                    if (!s && i.escape) {
                        e = e.replace(/(["'() ])/g, "\\$1")
                    }
                    return e
                }

                function n() {
                    var e = [];
                    for (var t = r.length; t--;) {
                        if (r[t].match(/\n/) && i.word) {
                            warn("If you use commands with newlines you " + "should use word option for complete or" + " wordAutocomplete terminal option")
                        }
                        if (f.test(r[t])) {
                            var n = o(r[t]);
                            if (!u && same_case(n)) {
                                if (a.toLowerCase() === a) {
                                    n = n.toLowerCase()
                                } else if (a.toUpperCase() === a) {
                                    n = n.toUpperCase()
                                }
                            }
                            e.push(n)
                        }
                    }
                    return e
                }
                var l = u ? "" : "i";
                var f = new RegExp("^" + t, l);
                var c = n();

                function p(e, t) {
                    var n = ae.get_command();
                    var r = ae.get_position();
                    var i = new RegExp("^" + e, "i");
                    var u = n.slice(0, r);
                    var a = n.slice(r);
                    var o = t.replace(i, "") + (s || "");
                    ae.set_command(u + o + a);
                    ae.set_position((u + o).length)
                }
                if (c.length === 1) {
                    if (i.escape) {
                        p(t, c[0])
                    } else {
                        ae.insert(c[0].replace(f, "") + (s || ""))
                    }
                    be = ae.before_cursor(i.word);
                    return true
                } else if (c.length > 1) {
                    if (++de >= 2) {
                        de = 0;
                        if (i.echo) {
                            if (is_function(i.doubleTab)) {
                                if (i.echoCommand) {
                                    A()
                                }
                                var D = i.doubleTab.call(ae, a, c, A);
                                if (typeof D === "undefined") {
                                    return true
                                } else {
                                    return D
                                }
                            } else if (i.doubleTab !== false) {
                                A();
                                var m = c.slice().reverse().join("\t\t");
                                ae.echo($.terminal.escape_brackets(m), {
                                    keepWords: true,
                                    formatters: false
                                })
                            }
                            return true
                        }
                    } else {
                        var d = common_string(o(a), c, u);
                        if (d) {
                            p(t, d);
                            be = ae.before_cursor(i.word);
                            return true
                        }
                    }
                }
            },
            commands: function() {
                return Ke.top().interpreter
            },
            set_interpreter: function(e, t) {
                var n = $.Deferred();

                function r() {
                    ae.pause(Oe.softPause);
                    g(e, t, function(e) {
                        ae.resume();
                        var t = Ke.top();
                        $.extend(t, e);
                        N(true);
                        n.resolve()
                    })
                }
                if (is_function(t)) {
                    ae.login(t, true, r)
                } else if (get_type(e) === "string" && t) {
                    ae.login(_(e, t), true, r)
                } else {
                    r()
                }
                return n.promise()
            },
            greetings: function() {
                k();
                return ae
            },
            paused: function() {
                return qe
            },
            pause: function(t) {
                $e(function e() {
                    Te();
                    qe = true;
                    Je.disable(t || is_android);
                    if (!t) {
                        Je.find(".cmd-prompt").hidden()
                    }
                    M("onPause")
                });
                return ae
            },
            resume: function(i) {
                $e(function e() {
                    qe = false;
                    if (He && terminals.front() === ae) {
                        Je.enable(i)
                    }
                    Je.find(".cmd-prompt").visible();
                    var t = je;
                    je = [];
                    for (var n = 0; n < t.length; ++n) {
                        ae.exec.apply(ae, t[n])
                    }
                    ae.trigger("resume");
                    var r = O.shift();
                    if (r) {
                        r()
                    }
                    ae.scroll_to_bottom();
                    M("onResume")
                });
                return ae
            },
            cols: function() {
                if (Oe.numChars) {
                    return Oe.numChars
                }
                if (!_e || _e === 1e3) {
                    _e = get_num_chars(ae, Le)
                }
                return _e
            },
            rows: function() {
                if (Oe.numRows) {
                    return Oe.numRows
                }
                if (!ye) {
                    ye = get_num_rows(ae, Le)
                }
                return ye
            },
            history: function() {
                return Je.history()
            },
            geometry: function() {
                var t = window.getComputedStyle(ae[0]);

                function e(e) {
                    return parseInt(t.getPropertyValue("padding-" + e), 10) || 0
                }
                var n = e("left");
                var r = e("right");
                var i = e("top");
                var u = e("bottom");
                return {
                    terminal: {
                        padding: {
                            left: n,
                            right: r,
                            top: i,
                            bottom: u
                        },
                        width: Se + n + r,
                        height: Re + i + u
                    },
                    char: Le,
                    cols: this.cols(),
                    rows: this.rows()
                }
            },
            history_state: function(e) {
                function t() {
                    Oe.historyState = true;
                    if (!save_state.length) {
                        ae.save_state()
                    } else if (terminals.length() > 1) {
                        ae.save_state(null)
                    }
                }
                if (e) {
                    if (typeof window.setImmediate === "undefined") {
                        setTimeout(t, 0)
                    } else {
                        setImmediate(t)
                    }
                } else {
                    Oe.historyState = false
                }
                return ae
            },
            clear_history_state: function() {
                hash_commands = [];
                save_state = [];
                return ae
            },
            next: function() {
                if (terminals.length() === 1) {
                    return ae
                } else {
                    terminals.front().disable();
                    var e = terminals.rotate().enable();
                    var t = e.offset().top - 50;
                    $("html,body").animate({
                        scrollTop: t
                    }, 500);
                    try {
                        trigger_terminal_change(e)
                    } catch (e) {
                        y(e, "onTerminalChange")
                    }
                    return e
                }
            },
            focus: function(n, r) {
                $e(function e() {
                    if (terminals.length() === 1) {
                        if (n === false) {
                            ae.disable(r)
                        } else {
                            ae.enable(r)
                        }
                    } else if (n === false) {
                        ae.next()
                    } else {
                        var t = terminals.front();
                        if (t !== ae) {
                            terminals.forEach(function(e) {
                                if (e !== ae && e.enabled()) {
                                    e.disable(r)
                                }
                            });
                            if (!r) {
                                try {
                                    trigger_terminal_change(ae)
                                } catch (e) {
                                    y(e, "onTerminalChange")
                                }
                            }
                        }
                        terminals.set(ae);
                        ae.enable(r)
                    }
                });
                return ae
            },
            freeze: function(t) {
                xe(function e() {
                    if (t) {
                        ae.disable();
                        We = true
                    } else {
                        We = false;
                        ae.enable()
                    }
                });
                return ae
            },
            frozen: function() {
                return We
            },
            enable: function(n) {
                if (!He && !We) {
                    if (_e === undefined) {
                        ae.resize()
                    }
                    $e(function e() {
                        var t;
                        if (!n && !He) {
                            M("onFocus")
                        }
                        if (!n && t === undefined || n) {
                            He = true;
                            if (!ae.paused()) {
                                Je.enable(true)
                            }
                        }
                    })
                }
                return ae
            },
            clear_cache: "Map" in root ? function() {
                Pe.clear_cache();
                F.clear();
                return ae
            } : function() {
                return ae
            },
            disable: function(n) {
                $e(function e() {
                    var t;
                    if (!n && He) {
                        t = M("onBlur")
                    }
                    if (!n && t === undefined || n) {
                        He = false;
                        Je.disable()
                    }
                });
                return ae
            },
            enabled: function() {
                return He
            },
            signature: function() {
                var e = ae.cols();
                for (var t = signatures.length; t--;) {
                    var n = signatures[t].map(function(e) {
                        return e.length
                    });
                    if (Math.max.apply(null, n) <= e) {
                        return signatures[t].join("\n") + "\n"
                    }
                }
                return ""
            },
            version: function() {
                return $.terminal.version
            },
            cmd: function() {
                return Je
            },
            get_command: function() {
                return Je.get()
            },
            enter: re("enter", A),
            set_command: function(t, n) {
                xe(function e() {
                    if (typeof t !== "string") {
                        t = JSON.stringify(t)
                    }
                    Je.set(t, undefined, n)
                });
                return ae
            },
            set_position: function(t, n) {
                xe(function e() {
                    Je.position(t, n)
                });
                return ae
            },
            get_position: function() {
                return Je.position()
            },
            insert: function(u, e) {
                if (typeof u === "string") {
                    var a;
                    var t = {
                        stay: false,
                        typing: false,
                        delay: 100
                    };
                    if (!is_object(e)) {
                        e = {
                            stay: e
                        }
                    }
                    a = $.extend(t, e);
                    var o = new $.Deferred;
                    xe(function e() {
                        function t() {
                            if (Oe.scrollOnEcho || n) {
                                ae.scroll_to_bottom()
                            }
                        }
                        var n = ae.is_bottom();
                        if (a.typing) {
                            var r = a.delay;
                            var i = ae.typing("insert", r, u, Oe);
                            i.then(function() {
                                t();
                                o.resolve()
                            })
                        } else {
                            Je.insert(u, Oe.stay);
                            t()
                        }
                    });
                    if (a.typing) {
                        return o.promise()
                    }
                    return ae
                } else {
                    throw new Error(sprintf(ue().notAString, "insert"))
                }
            },
            set_prompt: re("prompt", function(t) {
                if (is_function(t)) {
                    Je.prompt(function(e) {
                        return t.call(ae, e, ae)
                    })
                } else {
                    Je.prompt(t)
                }
            }, function(e) {
                Ke.top().prompt = e
            }),
            get_prompt: function() {
                return Ke.top().prompt
            },
            set_mask: function(t) {
                xe(function e() {
                    Je.mask(t === true ? Oe.maskChar : t)
                });
                return ae
            },
            get_output: function(e) {
                if (e) {
                    return Ne.data()
                } else {
                    return Ne.get_snapshot()
                }
            },
            resize: function(e, t) {
                if (!ae.is(":visible")) {
                    ae.stopTime("resize");
                    ae.oneTime(500, "resize", function() {
                        ae.resize(e, t)
                    })
                } else {
                    if (e && t) {
                        ae.width(e);
                        ae.height(t)
                    }
                    e = ae.width();
                    t = ae.height();
                    if (typeof Oe.numChars !== "undefined" || typeof Oe.numRows !== "undefined") {
                        if (typeof Oe.numChars !== "undefined") {
                            Je.resize(Oe.numChars);
                            ae.refresh()
                        }
                        M("onResize");
                        return
                    }
                    var n = get_num_chars(ae, Le);
                    var r = get_num_rows(ae, Le);
                    if (n !== _e || r !== ye) {
                        ae.clear_cache();
                        var i = n !== _e;
                        _e = n;
                        ye = r;
                        if (i) {
                            Je.resize(_e);
                            ae.refresh()
                        }
                        M("onResize")
                    }
                }
                return ae
            },
            refresh: function() {
                if (Le.width !== 0) {
                    ae[0].style.setProperty("--char-width", Le.width)
                }
                ae.clear_cache();
                if (be) {
                    Je.resize()
                }
                o({
                    scroll: false,
                    update: true
                });
                return ae
            },
            flush: function(g) {
                g = $.extend({}, {
                    update: false,
                    scroll: true
                }, g || {});
                xe(function e() {
                    try {
                        if (Pe.is_empty()) {
                            return ae
                        }
                        var t = ae.is_bottom();
                        var u = Oe.scrollOnEcho && g.scroll || t;
                        var a;
                        var o = true;
                        var s = false;
                        var l = $();
                        var f;
                        if (!g.update) {
                            l = ae.find(".partial");
                            f = Ne.get_partial()
                        }
                        Pe.flush(function(e) {
                            if (!e) {
                                if (!l.length) {
                                    a = $("<div/>");
                                    f = []
                                } else if (o) {
                                    o = false;
                                    s = true;
                                    a = l
                                }
                            } else if (is_function(e.finalize)) {
                                if (u) {
                                    a.find("img").on("load", function() {
                                        ae.scroll_to_bottom()
                                    })
                                }
                                if (g.update) {
                                    Ne.update_snapshot(e.index, f);
                                    var t = "> div[data-index=" + e.index + "]";
                                    var n = he.find(t);
                                    if (n.html() !== a.html()) {
                                        n.replaceWith(a)
                                    }
                                } else {
                                    a.appendTo(he);
                                    if (!l.length) {
                                        Ne.make_snapshot(f)
                                    }
                                }
                                a.attr("data-index", e.index);
                                s = !e.newline;
                                a.toggleClass("partial", s);
                                if (s) {
                                    l = a
                                }
                                e.finalize(a)
                            } else {
                                var r = e.line;
                                var i;
                                if (typeof e.raw === "string") {
                                    if (s) {
                                        f[f.length - 1] += e.raw
                                    } else {
                                        f.push(e.raw)
                                    }
                                }
                                if (s) {
                                    i = a.children().last().append(r);
                                    s = false
                                } else {
                                    i = $("<div/>").html(r);
                                    if (e.newline) {
                                        i.addClass("cmd-end-line")
                                    }
                                    a.append(i)
                                }
                                i.css("width", "100%")
                            }
                        });
                        var n = ae.find(".cmd-prompt");
                        var r = ae.find(".cmd");
                        l = ae.find(".partial");
                        var i;
                        if (l.length === 0) {
                            n.css("margin-left", 0);
                            r.css("top", 0);
                            Je.__set_prompt_margin(0);
                            i = ae.find(".terminal-output div:last-child" + " div:last-child");
                            if (i.css("display") === "inline-block") {
                                i.css({
                                    width: "100%",
                                    display: ""
                                })
                            }
                        } else {
                            i = l.children().last();
                            i.css({
                                width: "",
                                display: "inline-block"
                            });
                            var c = i[0].getBoundingClientRect();
                            var p = c.width;
                            n.css("margin-left", p);
                            r.css("top", -c.height);
                            var D = ae.geometry().char.width;
                            var m = Math.round(p / D);
                            Je.__set_prompt_margin(m)
                        }
                        x();
                        M("onFlush");
                        var d = ae.find(".cmd-cursor");
                        var h = ae.find(".cmd").offset();
                        var v = ae.offset();
                        ae.stopTime("flush").oneTime(1, "flush", function() {
                            css(ae[0], {
                                "--terminal-height": ae.height(),
                                "--terminal-x": h.left - v.left,
                                "--terminal-y": h.top - v.top,
                                "--terminal-scroll": ae.prop("scrollTop")
                            });
                            if (He) {
                                d.hide();
                                ae.oneTime(1, "flush", function() {
                                    d.show()
                                })
                            }
                        });
                        if (u) {
                            ae.scroll_to_bottom()
                        }
                    } catch (e) {
                        if (is_function(Oe.exceptionHandler)) {
                            try {
                                Oe.exceptionHandler.call(ae, e, "TERMINAL (Flush)")
                            } catch (e) {
                                Oe.exceptionHandler = $.noop;
                                alert_exception("[exceptionHandler]", e)
                            }
                        } else {
                            alert_exception("[Flush]", e)
                        }
                    } finally {
                        Pe.clear()
                    }
                });
                return ae
            },
            update: function(r, t, i) {
                xe(function e() {
                    if (r < 0) {
                        r = Ne.length() + r
                    }
                    if (!Ne.valid_index(r)) {
                        ae.error("Invalid line number " + r)
                    } else if (t === null) {
                        Ne.update(r, null);
                        he.find("[data-index=" + r + "]").remove()
                    } else {
                        t = s(t, {
                            update: true,
                            line: r
                        });
                        if (t === false) {
                            return ae
                        }
                        unpromise(t, function(e) {
                            var t = a(e, i);
                            if (t) {
                                e = t[0];
                                i = t[1]
                            }
                            i = Ne.update(r, e, i);
                            var n = E({
                                value: e,
                                index: r,
                                options: i
                            });
                            unpromise(n, function() {
                                ae.flush({
                                    scroll: false,
                                    update: true
                                })
                            })
                        })
                    }
                });
                return ae
            },
            remove_line: function(e) {
                return ae.update(e, null)
            },
            last_index: function() {
                return Ne.length() - 1
            },
            echo: function(e, r) {
                var a = arguments.length > 0;
                var o = new $.Deferred;

                function t(i) {
                    try {
                        var u = $.extend({
                            flush: true,
                            exec: true,
                            raw: Oe.raw,
                            finalize: $.noop,
                            unmount: $.noop,
                            delay: Oe.execAnimationDelay,
                            ansi: false,
                            typing: false,
                            keepWords: false,
                            invokeMethods: Oe.invokeMethods,
                            onClear: null,
                            formatters: true,
                            allowedAttributes: Oe.allowedAttributes,
                            newline: true
                        }, r || {});
                        (function(n) {
                            u.finalize = function(e) {
                                if (u.raw) {
                                    e.addClass("raw")
                                }
                                if (u.ansi) {
                                    e.addClass("ansi")
                                }
                                try {
                                    if (is_function(n)) {
                                        n.call(ae, e)
                                    }
                                    var t = e.find("img");
                                    t.each(function() {
                                        var e = $(this);
                                        var t = new Image;
                                        t.onerror = function() {
                                            e.replaceWith(use_broken_image)
                                        };
                                        t.src = this.src
                                    })
                                } catch (e) {
                                    y(e, "USER:echo(finalize)");
                                    n = null
                                }
                            }
                        })(u.finalize);
                        if (u.flush) {
                            if (!Pe.empty()) {
                                ae.flush()
                            }
                        }
                        if (M("onBeforeEcho", [i]) === false) {
                            return
                        }
                        if (u.typing) {
                            if (typeof i !== "string") {
                                return o.reject("echo: Typing animation require string" + " or promise that resolve to string")
                            }
                            if (typeof u.delay !== "number" || isNaN(u.delay)) {
                                return o.reject("echo: Invalid argument, delay need to" + " be a number")
                            }
                            var e = ae.typing("echo", u.delay, i, u);
                            e.then(function() {
                                o.resolve()
                            });
                            return
                        }
                        var t;
                        if (typeof i === "function") {
                            t = i.bind(ae)
                        } else if (typeof i === "undefined") {
                            if (a) {
                                t = String(i)
                            } else {
                                t = ""
                            }
                        } else {
                            var n = s(i, {});
                            if (n === false) {
                                return ae
                            }
                            t = n
                        }
                        if (is_promise(t)) {
                            pe = true
                        }
                        unpromise(t, function(e) {
                            if (l(e, u)) {
                                return ae
                            }
                            var t = Ne.length();
                            var n = Ne.has_newline();
                            if (!n) {
                                t--
                            }
                            if (!u.newline && e[e.length - 1] === "\n") {
                                e = e.slice(0, -1);
                                u.newline = true
                            }
                            var r = E({
                                value: e,
                                options: u,
                                index: t
                            });
                            if (is_promise(r)) {
                                pe = true
                            }
                            Ne.push([e, u]);
                            unpromise(r, function() {
                                if (u.flush) {
                                    ae.flush();
                                    M("onAfterEcho", [i])
                                }
                                pe = false;
                                var e = ce;
                                ce = [];
                                for (var t = 0; t < e.length; ++t) {
                                    ae.echo.apply(ae, e[t])
                                }
                            })
                        })
                    } catch (e) {
                        if (is_function(Oe.exceptionHandler)) {
                            Oe.exceptionHandler.call(ae, e, "TERMINAL (echo)")
                        } else {
                            alert_exception("[Terminal.echo]", e)
                        }
                    }
                }
                if (pe) {
                    ce.push([e, r])
                } else {
                    t(e)
                }
                if (r && r.typing) {
                    return o.promise()
                }
                return ae
            },
            typing: function(t, e, n, r) {
                var i = new $.Deferred;
                var u;
                var a;
                if (typeof r === "object") {
                    a = r.finalize || $.noop;
                    u = $.extend({}, r, {
                        delay: e,
                        finalize: o
                    })
                } else {
                    a = r || $.noop;
                    u = {
                        delay: e,
                        finalize: o
                    }
                }

                function o() {
                    i.resolve();
                    if (is_function(a)) {
                        a.apply(ae, arguments)
                    }
                }
                var s = ["prompt", "echo", "enter", "insert"];

                function l() {
                    return s.indexOf(t) >= 0
                }
                xe(function e() {
                    if (l()) {
                        if (t === "prompt") {
                            Z(n, u)
                        } else if (t === "echo") {
                            te(n, u)
                        } else if (t === "enter") {
                            with_prompt(ae.get_prompt(), function(e) {
                                ne(e, n, u)
                            }, ae)
                        } else if (t === "insert") {
                            with_prompt(ae.get_prompt(), function(e) {
                                ee(e, n, u)
                            }, ae)
                        }
                    } else {
                        i.reject("Invalid type only `echo` and `prompt` are supported")
                    }
                });
                return i.promise()
            },
            error: function(e, t) {
                t = $.extend({}, t, {
                    raw: false,
                    formatters: false
                });

                function n(e) {
                    if (typeof e !== "string") {
                        e = String(e)
                    }
                    var t = $.terminal.escape_brackets(e).replace(/\\$/, "&#92;").replace(url_re, "]$1[[;;;terminal-error]");
                    return "[[;;;terminal-error]" + t + "]"
                }
                if (typeof e === "function") {
                    return ae.echo(function() {
                        return n(e.call(ae))
                    }, t)
                }
                if (e && e.then) {
                    e.then(function(e) {
                        ae.echo(n(e))
                    }).catch(S("Echo Error"));
                    return ae
                }
                return ae.echo(n(e), t)
            },
            exception: function(r, e) {
                var t = exception_message(r);
                if (e) {
                    t = "&#91;" + e + "&#93;: " + t
                }
                if (t) {
                    ae.error(t, {
                        finalize: function(e) {
                            e.addClass("terminal-exception terminal-message")
                        },
                        keepWords: true
                    })
                }
                if (typeof r.fileName === "string") {
                    ae.pause(Oe.softPause);
                    $.get(r.fileName, function(e) {
                        var t = r.lineNumber - 1;
                        var n = e.split("\n")[t];
                        if (n) {
                            ae.error("[" + r.lineNumber + "]: " + n)
                        }
                        ae.resume()
                    }, "text")
                }
                if (r.stack) {
                    var n = $.terminal.escape_brackets(r.stack);
                    var i = n.split(/\n/g).map(function(e) {
                        return "[[;;;terminal-error]" + e.replace(url_re, function(e) {
                            return "]" + e + "[[;;;terminal-error]"
                        }) + "]"
                    }).join("\n");
                    ae.echo(i, {
                        finalize: function(e) {
                            e.addClass("terminal-exception terminal-stack-trace")
                        },
                        formatters: false
                    })
                }
                return ae
            },
            scroll: function(e) {
                var t;
                e = Math.round(e);
                if (ae.prop) {
                    if (e > ae.prop("scrollTop") && e > 0) {
                        ae.prop("scrollTop", 0)
                    }
                    t = ae.prop("scrollTop");
                    ae.scrollTop(t + e)
                } else {
                    if (e > ae.prop("scrollTop") && e > 0) {
                        ae.prop("scrollTop", 0)
                    }
                    t = ae.prop("scrollTop");
                    ae.scrollTop(t + e)
                }
                return ae
            },
            logout: function(n) {
                if (Be) {
                    throw new Error(sprintf(ue().notWhileLogin, "logout"))
                }
                xe(function e() {
                    if (n) {
                        var t = Ce.pop();
                        ae.set_token(undefined, true);
                        ae.login.apply(ae, t)
                    } else if (Ke.size() === 1 && ae.token()) {
                        ae.logout(true)
                    } else {
                        while (Ke.size() > 1) {
                            if (ae.token()) {
                                ae.logout(true).pop().pop()
                            } else {
                                ae.pop()
                            }
                        }
                    }
                });
                return ae
            },
            token: function(e) {
                return Me.get(ae.prefix_name(e) + "_token")
            },
            set_token: function(e, t) {
                var n = ae.prefix_name(t) + "_token";
                if (typeof e === "undefined") {
                    Me.remove(n)
                } else {
                    Me.set(n, e)
                }
                return ae
            },
            get_token: function(e) {
                return ae.token(e)
            },
            login_name: function(e) {
                return Me.get(ae.prefix_name(e) + "_login")
            },
            name: function() {
                return Ke.top().name
            },
            prefix_name: function(e) {
                var t = (Oe.name ? Oe.name + "_" : "") + ve;
                if (e && Ke.size() > 1) {
                    var n = Ke.map(function(e) {
                        return e.name || ""
                    }).slice(1).join("_");
                    if (n) {
                        t += "_" + n
                    }
                }
                return t
            },
            read: function(e, t, n) {
                var r;
                if (typeof arguments[1] === "object") {
                    r = $.extend({
                        typing: false,
                        delay: Oe.execAnimationDelay,
                        success: $.noop,
                        cancel: $.noop
                    }, arguments[1])
                } else {
                    r = {
                        typing: false,
                        success: t || $.noop,
                        cancel: n || $.noop
                    }
                }
                if (r.typing) {
                    var i = ae.get_prompt();
                    r.typing = false;
                    return ae.typing("prompt", r.delay, e).then(function() {
                        return ae.set_prompt(i).read(e, r)
                    })
                }
                ge = true;
                var u = jQuery.Deferred();
                var a = false;
                ae.push(function(e) {
                    a = true;
                    u.resolve(e);
                    if (is_function(r.success)) {
                        r.success(e)
                    }
                    ae.pop();
                    if (Oe.history) {
                        Je.history().enable()
                    }
                }, {
                    name: "read",
                    history: false,
                    prompt: e || "",
                    onExit: function() {
                        if (!a) {
                            u.reject();
                            if (is_function(r.cancel)) {
                                r.cancel()
                            }
                        }
                    }
                });
                if (Oe.history) {
                    Je.history().disable()
                }
                return u.promise()
            },
            push: function(a, o) {
                $e(function e() {
                    o = o || {};
                    var t = {
                        infiniteLogin: false
                    };
                    var r = $.extend({}, t, o);
                    if (!r.name && De) {
                        r.name = De.name
                    }
                    if (r.prompt === undefined) {
                        r.prompt = (r.name || ">") + " "
                    }
                    var n = Ke.top();
                    if (n) {
                        n.mask = Je.mask()
                    }
                    var i = qe;

                    function u() {
                        M("onPush", [n, Ke.top()]);
                        N()
                    }
                    g(a, o.login, function(e) {
                        Ke.push($.extend({}, e, r));
                        if (r.completion === true) {
                            if ($.isArray(e.completion)) {
                                Ke.top().completion = e.completion
                            } else if (!e.completion) {
                                Ke.top().completion = false
                            }
                        }
                        if (r.login) {
                            var t;
                            var n = get_type(r.login);
                            if (n === "function") {
                                t = r.infiniteLogin ? $.noop : ae.pop;
                                ae.login(r.login, r.infiniteLogin, u, t)
                            } else if (get_type(a) === "string" && n === "string" || n === "boolean") {
                                t = r.infiniteLogin ? $.noop : ae.pop;
                                ae.login(_(a, r.login), r.infiniteLogin, u, t)
                            }
                        } else {
                            u()
                        }
                        if (!i && ae.enabled()) {
                            ae.resume()
                        }
                    })
                });
                return ae
            },
            pop: function(e, t) {
                if (e !== undefined) {
                    A(e)
                }
                var n = ae.token(true);
                var r;
                if (Ke.size() === 1) {
                    r = Ke.top();
                    if (Oe.login) {
                        if (!t) {
                            M("onPop", [r, null])
                        }
                        I();
                        M("onExit")
                    } else {
                        ae.error(ue().canExitError)
                    }
                } else {
                    if (n) {
                        z()
                    }
                    var i = Ke.pop();
                    r = Ke.top();
                    N();
                    ae.set_mask(r.mask);
                    if (!t) {
                        M("onPop", [i, r])
                    }
                    if (Be && ae.get_prompt() !== ue().login + ": ") {
                        Be = false
                    }
                    if (is_function(i.onExit)) {
                        try {
                            i.onExit.call(ae, ae)
                        } catch (e) {
                            i.onExit = $.noop;
                            y(e, "onExit")
                        }
                    }
                }
                return ae
            },
            option: function(e, t) {
                if (typeof t === "undefined") {
                    if (typeof e === "string") {
                        return Oe[e]
                    } else if (typeof e === "object") {
                        $.each(e, function(e, t) {
                            Oe[e] = t
                        })
                    }
                } else {
                    Oe[e] = t;
                    if (e.match(/^num(Chars|Rows)$/)) {
                        o()
                    }
                }
                return ae
            },
            invoke_key: function(e) {
                Je.invoke_key(e);
                return ae
            },
            keymap: function(e, n) {
                if (arguments.length === 0) {
                    return Je.keymap()
                }
                if (typeof n === "undefined") {
                    if (typeof e === "string") {
                        return Je.keymap(e)
                    } else if ($.isPlainObject(e)) {
                        e = $.extend({}, lt, $.omap(e || {}, function(n, r) {
                            if (!lt[n]) {
                                return r.bind(ae)
                            }
                            return function(e, t) {
                                return r.call(ae, e, function() {
                                    return lt[n](e, t)
                                })
                            }
                        }));
                        Je.keymap(null).keymap(e)
                    }
                } else if (typeof n === "function") {
                    var r = e;
                    if (!lt[r]) {
                        Je.keymap(r, n.bind(ae))
                    } else {
                        Je.keymap(r, function(e, t) {
                            return n.call(ae, e, function() {
                                return lt[r](e, t)
                            })
                        })
                    }
                }
            },
            level: function() {
                return Ke.size()
            },
            reset: function() {
                xe(function e() {
                    ae.clear();
                    while (Ke.size() > 1) {
                        Ke.pop()
                    }
                    K()
                });
                return ae
            },
            purge: function() {
                xe(function e() {
                    var t = ae.prefix_name() + "_";
                    var n = Me.get(t + "interpreters");
                    if (n) {
                        $.each(JSON.parse(n), function(e, t) {
                            Me.remove(t + "_commands");
                            Me.remove(t + "_token");
                            Me.remove(t + "_login")
                        })
                    }
                    Je.purge();
                    Me.remove(t + "interpreters")
                });
                return ae
            },
            destroy: function() {
                xe(function e() {
                    Je.destroy().remove();
                    ae.resizer("unbind");
                    ae.touch_scroll("unbind");
                    Xe.resizer("unbind").remove();
                    $(document).unbind(".terminal_" + ae.id());
                    $(window).unbind(".terminal_" + ae.id());
                    ae.unbind("click wheel mousewheel mousedown mouseup");
                    ae.removeData("terminal").removeClass("terminal").unbind(".terminal");
                    if (Oe.width) {
                        ae.css("width", "")
                    }
                    if (Oe.height) {
                        ae.css("height", "")
                    }
                    $(window).off("blur", ut).off("focus", it);
                    ae.find(".terminal-fill, .terminal-font").remove();
                    ae.stopTime();
                    terminals.remove(ve);
                    if (Ye) {
                        if (Ye.unobserve) {
                            Ye.unobserve(ae[0])
                        } else {
                            clearInterval(Ye)
                        }
                    }
                    var t = ae.find(".terminal-scroll-marker");
                    if (Ae) {
                        Ae.unobserve(t[0])
                    }
                    t.remove();
                    if (Ve) {
                        Ve.disconnect()
                    }
                    if (!terminals.length()) {
                        $(window).off("hashchange")
                    }
                    if (is_mobile) {
                        ae.off(["touchstart.terminal", "touchmove.terminal", "touchend.terminal"].join(" "))
                    }
                    he.remove();
                    Ge.remove();
                    if (oe) {
                        var n = $(oe);
                        if (n.attr("class") === "full-screen-terminal") {
                            n.removeAttr("class")
                        } else {
                            n.removeClass("full-screen-terminal")
                        }
                        ae.remove()
                    }
                    ze = true
                });
                return ae
            },
            scroll_to: function(e) {
                var t = ae.scrollTop() - ae.offset().top + $(e).offset().top;
                ae.scrollTop(t);
                return ae
            },
            scroll_to_bottom: function() {
                var e;
                if (ae.prop) {
                    e = ae.prop("scrollHeight")
                } else {
                    e = ae.attr("scrollHeight")
                }
                ae.scrollTop(e);
                return ae
            },
            is_bottom: function() {
                if (Oe.scrollBottomOffset === -1) {
                    return false
                } else if (typeof ke === "boolean") {
                    return ke
                } else {
                    var e, t, n;
                    e = ae[0].scrollHeight;
                    t = ae[0].scrollTop;
                    n = ae[0].offsetHeight;
                    var r = e - Oe.scrollBottomOffset;
                    return t + n > r
                }
            },
            duplicate: function() {
                var e = $(ae);
                return $.extend(e, le)
            },
            get_output_buffer: function(e) {
                var r = $.extend({
                    html: false
                }, e);
                var i = [];
                var u = false;
                Pe.forEach(function(e) {
                    if (e) {
                        if (is_function(e.finalize)) {
                            u = !e.newline
                        } else {
                            var t;
                            if (r.html) {
                                t = e.line
                            } else {
                                t = e.raw
                            }
                            if (u) {
                                var n = i.length - 1;
                                i[n] += t
                            } else {
                                i.push(t)
                            }
                        }
                    }
                });
                if (r.html) {
                    return i.map(function(e) {
                        return "<div>" + e + "</div>"
                    }).join("\n")
                }
                return i.join("\n")
            },
            clear_buffer: function() {
                Pe.clear();
                return ae
            }
        }, function(t, e) {
            return function() {
                if (ze) {
                    if (!Oe.exceptionHandler) {
                        throw new $.terminal.Exception(ue().defunctTerminal)
                    }
                }
                try {
                    return e.apply(ae, [].slice.apply(arguments))
                } catch (e) {
                    if (t !== "exec" && t !== "resume") {
                        y(e, e.type || "TERMINAL", true)
                    }
                    if (!Oe.exceptionHandler) {
                        throw e
                    }
                }
            }
        });
        $.extend(ae, le);
        if (ae.length === 0) {
            var fe = sprintf(ue().invalidSelector);
            throw new $.terminal.Exception(fe)
        }
        ae.data("terminal", ae);
        var ce = [];
        var pe = false;
        var De;
        var me;
        var de = 0;
        var he;
        var ve = terminals.length();
        var ge = false;
        var _e;
        var ye;
        var be;
        var Ce = new Stack;
        var Fe = new DelayQueue;
        var we = false;
        var Ee = new DelayQueue;
        var xe = ie(Ee);
        var $e = ie(Fe);
        var ke;
        var Ae;
        var Be = false;
        var Te = $.noop;
        var Se, Re;
        var je = [];
        var Oe = $.extend({}, $.terminal.defaults, {
            name: ae.selector,
            exit: !!(t && t.login || !t)
        }, t || {});
        if (typeof Oe.width === "number") {
            ae.width(Oe.width)
        }
        if (typeof Oe.height === "number") {
            ae.height(Oe.height)
        }
        var Le = get_char_size(ae);
        var Ie = !terminal_ready(ae);
        delete Oe.formatters;
        var ze = false;
        var Pe = new FormatBuffer(function(e) {
            return {
                linksNoReferrer: Oe.linksNoReferrer,
                linksNoFollow: Oe.linksNoFollow,
                anyLinks: Oe.anyLinks,
                charWidth: Le.width,
                useCache: Oe.useCache,
                escape: false,
                allowedAttributes: e.allowedAttributes || []
            }
        });
        var Ne = new OutputLines(function() {
            return Oe
        });
        var Me = new n(Oe.memory);
        var He = Oe.enabled;
        var We = false;
        var qe = false;
        var Ue = true;
        var Ke;
        var Je;
        var Qe;
        var Ye;
        var Ve;
        if (Oe.ignoreSystemDescribe === true) {
            Oe.describe = false
        }
        $(document).bind("ajaxSend.terminal_" + ae.id(), function(e, t) {
            requests.push(t)
        });
        var Ge = $('<div class="terminal-wrapper"/>').appendTo(ae);
        $(broken_image).hide().appendTo(Ge);
        var Xe = $('<div class="terminal-font">&nbsp;</div>').appendTo(ae);
        var Ze = $('<div class="terminal-fill"/>').appendTo(ae);
        he = $("<div>").addClass("terminal-output").attr("role", "log").appendTo(Ge);
        ae.addClass("terminal");
        if (Oe.login && M("onBeforeLogin") === false) {
            Ue = false
        }
        var et;
        if (typeof e === "string") {
            et = e
        } else if (is_array(e)) {
            for (var tt = 0, nt = e.length; tt < nt; ++tt) {
                if (typeof e[tt] === "string") {
                    et = e[tt];
                    break
                }
            }
        }
        var rt;
        if (is_function(Oe.login)) {
            rt = Oe.login
        } else if (et && (typeof Oe.login === "string" || Oe.login === true)) {
            rt = _(et, Oe.login)
        }
        terminals.append(ae);

        function it() {
            if (Qe) {
                ae.focus();
                ae.scroll_to_bottom()
            }
        }

        function ut() {
            Qe = He;
            ae.disable().find(".cmd textarea").trigger("blur", [true])
        }

        function at(e) {
            if (is_function(e)) {
                e = e()
            }
            if (e && is_function(e.then)) {
                return e.then(at)
            }
            if (get_type(e) !== "string") {
                if (is_function(Oe.parseObject)) {
                    var t = Oe.parseObject(e);
                    if (get_type(t) === "string") {
                        e = t
                    }
                } else if (is_array(e)) {
                    e = $.terminal.columns(e, ae.cols(), Oe.tabs)
                } else {
                    e = String(e)
                }
            }
            return e
        }

        function ot(t) {
            if (t.proxy) {
                return t
            }
            var e = function(e) {
                return t.call(ae, e, ae)
            };
            e.proxy = true;
            return e
        }

        function st(e) {
            e = e.originalEvent;

            function t(e, t) {
                return e.type.indexOf(t) !== -1
            }

            function i(e) {
                ae.echo('<img src="' + e + '"/>', {
                    raw: true
                })
            }

            function u(e) {
                var t = window.URL || window.webkitURL;
                return t.createObjectURL(e)
            }

            function a(e, t) {
                if (!t) {
                    var n = {
                        target: ae
                    };
                    if (typeof e === "string") {
                        n.text = e
                    } else if (e instanceof Blob) {
                        n.image = u(e)
                    }
                    var r = M("onPaste", [n]);
                    if (r) {
                        if (is_function(r.then || r.done)) {
                            return (r.then || r.done).call(r, function(e) {
                                a(e, true)
                            })
                        } else {
                            a(r, true)
                        }
                    } else if (r !== false) {
                        a(n.image || n.text, true)
                    }
                } else if (e instanceof Blob) {
                    i(u(e))
                } else if (typeof e === "string") {
                    if (e.match(/^(data:|blob:)/)) {
                        i(e)
                    } else {
                        ae.insert(e)
                    }
                }
            }
            if (e.clipboardData) {
                if (ae.enabled()) {
                    var n = e.clipboardData.items;
                    if (n) {
                        for (var r = 0; r < n.length; r++) {
                            if (t(n[r], "image") && Oe.pasteImage) {
                                var o = n[r].getAsFile();
                                a(o)
                            } else if (t(n[r], "text/plain")) {
                                n[r].getAsString(function(e) {
                                    a(e.replace(/\r/g, ""))
                                })
                            }
                        }
                    } else if (e.clipboardData.getData) {
                        var s = e.clipboardData.getData("text/plain");
                        a(s.replace(/\r/g, ""))
                    }
                    return false
                }
            }
        }
        $(document).on("paste.terminal_" + ae.id(), st);
        var lt = $.extend({}, Y, $.omap(Oe.keymap || {}, function(n, r) {
            if (!Y[n]) {
                return r.bind(ae)
            }
            return function(e, t) {
                return r.call(ae, e, function() {
                    return Y[n](e, t)
                })
            }
        }));
        g(e, Oe.login, function(e) {
            if (Oe.completion && typeof Oe.completion !== "boolean" || !Oe.completion) {
                e.completion = "settings"
            }
            var t = Oe.prompt;
            if (is_function(t)) {
                t = ot(t)
            }
            Ke = new Stack($.extend({}, Oe.extra, {
                name: Oe.name,
                prompt: t,
                keypress: Oe.keypress,
                keydown: Oe.keydown,
                resize: Oe.onResize,
                greetings: Oe.greetings,
                mousewheel: Oe.mousewheel,
                history: Oe.history,
                keymap: lt
            }, e));
            Je = $("<div/>").appendTo(Ge).cmd({
                tabindex: Oe.tabindex,
                mobileDelete: Oe.mobileDelete,
                mobileIngoreAutoSpace: Oe.mobileIngoreAutoSpace,
                prompt: rt ? false : t,
                history: Oe.memory ? "memory" : Oe.history,
                historyFilter: Oe.historyFilter,
                historySize: Oe.historySize,
                caseSensitiveSearch: Oe.caseSensitiveSearch,
                onPaste: Oe.onPaste,
                width: "100%",
                enabled: false,
                charWidth: Le.width,
                keydown: V,
                keymap: lt,
                clickTimeout: Oe.clickTimeout,
                holdTimeout: Oe.holdTimeout,
                holdRepeatTimeout: Oe.holdRepeatTimeout,
                repeatTimeoutKeys: Oe.repeatTimeoutKeys,
                allowedAttributes: Oe.allowedAttributes,
                keypress: G,
                tabs: Oe.tabs,
                onPositionChange: function() {
                    var e = [].slice.call(arguments);
                    W();
                    M("onPositionChange", e)
                },
                onCommandChange: function(e) {
                    if (Se !== Ze.width()) {
                        ae.resizer()
                    }
                    M("onCommandChange", [e]);
                    W()
                },
                commands: L
            });

            function n(e) {
                if (is_mobile) {
                    return
                }
                e = e.originalEvent;
                if (e) {
                    var t = document.elementFromPoint(e.clientX, e.clientY);
                    if (!$(t).closest(".terminal").length && ae.enabled()) {
                        ae.disable()
                    }
                }
            }
            ae.oneTime(100, function() {
                $(document).bind("click.terminal_" + ae.id(), n).bind("contextmenu.terminal_" + ae.id(), n)
            });
            var r = $(window);
            document.addEventListener("resume", function() {
                ae.disable()
            });
            if (is_mobile) {
                (function() {
                    ae.addClass("terminal-mobile");
                    var i;
                    var u;
                    var n;
                    var a = 3;
                    var e = Je.clip();
                    var r = 200;
                    var o;
                    e.$node.off("touchstart.cmd");
                    ae.on("touchstart.terminal", function(e) {
                        e = e.originalEvent;
                        window.touch_event = e;
                        if (e.target.tagName.toLowerCase() === "a") {
                            return
                        }
                        if (!We && e.touches.length === 1) {
                            n = ae.enabled();
                            var t = e.touches[0];
                            i = {
                                x: t.clientX,
                                y: t.clientY
                            };
                            o = setTimeout(function() {
                                i = null
                            }, r)
                        }
                    }).on("touchmove.terminal", function(e) {
                        if (e.touches.length === 1 && i) {
                            var t = e.touches[0];
                            var n = Math.abs(t.clientX - i.x);
                            var r = Math.abs(t.clientY - i.y);
                            if (n > a || r > a) {
                                u = true
                            }
                        }
                    }).on("touchend.terminal", function() {
                        if (i) {
                            clearTimeout(o);
                            if (!u) {
                                if (!n) {
                                    e.focus();
                                    ae.focus()
                                } else {
                                    e.blur();
                                    ae.disable()
                                }
                            }
                        }
                        u = false;
                        i = null
                    })
                })()
            } else {
                r.on("focus.terminal_" + ae.id(), it).on("blur.terminal_" + ae.id(), ut);
                var h;
                (function() {
                    var t = 0;
                    var n;
                    var r = "click_" + ae.id();
                    var i = ae.find(".cmd textarea");

                    function u() {
                        if (n.is(".terminal") || n.is(".terminal-wrapper")) {
                            var e = ae.get_command().length;
                            ae.set_position(e)
                        } else if (n.closest(".cmd-prompt").length) {
                            ae.set_position(0)
                        }
                        if (!i.is(":focus")) {
                            i.focus()
                        }
                        a()
                    }

                    function a() {
                        t = 0;
                        n = null
                    }
                    var o = ".terminal-output textarea," + ".terminal-output input";
                    ae.mousedown(function(e) {
                        if (!scrollbar_event(e, Ze)) {
                            n = $(e.target)
                        }
                    }).mouseup(function() {
                        if (h) {
                            h = false;
                            return
                        }
                        if (n && n.closest(o).length) {
                            if (He) {
                                ae.disable()
                            }
                        } else if (get_selected_html() === "" && n) {
                            if (++t === 1) {
                                if (!We) {
                                    if (!He) {
                                        ae.focus();
                                        ae.scroll_to_bottom()
                                    } else {
                                        var e = Oe.clickTimeout;
                                        ae.oneTime(e, r, u);
                                        return
                                    }
                                }
                            } else {
                                ae.stopTime(r)
                            }
                        }
                        a()
                    }).dblclick(function() {
                        a();
                        ae.stopTime(r)
                    })
                })();
                (function() {
                    var m = Je.clip().$node;

                    function d(e) {
                        return e.type === "mousedown" && e.buttons === 2 || e.type === "contextmenu"
                    }
                    var e;
                    if ("oncontextmenu" in window) {
                        e = "contextmenu.terminal"
                    } else {
                        e = "mousedown.terminal"
                    }
                    ae.on(e, function(e) {
                        h = get_selected_html() === "" && d(e);
                        if (h) {
                            var t = $(e.target);
                            if (t.is("img,value,audio,object,canvas,a")) {
                                return
                            }
                            if (!ae.enabled()) {
                                ae.enable()
                            }
                            var n = Je.offset();
                            var r = Je[0].getBoundingClientRect();
                            var i = ae.offset();
                            var u = i.top - n.top;
                            var a = Math.max(e.pageY - n.top - 20, u);
                            var o = e.pageX - n.left - 20;
                            var s = 4 * 14;
                            var l = 5 * 14;
                            var f = ae[0].getBoundingClientRect();
                            var c = Ze.outerWidth();
                            var p = a + r.top + s;
                            p = p - f.height - f.top;
                            var D = o + r.left + l;
                            D = D - c - f.left;
                            if (p > 0) {
                                s -= Math.ceil(p)
                            }
                            if (D > 0) {
                                l -= Math.ceil(D)
                            }
                            m.attr("style", ["left:" + o + "px !important", "top:" + a + "px !important", "width:" + l + "px !important", "height:" + s + "px !important"].join(";"));
                            if (!m.is(":focus")) {
                                m.focus()
                            }
                            ae.stopTime("textarea");
                            ae.oneTime(100, "textarea", function() {
                                var e = {
                                    left: "",
                                    top: "",
                                    width: "",
                                    height: ""
                                };
                                if (!is_css_variables_supported) {
                                    var t = ae.find(".cmd .cmd-cursor-line").prevUntil(".cmd-prompt").length;
                                    e.top = t * 14 + "px"
                                }
                                m.css(e)
                            });
                            ae.stopTime("selection");
                            ae.everyTime(20, "selection", function() {
                                if (m[0].selection !== m[0].value) {
                                    if (get_textarea_selection(m[0])) {
                                        clear_textarea_selection(m[0]);
                                        select(ae.find(".terminal-output")[0], ae.find(".cmd div:last-of-type")[0]);
                                        ae.stopTime("selection")
                                    }
                                }
                            })
                        }
                    })
                })();
                ae.on("scroll", function() {
                    var e = ae.find("textarea");
                    var t = ae[0].getBoundingClientRect();
                    var n = ae[0].scrollHeight;
                    var r = ae.scrollTop();
                    var i = n - (r + t.height);
                    if (i === 0) {
                        e.css("top", "")
                    } else {
                        e.css("top", -i)
                    }
                })
            }
            ae.on("click", "a", function(e) {
                var t = $(this);
                if (t.closest(".terminal-exception").length) {
                    var n = t.attr("href");
                    if (n.match(/:[0-9]+$/)) {
                        e.preventDefault();
                        D(n, ae.cols())
                    }
                }
                if (He) {
                    ae.find(".cmd textarea").focus()
                }
            });

            function i() {
                var e = Le.width;
                Le = get_char_size(ae);
                if (e !== Le.width) {
                    Je.option("charWidth", Le.width).refresh()
                }
            }
            u();

            function u() {
                if (ae.is(":visible")) {
                    var e = Ze.width();
                    var t = Ze.height();
                    if (Ie) {
                        Ie = !terminal_ready(ae);
                        i()
                    }
                    if (Re !== t || Se !== e) {
                        ae.resize()
                    }
                    Re = t;
                    Se = e
                }
            }

            function a() {
                var e = {
                    prefix: "terminal-"
                };
                ae.resizer("unbind").resizer(u, e);
                Xe.resizer("unbind").resizer(function() {
                    i();
                    ae.resize()
                }, e)
            }

            function o(e) {
                ke = e[0].intersectionRatio === 1
            }

            function s() {
                if (window.IntersectionObserver) {
                    var e = $('<div class="terminal-scroll-marker"/>').appendTo(ae);
                    var t = e;
                    if (Oe.scrollBottomOffset !== -1) {
                        t = $("<div/>").css({
                            height: Oe.scrollBottomOffset
                        }).appendTo(e)
                    }
                    Ae = new IntersectionObserver(o, {
                        root: ae[0]
                    });
                    Ae.observe(t[0])
                }
            }
            s();
            if (ae.is(":visible")) {
                a()
            }

            function l() {
                if (Ye) {
                    if (Ye.unobserve) {
                        Ye.unobserve(ae[0])
                    } else {
                        clearInterval(Ye)
                    }
                }
                var e = ae.enabled();
                var t = ae.is(":visible");
                if (e && !t) {
                    ae.disable()
                }
                if (t) {
                    a()
                } else {
                    Ge.css("visibility", "hidden")
                }

                function n() {
                    if (ae.is(":visible") && !t) {
                        t = true;
                        a();
                        i();
                        u();
                        if (e) {
                            ae.enable()
                        }
                        Ge.css("visibility", "")
                    } else if (t && !ae.is(":visible")) {
                        t = false;
                        e = $.terminal.active() === ae && ae.enabled();
                        ae.disable();
                        Ge.css("visibility", "hidden")
                    }
                }
                if (window.IntersectionObserver && ae.css("position") !== "fixed") {
                    Ye = new IntersectionObserver(n, {
                        root: null
                    });
                    Ye.observe(ae[0])
                } else {
                    Ye = setInterval(n, 100)
                }
            }
            var f = !!ae.closest("body").length;
            var c = window.MutationObserver || window.WebKitMutationObserver;
            if (c) {
                Ve = new c(function() {
                    if (ae.closest("body").length) {
                        if (!f) {
                            ae.scroll_to_bottom();
                            l();
                            u()
                        }
                        f = true
                    } else if (f) {
                        f = false
                    }
                });
                Ve.observe(document.body, {
                    childList: true
                })
            }
            if (f) {
                l()
            }
            Fe.resolve();
            if (He && ae.is(":visible") && !is_mobile) {
                ae.focus(undefined, true)
            } else {
                ae.disable()
            }
            if (is_function(rt)) {
                ae.login(rt, true, K)
            } else {
                K()
            }

            function p(e, t) {
                var n = terminals.get()[e[0]];
                var r = $.Deferred();
                if (n && ve === n.id()) {
                    if (!e[2]) {
                        r.resolve();
                        return r.promise()
                    } else if (qe) {
                        O.push(function() {
                            return n.exec(e[2], t).done(function() {
                                n.save_state(e[2], true, e[1]);
                                r.resolve()
                            })
                        });
                        return r.promise()
                    } else {
                        return n.exec(e[2], t).done(function() {
                            n.save_state(e[2], true, e[1])
                        })
                    }
                }
            }
            if (Oe.execHash) {
                if (location.hash) {
                    setTimeout(function() {
                        try {
                            var e = location.hash.replace(/^#/, "");
                            hash_commands = JSON.parse(decodeURIComponent(e));
                            if (!e.match(/\[/)) {
                                q(hash_commands)
                            }
                            var n = 0;
                            var r = {
                                typing: Oe.execAnimation,
                                delay: Oe.execAnimationDelay
                            };
                            (function e() {
                                var t = hash_commands[n++];
                                if (t) {
                                    p(t, r).done(e)
                                } else {
                                    change_hash = true
                                }
                            })()
                        } catch (e) {}
                    })
                } else {
                    change_hash = true
                }
            } else {
                change_hash = true
            }(function() {
                var i = false;
                $(document).bind("keydown.terminal_" + ae.id(), function(e) {
                    if (e.shiftKey) {
                        i = true
                    }
                }).bind("keyup.terminal_" + ae.id(), function(e) {
                    if (e.shiftKey || e.which === 16) {
                        i = false
                    }
                });

                function n(e, t) {
                    if (!i) {
                        var n = Ke.top();
                        var r;
                        if (is_function(n.mousewheel)) {
                            r = n.mousewheel(e, t, ae)
                        } else if (is_function(Oe.mousewheel)) {
                            r = Oe.mousewheel(e, t, ae)
                        }
                        if (r === true) {
                            return
                        }
                        if ((B() || r === false) && !e.ctrlKey) {
                            e.stopPropagation();
                            e.preventDefault()
                        }
                        if (r === false) {
                            return false
                        }
                        if (t > 0) {
                            ae.scroll(-40)
                        } else {
                            ae.scroll(40)
                        }
                    }
                }
                if ($.event.special.mousewheel) {
                    ae.on("mousewheel", n)
                } else {
                    var r;
                    var e = document.createElement("div");
                    if ("onwheel" in e) {
                        r = "wheel"
                    } else if (document.onmousewheel !== undefined) {
                        r = "mousewheel"
                    } else {
                        r = "DOMMouseScroll"
                    }
                    e = null;
                    ae.on(r, function(e) {
                        var t;
                        if (r === "mousewheel") {
                            t = -1 / 40 * e.originalEvent.wheelDelta
                        } else {
                            t = e.originalEvent.deltaY || e.originalEvent.detail
                        }
                        n(e, -t)
                    })
                }
                ae.touch_scroll(function(e) {
                    var t = e.current.clientY - e.previous.clientY;
                    var n;
                    var r = Ke.top();
                    if (is_function(r.touchscroll)) {
                        n = r.touchscroll(e, t, ae)
                    } else if (is_function(Oe.touchscroll)) {
                        n = Oe.touchscroll(e, t, ae)
                    }
                    css(ae[0], {
                        "--terminal-scroll": ae.prop("scrollTop")
                    });
                    if (n === true) {
                        return
                    }
                    return false
                })
            })()
        });
        return ae
    }
});