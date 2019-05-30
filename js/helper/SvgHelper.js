import {ajax} from './helper'
function load (url, callback, scope) {
    ajax(url, function (req) {
        var f = parse(req.responseText);
        scope ? callback.call(scope, f) : callback(f);
    });
}
/*\
 * Snap.parse
 [ method ]
 **
 * Parses SVG fragment and converts it into a @Fragment
 **
 - svg (string) SVG string
 = (Fragment) the @Fragment
\*/
function parse(svg){
  var f = document.createDocumentFragment(),
        full = true,
        div = document.createElement("div");
    svg = String(svg);
    if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
        svg = "<svg>" + svg + "</svg>";
        full = false;
    }
    div.innerHTML = svg;
    svg = div.getElementsByTagName("svg")[0];
    if (svg) {
        if (full) {
            f = svg;
        } else {
            while (svg.firstChild) {
                f.appendChild(svg.firstChild);
            }
        }
    }
    return f;
}
export {
    load
}
