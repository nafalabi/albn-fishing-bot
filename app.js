const { Window } = require('win-control')
const { initListener } = require('./src/event-listener')
const { FishingEvents } = require('./src/enums/FishingEvents')
const { FishingHandler } = require('./src/fishing-handler')
const { getTargetCoordinates } = require('./src/dimensions')
const { checkIsIgnored } = require('./src/enums/IgnoredFishes')
const { sleep } = require('./src/utils')

const win = Window.getByTitle('Albion Online Client')

if (!win) {
    console.log('process not found')
    process.exit(1)
}

const {
    pullPoint,
    restPoint,
    throwPoint,
} = getTargetCoordinates(win)

const listener = initListener();
const fishingHandler = new FishingHandler(
    pullPoint,
    restPoint,
    throwPoint,
    win,
);

fishingHandler.start();

listener.on('event', async (res) => {
    const parameters = res['parameters']
    const eventCode = parameters[252]
    const fishingId = parameters[0]
    if (!eventCode) return

    switch (eventCode) {
        case FishingEvents.FishingStart:
            await fishingHandler.updateState(parameters);
            break;
        case FishingEvents.FishingMiniGame:
            const isIgnored = checkIsIgnored(parameters)
            if (isIgnored) {
                await sleep(200)
                fishingHandler.cancel()
                await fishingHandler.restart(fishingId)
                return;
            }
            fishingHandler.startPulling();
            break;
        case FishingEvents.FishingFinished:
            await fishingHandler.restart(fishingId);
            break;
        case FishingEvents.FishingCancel:
            await fishingHandler.restart(fishingId);
            break;
        default:
            break;
    }
})

listener.on('request', async (req) => {
    // check if fishing request 
    if (req?.['parameters']?.[253] != 316) {
        return;
    }
    const playerId = req.parameters[2];
    fishingHandler.updatePlayerId(playerId)
})
