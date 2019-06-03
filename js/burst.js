import mojs from 'mo-js'
import * as _ from 'lodash-es'
import {
    load
} from './helper/SvgHelper'
import {
    ready,
    addEvent
} from './helper/helper'
import '../css/sass/burst.scss'

ready(() => {
    load('/assets/svgs/cartoon-horse.svg', f => {
        var btnHorse = document.querySelector('#button-horse')
        btnHorse.appendChild(f)
        var svgHorse = btnHorse.querySelector('svg')
        svgHorse.style.fill = '#C0C1C3';
        var isChecked = false;
        addEvent(btnHorse, 'click', e => {
            if (isChecked) {
                svgHorse.style.fill = '#C0C1C3';
            } else {
                tl.replay()
                svgHorse.style.fill = '#F198CA';
            }
            isChecked = !isChecked
        })

        var tl = new mojs.Timeline()
        var translationCurve = mojs.easing.path('M0,100 C0,72 10,-0.1 50,0 C89.6,0.1 100,72 100,100')
        tl.add(new mojs.Burst({
                parent: btnHorse,
                left: '65%',
                top: '40%',
                count: 5,
                radius: {
                    40: 120
                },
                angle: 69,
                degree: 17,
                children: {
                    shape: 'line',
                    scale: 1,
                    radius: {
                        20: 0
                    },
                    stroke: ['#bf62a6', '#f28c33', '#f5d63d', '#79c267', '#78c5d6'],
                    duration: 600,
                    easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
                },
            }),
            // burst animation (circles)
            new mojs.Burst({
                parent: btnHorse,
                left: '65%',
                top: '40%',
                count: 4,
                radius: {
                    20: 50
                },
                degree: 20,
                angle: 70,
                opacity: 0.6,
                children: {
                    fill: ['#bf62a6', '#f28c33', '#f5d63d', '#79c267', '#78c5d6'],
                    scale: 1,
                    radius: {
                        'rand(5,20)': 0
                    },
                    isSwirl: true,
                    swirlSize: 4,
                    duration: 1600,
                    delay: [0, 350, 200, 150, 400],
                    easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
                }
            }),
            // icon scale animation
            new mojs.Tween({
                duration: 800,
                easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
                onUpdate: function(progress) {
                    var translationProgress = translationCurve(progress);
                    svgHorse.style.WebkitTransform = svgHorse.style.transform = 'translate3d(' + -20 * translationProgress + '%,0,0)';
                }
            }))
    })
})
