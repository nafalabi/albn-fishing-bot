const robot = require('robotjs')
const ColorClassifier = require("color-classifier");
const { AlgorithmTypes, Palette } = ColorClassifier

const colorClassifier = new ColorClassifier(Palette.W3C, AlgorithmTypes.HSV);

const getPixelColorAt = (x, y) => {
    var hex = robot.getPixelColor(x, y);
    return colorClassifier.classify("#" + hex, 'hex')
}

const getActionFromCoordinates = (pullPoint, restPoint) => {
    const restPoints = [
        [restPoint[0], restPoint[1]],
        [restPoint[0] + 10, restPoint[1]],
        [restPoint[0] + 15, restPoint[1]],
    ]

    if (restPoints.some(([x, y]) => '#ffffff' === getPixelColorAt(x, y))) {
        return 'rest'
    }

    const pullPoints = [
        [pullPoint[0], pullPoint[1]],
        [pullPoint[0] - 10, pullPoint[1]],
        [pullPoint[0] - 15, pullPoint[1]],
    ]

    if (pullPoints.some(([x, y]) => '#ffffff' === getPixelColorAt(x, y))) {
        return 'pull'
    }
}

module.exports = {
    getPixelColorAt,
    getActionFromCoordinates,
}