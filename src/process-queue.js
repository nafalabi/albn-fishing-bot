class ProcessQueue {
    inQueue = []

    constructor() { }

    addProcess(handle, args) {
        const exists = this.inQueue.some(val => val[0] === handle)
        if (exists) {
            const index = this.inQueue.indexOf(exists)
            this.inQueue[index] = [handle, args];
            return;
        }
        this.inQueue.push([handle, args])
    }

    async executeAllSequential() {
        for (const item of this.inQueue) {
            const handle = item[0]
            const args = item[1]
            await handle(...args);
        }
        this.inQueue = []
    }
}

module.exports = {
    ProcessQueue,
}