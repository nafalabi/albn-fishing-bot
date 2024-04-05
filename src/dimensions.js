const robot = require('robotjs')

const getDimensions = (windowInstance) => {
    const dimensions = windowInstance.getDimensions()
    const winWidth = dimensions.right - dimensions.left
    const winHeight = dimensions.bottom - dimensions.top

    return {
        top: dimensions.top,
        bottom: dimensions.bottom,
        left: dimensions.left,
        right: dimensions.right,
        winHeight,
        winWidth,
    }
}

const getTargetCoordinates = (windowInstance) => {
    const {
        top,
        bottom,
        left,
        right,
        winHeight,
        winWidth,
    } = getDimensions(windowInstance)

    const yBuffer = 23;
    const x = left + (winWidth / 2)
    const y = top + (winHeight / 2) + yBuffer
    const center = [x, y - yBuffer]

    return {
        pullPoint: [x, y],
        restPoint: [x + 15, y],
        throwPoint: [x - 100, y - 65],
        fishBaitCoor: [center[0] + (center[0] * 0.375), center[1] + (center[1] * 0.15)],
        center,
    }
}

const getCurMouseCoor = () => {
    const coor = robot.getMousePos();
    return [coor.x, coor.y]
}

module.exports = {
    getTargetCoordinates,
    getCurMouseCoor,
}