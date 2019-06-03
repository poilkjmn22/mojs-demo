import '../css/sass/animate.scss';
import {
    attr,
    createSVG
} from './helper/helper'
import {
    load
} from './helper/SvgHelper'
import mojs from 'mo-js'
import * as _ from 'lodash-es'

const color1 = '#81daef',
    color2 = '#6dbc99',
    color3 = '#f4a86e';

load('/assets/svgs/singing-bird.svg', svg => {
    document.getElementById('early-birld-svg-wrapper').appendChild(svg)
    svg = document.querySelector('#early-birld-svg-wrapper svg')
    attr(svg, {
        width: '320px',
        height: '320px'
    })
    var note = svg.querySelector('#note')
    attr(note, {
      fill: color1,
      class: 'path-note'
    })
    let {x,y,width, height} = note.getBBox()
    var note2 = createSVG('path')
    attr(note2, {
      d: note.getAttribute('d'),
      fill: color2,
      class: 'path-note'
    })
    svg.appendChild(note2)
    var note3 = createSVG('path')
    attr(note3, {
      d: note.getAttribute('d'),
      fill: color3,
      class: 'path-note'
    })
    svg.appendChild(note3)

    const laser1E = mojs.easing.path('M0,400S58,111.1,80.5,175.1s43,286.4,63,110.4,46.3-214.8,70.8-71.8S264.5,369,285,225.5s16.6-209.7,35.1-118.2S349.5,258.5,357,210,400,0,400,0');

    const tween = new mojs.Tween({
        duration: 1500,
        repeat: 9999,
        delay: 300,
        isYoyo: false,
        easing: 'sin.out',
        onUpdate(ep, p, isForward) {
            // var laser1EProgress = laser1E(ep);
            // console.dir(laser1EProgress)
            attr(note, {
                transform: `translate(${mojs.easing.ease.out(ep) * 80},${-160 * mojs.easing.back.out(ep) }) rotate(${60 * mojs.easing.sin.out(ep) - 40}, ${x}, ${y + height})`,
                // style: `opacity: ${1 - ep}`
            })

            attr(note2, {
                transform: `translate(${mojs.easing.quart.out(ep) * -80},${-80 * mojs.easing.cubic.out(ep) }) rotate(${-60 * mojs.easing.quad.out(ep) + 40}, ${x}, ${y + height})`,
                // style: `opacity: ${1 - ep}`
            })

            attr(note3, {
                transform: `translate(${mojs.easing.elastic.out(ep) * -200},${-80 * mojs.easing.circ.out(ep) }) rotate(${-90 * mojs.easing.bounce.out(ep) + 45}, ${x}, ${y + height})`
            })
        },
        onRepeatComplete(){
        }
    }).play();

    var wing = svg.querySelector('#wing')
    let posWing = wing.getBBox()
    var tail = svg.querySelector('#tail')
    let posTail = tail.getBBox()
    const tween1 = new mojs.Tween({
        duration: 600,
        repeat: 9999,
        delay: 0,
        isYoyo: true,
        easing: 'sin.out',
        onUpdate(ep, p, isForward) {
            attr(wing, {
              transform: `rotate(${10 * ep},${posWing.x + posWing.width * 0.6426}, ${posWing.y})`
               // skewX(${30 * mojs.easing.quint.out(p)}) skewY(${30 * mojs.easing.expo.out(p)})
            })
            attr(tail, {
              transform: `rotate(${-20 * ep + 10},${posTail.x + posTail.width}, ${posTail.y})`
               // skewX(${30 * mojs.easing.quint.out(p)}) skewY(${30 * mojs.easing.expo.out(p)})
            })
        },
        onRepeatComplete(){
        }
    }).play();
})
