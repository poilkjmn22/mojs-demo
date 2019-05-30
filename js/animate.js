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
    var wing = svg.querySelector('#wing')

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
            var customEP = mojs.easing.back.out(p)
            var customXEP = mojs.easing.circ.in(p)
            attr(note, {
                transform: `translate(${customXEP * 80},${-160 * ep }) rotate(${60 * customEP - 40}, ${x}, ${y + height})`,
                // style: `opacity: ${1 - ep}`
            })

            attr(note2, {
                transform: `translate(${customXEP * -80},${-80 * ep }) rotate(${-60 * customEP + 40}, ${x}, ${y + height})`,
                // style: `opacity: ${1 - ep}`
            })
        },
        onRepeatComplete(){
        }
    }).play();
})
