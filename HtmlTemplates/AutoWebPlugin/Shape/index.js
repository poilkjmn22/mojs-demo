import '../../../css/sass/shape'
import * as _ from 'lodash-es'
import mojs from 'mo-js'
const color1 = '#c159b0',
    color2 = '#6dbc99',
    color3 = '#f4a86e',
    pos = {
        row1: '35%',
        row2: '65%',
        col1: '20%',
        col2: '40%',
        col3: '60%',
        col4: '80%'
    };

const zigzag = new mojs.Shape({
    parent: '#shape-box',
    shape: 'zigzag',
    points: 20,
    radius: 50,
    radiusY: 25,
    top: pos.row1,
    left: pos.col1,
    y: -10,
    scaleX: {
        0.5: 3
    },
    fill: 'none',
    stroke: color1,
    isShowStart: false,
    // isYoyo: true,
    // repeat: 999,
    // easing: 'sin.inout',
    // delay: 0,
    duration: 1000
});

const cross = new mojs.Shape({
    parent: '#shape-box',
    shape: 'cross',
    radius: 20,
    radiusY: 30,
    top: pos.row1,
    left: pos.col2,
    stroke: color2, //no fill for this one
    isShowStart: false,
    angle: {
        0: 180
    },
    // isYoyo: true,
    // repeat: 999,
    // easing: 'sin.inout',
    // delay: 0,
    duration: 1000,
    y: -25
});

const equal = new mojs.Shape({
    parent: '#shape-box',
    shape: 'equal',
    points: 5,
    radius: 25,
    radiusY: 15,
    top: pos.row1,
    left: pos.col3,
    stroke: color3, //no fill for this one
    isShowStart: true,
    y: -25
});

const curve = new mojs.Shape({
    parent: '#shape-box',
    shape: 'curve',
    radius: 25,
    radiusY: 50,
    top: pos.row1,
    left: pos.col4,
    fill: 'none',
    stroke: color2,
    isShowStart: true,
});

// second row //

const rect = new mojs.Shape({
    parent: '#shape-box',
    shape: 'rect',
    radius: 10,
    radiusX: 30, // explicit radiusX
    left: pos.col1,
    top: pos.row2,
    fill: color3,
    isShowStart: true,
});

const polygon1 = new mojs.Shape({
    parent: '#shape-box',
    shape: 'polygon',
    radius: 20,
    radiusY: 30, // explicit radiusY
    // left: '75%',
    stroke: '#7db4d8',
    top: pos.row2,
    left: pos.col2,
    fill: 'none',
    isShowStart: true,
});

const circle = new mojs.Shape({
    parent: '#shape-box',
    shape: 'circle',
    radius: 30,
    radiusX: 20, // explicit radiusX
    top: pos.row2,
    left: pos.col3,
    fill: 'none',
    stroke: color2,
    isShowStart: true,
});

const polygon2 = new mojs.Shape({
    parent: '#shape-box',
    shape: 'polygon',
    points: 8, //explicit points
    radius: 25,
    // left: '75%',
    top: pos.row2,
    left: pos.col4,
    fill: color3,
    isShowStart: true,
});

var tl = new mojs.Timeline({
        delay: 600,
        isYoyo: true,
        easing: 'elastic.out',
        repeat: 888
    })
    _.each([zigzag, cross, equal, curve, rect, polygon1, circle,  polygon2], shape => {
      shape.tune({
        isShowStart: true,
        duration: 1500,
        angle: {0: 360},
        easing: 'elastic.out'
      })
      tl.append(shape)
    })
    tl.play()
