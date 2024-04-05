const { Window } = require('win-control')
const { initListener } = require('./src/event-listener')
const { FishingEvents } = require('./src/enums/FishingEvents')
const { FishingHandler } = require('./src/fishing-handler')
const { getTargetCoordinates, getCurMouseCoor } = require('./src/dimensions')

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
} = getTargetCoordinates(win)

const listener = initListener();
const fishingHandler = new FishingHandler(
    pullPoint,
    restPoint,
    throwPoint,
    fishBaitCoor,
    win,
);

listener.on('event', async (res) => {
    if (!fishingHandler.isEnabled) return;

    const parameters = res['parameters']
    const eventCode = parameters[252]
    const playerId = parameters[0]
    if (!eventCode) return

    switch (eventCode) {
        case FishingEvents.FishingStart:
            await fishingHandler.updateState(parameters);
            break;
        case FishingEvents.FishingMiniGame:
            await fishingHandler.startPulling(playerId, parameters);
            break;
        case FishingEvents.FishingFinished:
            await fishingHandler.restart(playerId);
            break;
        case FishingEvents.FishingCancel:
            await fishingHandler.restart(playerId);
            break;
        case FishingEvents.CharacterEquipmentChanged:
            fishingHandler.addToQueue(fishingHandler.equipBuff, playerId, parameters);
            break;
        case FishingEvents.ActiveSpellEffectsUpdate:
            fishingHandler.addToQueue(fishingHandler.consumeBuff, playerId, parameters);
            break;
        default:
            break;
    }
})

listener.on('request', async (req) => {
    const requestId = req?.['parameters']?.[253]
    switch (requestId) {
        // bait touch water -> enable program
        case 316:
            if (fishingHandler.isEnabled) return;
            console.log('User: enable program')
            const fishingId = req.parameters[2];
            fishingHandler.updateFishingId(fishingId);
            const newThrowPoint = getCurMouseCoor();
            fishingHandler.updateThrowPoint(newThrowPoint)
            fishingHandler.setEnabled(true)
            break;
        // character move -> disable program
        case 21:
            if (!fishingHandler.isEnabled) return;
            console.log('User: disable program')
            fishingHandler.stopPulling(true);
            fishingHandler.setEnabled(false);
            break;
        default:
            break;
    }
})
