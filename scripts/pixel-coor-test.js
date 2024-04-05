const { Window } = require('win-control')
const { getTargetCoordinates } = require('../src/dimensions')
const robot = require('robotjs')

const win = Window.getByTitle('Albion Online Client')
if (!win) {
    console.log('process not found')
    process.exit(1)
}

const {
    pullPoint,
    restPoint,
    throwPoint,
    fishBaitCoor,
    center,
} = getTargetCoordinates(win)

// robot.moveMouse(center[0] + (center[0] * 0.375), center[1] + (center[1] * 0.15))
robot.moveMouse(fishBaitCoor[0], fishBaitCoor[1])

// robot.moveMouse(pullPoint[0], pullPoint[1])
// robot.mouseClick()
// robot.moveMouse(pullPoint[0] - 10, pullPoint[1])
// robot.mouseClick()
// robot.moveMouse(pullPoint[0] - 15, pullPoint[1])
// robot.mouseClick()
// robot.moveMouse(restPoint[0], restPoint[1])
// robot.mouseClick()
// robot.moveMouse(restPoint[0] + 10, restPoint[1])
// robot.mouseClick()
// robot.moveMouse(restPoint[0] + 15, restPoint[1])
// robot.mouseClick()