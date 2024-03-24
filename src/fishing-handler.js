const { FishingState } = require("./enums/FishingState");
const { FishingActions } = require("./fishing-actions");
const { getActionFromCoordinates } = require("./pixels");
const { sleep } = require("./utils");

class FishingHandler {
    playerId = 0
    fishingId = 0

    loopInterval = 0
    pullPoint = [0, 0]
    restPoint = [0, 0]
    throwPoint = [0, 0]
    windowInstance

    constructor(
        pullPoint,
        restPoint,
        throwPoint,
        win,
    ) {
        this.pullPoint = pullPoint
        this.restPoint = restPoint
        this.throwPoint = throwPoint
        this.windowInstance = win
    }

    updatePlayerId(playerId) {
        this.playerId = playerId
    }

    async updateState(parameters) {
        const fishingState = parameters[3];

        if (!fishingState) return;
        if (parameters[1] != this.playerId) return;

        this.fishingId = parameters[0];

        switch (fishingState) {
            case FishingState.HOOKED:
                await sleep(100);
                FishingActions.pull(this.throwPoint[0], this.throwPoint[1]);
                break;
            case FishingState.GET_AWAY:
            case FishingState.LOST:
            case FishingState.WIN:
                this.restart(this.fishingId);
            default:
                break;
        }
    }

    startPulling() {
        clearInterval(this.loopInterval)
        this.loopInterval = setInterval(() => {
            const action = getActionFromCoordinates(this.pullPoint, this.restPoint)

            switch (action) {
                case 'pull':
                    return FishingActions.pull(this.throwPoint[0], this.throwPoint[1])
                case 'rest':
                    return FishingActions.rest(this.throwPoint[0], this.throwPoint[1])
                default:
                    break;
            }
        }, 50)
    }

    stopPulling() {
        FishingActions.rest(this.throwPoint[0], this.throwPoint[1])
        clearInterval(this.loopInterval)
    }

    start() {
        this.windowInstance.setForeground();
        FishingActions.throwBait(this.throwPoint[0], this.throwPoint[1])
    }

    async restart(fishingId) {
        if (fishingId !== this.fishingId) return;

        this.stopPulling()
        await sleep(2000)
        this.start()
    }

    cancel() {
        FishingActions.cancel()
    }
}

module.exports = {
    FishingHandler
}