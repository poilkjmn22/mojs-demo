const raf = require('raf')
import * as _ from 'lodash-es'
import eve from 'eve'

function ready(fn) {

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function DOMContentLoadedHandler() {
            document.removeEventListener('DOMContentLoaded', DOMContentLoadedHandler, false);
            fn();
        }, false);
    }

    // 如果IE
    else if (document.attachEvent) {
        // 确保当页面是在iframe中加载时，事件依旧会被安全触发
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', ready);
                fn();
            }
        });

        // 如果是IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
        if (document.documentElement.doScroll && typeof window.frameElement === "undefined") {
            try {
                document.documentElement.doScroll('left');
            } catch (error) {
                return setTimeout(() => {
                    ready(fn)
                }, 20);
            };
            fn();
        }
    }
};

function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        // W3C标准
        elm.addEventListener(evType, fn, useCapture);
        return true;
    } else if (elm.attachEvent) {
        //IE
        var r = elm.attachEvent('on' + evType, fn); //IE5+
        return r;
    } else {
        elm['on' + evType] = fn; //DOM事件
    }
}

function addTransitionEndListener(elem, cb) {
    var vm = this;
    var transitions = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'MSTransition': 'msTransitionEnd',
        'OTransition': 'oTransitionEnd',
        'transition': 'transitionend'
    };
    for (var t in transitions) {
        if (elem.style[t] !== undefined) {
            addEvent(elem, transitions[t], function(event) {
                cb.call(this, event)
            }, false);
            break;
        }
    }
}

function addClass(el, className) {
    if (!el) {
        return
    }
    removeClass(el, className)
    el.className = el.className + ` ${className}`
}

function removeClass(el, className) {
    if (!el) {
        return
    }
    el.className = el.className.replace(new RegExp(`\\s*${className}\\b`), '')
}

function attr(elm, values) {
    if (!_.isElement(elm)) {
        return
    }
    _.each(values, (v, k) => {
        elm.setAttribute(_.kebabCase(k), v)
    })
}

function noDataDisplay(options) {
    options = _.merge({
        el: document.body,
        noDataText: '暂无数据',
        attrs: {
            style: 'font-size: 20px;color: #999;margin: 60px 0;text-align: center;'
        }
    }, options || {})
    var div = document.createElement('div')
    div.innerHTML = `${options.noDataText}`
    attr(div, options.attrs)
    options.el.appendChild(div)
}

function getPosOfParent(e, parentRect) {
    let {
        pageX,
        pageY
    } = e
    return {
        x: pageX - parentRect.left,
        y: pageY - parentRect.top
    }
}

function getParentNode(node, className) {
    var res = node;
    while (res && res.className.indexOf(className) < 0) {
        res = res.parentNode
    }
    return res
}

let _props = {}
const _cssPropMap = {
    "transition-timing-function": "TransitionTimingFunction",
    "transition-duration": "TransitionDuration",
    "transform": "Transform"
};

function setStyle(elem, type, value) {
    if (_props[type]) {
        elem.style.setProperty(_props[type], value, "important");
    } else {
        var modes = "-webkit- -moz- -ms- -o-".split(" ");
        _props[type] = type;
        for (var i = 0, len = modes.length; i < len; ++i) {
            var mode = modes[i].replace(/-/g, "");
            mode = (mode == "moz") ? "Moz" : mode;
            if (elem.style[(mode + _cssPropMap[type])] !== undefined) {
                _props[type] = modes[i] + type;
                break;
            }
        }
        setStyle(elem, type, value);
    }
}

var getScrollTop = function(element) {
    if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    }

    return element.scrollTop;
}

const getComputedStyle = document.defaultView.getComputedStyle

var getScrollEventTarget = function(element) {
    var currentNode = element;
    // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        var overflowY = getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
    return window;
}

var getVisibleHeight = function(element) {
    if (element === window) {
        return document.documentElement.clientHeight;
    }

    return element.clientHeight;
}

var getElementTop = function(element) {
    if (element === window) {
        return getScrollTop(window);
    }
    return element.getBoundingClientRect().top + getScrollTop(window);
}

