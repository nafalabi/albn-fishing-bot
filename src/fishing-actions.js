const robot = require('robotjs');
const { sleep } = require('./utils');

class FishingActions {
    static async throwBait(x, y) {
        const minChargeTime = 50
        const maxChargeTime = 900
        const chargeTime = Math.floor(Math.random() * (maxChargeTime - minChargeTime + 1) + minChargeTime)
        console.log('throwBait: ', chargeTime)
        robot.moveMouse(x , y);
        robot.mouseToggle("down");
        await sleep(chargeTime)
        robot.mouseToggle("up")
    }

    static pull(x, y) {
        console.log('pull')
        robot.moveMouse(x , y);
        robot.mouseToggle("down");
    }

    static rest(x, y) {
        console.log('rest')
        robot.moveMouse(x , y);
        robot.mouseToggle("up");
    }

    static cancel() {
        console.log('cancel')
        robot.keyTap('escape');
    }
}

module.exports = {
    FishingActions
}