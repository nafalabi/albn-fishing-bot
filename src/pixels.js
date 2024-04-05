const robot = require('robotjs')
const ColorClassifier = require("color-classifier");

const colorClassifier = new ColorClassifier([
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
]);

const getPixelColorAt = (x, y) => {
    var hex = robot.getPixelColor(x, y);
    const classified = colorClassifier.classify("#" + hex, 'hex')
    return classified;
}

const getActionFromCoordinates = (pullPoint, restPoint) => {
    if ('#00ff00' !== getPixelColorAt(restPoint[0], restPoint[1])) {
        return 'rest'
    }

    if ('#00ff00' !== getPixelColorAt(pullPoint[0], pullPoint[1])) {
        return 'pull'
    }
}

module.exports = {
    getPixelColorAt,
    getActionFromCoordinates,
}