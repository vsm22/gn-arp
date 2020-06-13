class Buffer {
    constructor(o, host) {
        this.HOST = host;

        o = o !== undefined ? o : {};
        this.BUFFER_SIZE = o.BUFFER_SIZE !== undefined ? o.BUFFER_SIZE : 100;
        this.NUM_EVENTS_THRESHOLD = o.NUM_EVENTS_THRESHOLD !== undefined ? o.NUM_EVENTS_THRESHOLD : 20;
        
        this.buffer = [];
        this.writeIdx = 0;
        this.numEventsOccured = 0;
        this.latestBufferedTime = this.curTime;
    }

    notifyEventOccured() {
        this.numEventsOccured++;
        if (this.numEventsOccured >= this.NUM_EVENTS_THRESHOLD) {
            this.reportEventThresholdReached(this.NUM_EVENTS_THRESHOLD);
        }
    }

    reportEventThresholdReached() {
        host.notifyEventThresholdReached(this, this.NUM_EVENTS_THRESHOLD);
    }
}

module.exports = Buffer;