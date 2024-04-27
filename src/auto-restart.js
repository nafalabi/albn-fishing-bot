class AutoRestart {
    timeoutTime = 15000
    actionOnTimeout = () => { }
    id = 0

    constructor(
        actionOnTimeout,
        timeoutTime,
    ) {
        this.timeoutTime = timeoutTime
        this.actionOnTimeout = actionOnTimeout
    }

    turnOn = () => {
        clearTimeout(this.id)
        this.id = setTimeout(() => {
            this.actionOnTimeout()
            this.turnOn()
        }, this.timeoutTime)
    }

    turnOff = () => {
        clearTimeout(this.id)
        this.id = 0
    }

    reboundTimeout = () => {
        this.turnOn()
    }

}

module.exports = {
    AutoRestart,
}