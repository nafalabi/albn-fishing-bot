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

    const yBuffer = 25;
    const x = left + (winWidth / 2)
    const y = top + (winHeight / 2) + yBuffer

    return {
        pullPoint: [x + 15, y],
        restPoint: [x + 30, y],
        throwPoint: [x - 100, y - 65],
    }
}

module.exports = {
    getTargetCoordinates
}