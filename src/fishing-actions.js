const robot = require('robotjs');
const { sleep } = require('./utils');

let throwChargeTime = 50;

class FishingActions {
    static async throwBait(x, y) {
        // const minChargeTime = 150
        // const maxChargeTime = 900
        // const chargeTime = Math.floor(Math.random() * (maxChargeTime - minChargeTime + 1) + minChargeTime)
        const chargeTime = throwChargeTime
        console.log('action: throwBait - ', chargeTime)
        robot.moveMouse(x , y);
        robot.mouseToggle("down");
        await sleep(chargeTime)
        robot.mouseToggle("up")

        if (chargeTime > 1000) {
            throwChargeTime = 50
        } else {
            throwChargeTime += 150
        }
    }

    static pull(x, y) {
        console.log('action: pull')
        robot.moveMouse(x , y);
        robot.mouseToggle("down");
    }

    static rest(x, y) {
        console.log('action: rest')
        robot.moveMouse(x , y);
        robot.mouseToggle("up");
    }

    static cancel() {
        console.log('action: cancel');
        robot.keyTap('escape');
    }

    static async equipBait(baitCoor) {
        console.log('action: equip bait');
        robot.keyTap('escape');
        robot.keyTap('i');
        await sleep(500)
        robot.moveMouse(baitCoor[0], baitCoor[1]);
        robot.mouseClick('right');
        await sleep(100)
        robot.keyTap('escape')
    }

    static consumeBait() {
        console.log('action: consume bait');
        robot.keyTap('1');
    }
}

module.exports = {
    FishingActions
}