function animateNumber(oldVal, newVal, {
    easing = 'ease',
    update = null,
    end = null,
    duration = 100
}) {
    if (!update) {
        update = () => {}
    }
    if (!end) {
        end = () => {}
    }
    var lastTime = +(new Date())
    var delta = (newVal - oldVal) / duration
    let value = oldVal

    function animate() {
        value += (delta)
        if (delta < 0) {
            if (value < newVal) {
                value = newVal
                update.call(this, value)
                return
            }
        } else if (delta > 0) {
            if (value > newVal) {
                value = newVal
                update.call(this, value)
                return
            }
        } else {
            return
        }
        update.call(this, value)
        raf(animate)
    }
    animate()
}

const STANDARD_COORDINATE_SIZE = [19200, 10800]

function transformCoordinate(value, coordinate, dimension) {
    dimension = dimension || 'x'
    value = value || 0
    if (dimension == 'x') {
        return coordinate[0] * value / STANDARD_COORDINATE_SIZE[0]
    } else {
        return coordinate[1] * value / STANDARD_COORDINATE_SIZE[1]
    }
}

const ASPECT_RATIO_PPT = 4 / 3

function transformAspect({
    ow = 400,
    oh = 300
}, {
    tw = 400,
    th = 300
}) {
    if ((ow / oh) > ASPECT_RATIO_PPT) {
        return {
            w: tw,
            h: tw * oh / ow
        }
    } else {
        return {
            w: th * ow / oh,
            h: th
        }
    }
}

function getFileUrlName(fileurl) {
    fileurl = decodeURIComponent(fileurl)
    return _.get(fileurl.match(/\/([^\/]+)$/), '[1]') || ''
}

const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_LINK_NS = "http://www.w3.org/1999/xlink"

function createSVG(tagName) {
    tagName = tagName || 'svg'
    var el = document.createElementNS(SVG_NS, tagName)
    if (tagName == 'svg') {
        el.setAttribute('xmlns', SVG_NS)
        el.setAttribute('xmlns:xlink', SVG_LINK_NS)
    }
    return el
}

const DEFAULT_DELAY_HIDDEN_TIME = 4000

function whenInteractionStop(cb, delayHiddenTime) {
    var lastTime
    var lastTimeID
    delayHiddenTime = delayHiddenTime || DEFAULT_DELAY_HIDDEN_TIME
    return function innerWhen(now) {
        clearTimeout(lastTimeID)
        var args = [].slice.call(arguments, 1)
        if ((now - lastTime) >= delayHiddenTime && lastTime != undefined) {
            lastTime = now
            cb.apply(this, args)
        } else {
            lastTime = now
            lastTimeID = setTimeout(() => {
                cb.apply(this, args)
                lastTime = now
            }, delayHiddenTime)
        }
    }
}

function resolveKey(key) {
    if (typeof key == undefined || typeof key == null) {
        return null
    }
    let key32BitString = _.padStart(key.toString(2), 32, '0')
    var type = parseInt(key32BitString.substring(0, 8), 2)
    var object_id = parseInt(key32BitString.substring(8, 20), 2)
    var cw_id = parseInt(key32BitString.substring(20), 2)
    return {
        type,
        object_id,
        cw_id
    }
}

function formatTS(format, ts, isSecond) {
    if (!_.isNumber(ts) && !_.isDate(ts)) {
        return ''
    }
    if (isSecond) {
        ts = ts * 1000
    }
    var dt = _.isDate(ts) ? ts : new Date(ts)
    var format = format || 'YYYY-MM-DD HH24:MI:SS'
    var values = {
        'YYYY': dt.getFullYear(),
        'MM': _.padStart(dt.getMonth() + 1, 2, '0'),
        'DD': _.padStart(dt.getDate(), 2, '0'),
        'HH24': _.padStart(dt.getHours(), 2, '0'),
        'MI': _.padStart(dt.getMinutes(), 2, '0'),
        'SS': _.padStart(dt.getSeconds(), 2, '0')
    }
    var exp = new RegExp(_.map(values, (v, k) => {
        return `(${k})`
    }).join('|'), 'g')
    return format.replace(exp, (m) => {
        return values[m]
    })
}

function addDateDays(date, days) {
    var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    return new Date(y, m, d + days)
}

function convertDate(str) {
    var match = /(\d+)-(\d+)-(\d+)/.exec(str)
    return new Date(match[1], parseInt(match[2]) - 1, match[3])
}
const ASPECT_RATIO = 16 / 9;

