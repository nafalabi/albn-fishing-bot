const { FishingState } = require("./enums/FishingState");
const { FishingActions } = require("./fishing-actions");
const { FishBuffs } = require("./enums/FishBuffs")
const { getActionFromCoordinates: getAction } = require("./pixels");
const { sleep, throttle } = require("./utils");
const { Items } = require("./enums/Items");
const { ProcessQueue } = require("./process-queue");
const { checkIsIgnored } = require("./enums/IgnoredFishes");
const { AutoRestart } = require("./auto-restart");

class FishingHandler {
    isEnabled = false

    playerId = undefined
    fishingId = 0

    activeBuffs = undefined
    equipments = undefined

    loopInterval = 0
    pullPoint = [0, 0]
    restPoint = [0, 0]
    throwPoint = [0, 0]
    fishBaitCoor = [0, 0]
    windowInstance

    /** @type {ProcessQueue} */
    processQueue
    /** @type {AutoRestart} */
    autoRestart

    constructor(
        pullPoint,
        restPoint,
        throwPoint,
        fishBaitCoor,
        win,
    ) {
        this.pullPoint = pullPoint
        this.restPoint = restPoint
        this.throwPoint = throwPoint
        this.fishBaitCoor = fishBaitCoor
        this.windowInstance = win

        this.consumeBuff = this.consumeBuff.bind(this)
        this.equipBuff = this.equipBuff.bind(this)
        this.start = this.start.bind(this)

        this.processQueue = new ProcessQueue()
        this.autoRestart = new AutoRestart(this.start, 15000)
    }

    setEnabled(isEnabled) {
        this.isEnabled = isEnabled

        if (isEnabled) {
            this.autoRestart.turnOn()
        } else {
            this.autoRestart.turnOff()
        }
    }

    updateThrowPoint(throwPoint) {
        this.throwPoint = throwPoint
    }

    updateFishingId(fishingId) {
        this.fishingId = fishingId
    }

    async updateState(parameters) {
        const fishingState = parameters[3];

        if (!fishingState) return;
        if (parameters[1] != this.fishingId) return;

        this.playerId = parameters[0];

        switch (fishingState) {
            case FishingState.HOOKED:
                await sleep(100);
                FishingActions.pull(this.throwPoint[0], this.throwPoint[1]);
                break;
            case FishingState.GET_AWAY:
            case FishingState.LOST:
            case FishingState.WIN:
                this.restart(this.playerId);
            default:
                break;
        }
        this.autoRestart.reboundTimeout()
    }

    async startPulling(playerId, parameters) {
        clearInterval(this.loopInterval)

        const isIgnored = checkIsIgnored(parameters)
        if (isIgnored) {
            await sleep(200)
            this.cancel()
            await this.restart(playerId)
            return;
        }

        this.loopInterval = setInterval(() => {
            const action = getAction(this.pullPoint, this.restPoint)

            switch (action) {
                case 'pull':
                    return FishingActions.pull(this.throwPoint[0], this.throwPoint[1])
                case 'rest':
                    return FishingActions.rest(this.throwPoint[0], this.throwPoint[1])
                default:
                    break;
            }
        }, 50)
        this.autoRestart.reboundTimeout()
    }

    stopPulling(firedByUser = false) {
        clearInterval(this.loopInterval)
        if (firedByUser) return;
        FishingActions.rest(this.throwPoint[0], this.throwPoint[1])
    }

    async start() {
        if (!this.isEnabled) return;
        this.windowInstance.setForeground();
        FishingActions.throwBait(this.throwPoint[0], this.throwPoint[1])
    }

    restart = throttle(async (playerId) => {
        if (playerId !== this.playerId) return;
        if (!this.isEnabled) return;

        this.stopPulling()
        await sleep(2000)
        await this.processQueue.executeAllSequential()
        await this.start()
        this.autoRestart.reboundTimeout()
    }, 1500)

    cancel() {
        FishingActions.cancel()
    }

    async equipBuff(playerId, parameters) {
        if (playerId !== this.playerId) return;

        const equipments = parameters?.[2]
        const potSlot = equipments?.[8] ?? 0
        const foodSlot = equipments?.[9] ?? 0

        this.potSlotItemId = potSlot
        this.foodSlotItemId = foodSlot

        if (potSlot === 0) {
            this.cancel()
            await FishingActions.equipBait(this.fishBaitCoor)
        }

        if (foodSlot === 0) {
            // Todo: implement equip seaweed
        }
    }

    async consumeBuff(playerId, parameters) {
        if (playerId !== this.playerId) return;

        const activeBuffs = parameters?.[1] ?? []

        const baitBuffActive = [
            FishBuffs.FishBaitT1a,
            FishBuffs.FishBaitT1b,
            FishBuffs.FishBaitT3a,
            FishBuffs.FishBaitT3b,
            FishBuffs.FishBaitT5a,
            FishBuffs.FishBaitT5b,
        ].some((buffId) => {
            return activeBuffs.includes(buffId);
        });
        // const baitEquiped = [
        //     Items.T1_FISHINGBAIT,
        //     Items.T3_FISHINGBAIT,
        //     Items.T5_FISHINGBAIT,
        // ].includes(this.potSlotItemId)

        const seaweedBuffActive = activeBuffs.includes(FishBuffs.SeaweedSalad);
        // const seaweedEquiped = this.foodSlotItemId === Items.T1_MEAL_SEAWEEDSALAD;

        if (!baitBuffActive) {
            this.stopPulling();
            FishingActions.consumeBait();
            await sleep(1000);
            this.restart()
        }

        if (!seaweedBuffActive) {
            // Todo: implement for seaweed salad
        }
    }

    addToQueue(handle, ...args) {
        this.processQueue.addProcess(handle, args)
    }
}

module.exports = {
    FishingHandler
}