const layoutSize = {
    mainHorizontalMargin: 80,
    mainBottomMargin: 80,
    chartRoomMargin: 20,
    mainPadding: 5
}

function calculateViewport() {
    var viewport;
    let viewWidth = window.innerWidth - 2 * layoutSize.mainPadding - layoutSize.mainHorizontalMargin * 2 - (document.getElementById('state-modules').offsetWidth + layoutSize.chartRoomMargin);
    let viewHeight = window.innerHeight - 2 * layoutSize.mainPadding - (document.getElementById('header').offsetHeight + layoutSize.mainBottomMargin);
    if (viewWidth / viewHeight > ASPECT_RATIO) {
        viewport = [viewHeight * ASPECT_RATIO, viewHeight];
    } else {
        viewport = [viewWidth, viewWidth / ASPECT_RATIO];
    }
    var mainWidth = viewport[0] + 2 * layoutSize.mainPadding + (document.getElementById('state-modules').offsetWidth + layoutSize.chartRoomMargin)
    document.getElementById('user-video-container').setAttribute('style', `width: ${mainWidth}px;`)
    document.getElementById('main-content').setAttribute('style', `width: ${mainWidth}px;height: ${viewport[1] + 2 * layoutSize.mainPadding}px;visibility: visible;`)
    document.getElementById('resource-content').setAttribute('style', `width: ${viewport[0] + 2 * layoutSize.mainPadding}px;height: 100%;`)
    return viewport
}

function queryUrlParam(key) {
    if (typeof window.location.search != 'string') {
        return '';
    }
    var paramPairs = window.location.search.replace(/^\?/, '').split('&');
    var res = '';
    for (var i = 0; i < paramPairs.length; i++) {
        var temp;
        if (typeof paramPairs[i] == 'string' && paramPairs[i].split('=')) {
            temp = paramPairs[i].split('=');
            if (key == temp[0]) {
                res = temp[1];
                break;
            }
        }
    }
    return res;
}

//实现图片的预加载
const preload = (function () {
        function onerror() {
            this.parentNode.removeChild(this);
        }
        return function (src, f) {
            var img = document.createElement("img"),
                body = document.body;
            img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
            img.onload = function () {
                if(typeof f === 'function'){
                  f.call(img);
                }
                img.onload = img.onerror = null;
                // body.removeChild(img);
            };
            img.onerror = onerror;
            body.appendChild(img);
            img.src = src;
        };
    }());
const preloadImgs = function (srcArr) {
    if (srcArr instanceof Array) {
        for (var i = 0; i < srcArr.length; i++) {
            preload(srcArr[i])
        }
    }
}
var idgen = 0,
    idprefix = "S" + (+new Date).toString(36),
    ID = function (el) {
        return (el && el.type ? el.type : "") + idprefix + (idgen++).toString(36);
    };
function ajax (url, postData, callback, scope){
    var req = new XMLHttpRequest,
        id = ID();
    if (req) {
        if (_.isFunction(postData)) {
            scope = callback;
            callback = postData;
            postData = null;
        } else if (_.isObject(postData)) {
            var pd = [];
            for (var key in postData) if (postData.hasOwnProperty(key)) {
                pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
            }
            postData = pd.join("&");
        }
        req.open(postData ? "POST" : "GET", url, true);
        if (postData) {
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        if (callback) {
            eve.once("snap.ajax." + id + ".0", callback);
            eve.once("snap.ajax." + id + ".200", callback);
            eve.once("snap.ajax." + id + ".304", callback);
        }
        req.onreadystatechange = function() {
            if (req.readyState != 4) return;
            eve("snap.ajax." + id + "." + req.status, scope, req);
        };
        if (req.readyState == 4) {
            return req;
        }
        req.send(postData);
        return req;
    }
}

export {
    ready,
    addEvent,
    addTransitionEndListener,
    noDataDisplay,
    addClass,
    removeClass,
    attr,
    setStyle,
    getScrollTop,
    getScrollEventTarget,
    getVisibleHeight,
    getElementTop,
    getComputedStyle,
    getPosOfParent,
    getParentNode,
    animateNumber,
    transformCoordinate,
    transformAspect,
    getFileUrlName,
    createSVG,
    whenInteractionStop,
    resolveKey,
    formatTS,
    addDateDays,
    convertDate,
    calculateViewport,
    queryUrlParam,
    preloadImgs,
    ajax
}
