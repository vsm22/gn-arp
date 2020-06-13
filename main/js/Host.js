const Buffer = require("./Buffer");
const Transport = require("./Transport");

class Host {
    constructor(o, adapter) {
        this.buffer = [];
        this.transport = new Transport();
        this.patternArr = [];
        this.NUM_EVENTS_SINCE_FLUSH = 0;
        this.NUM_EVENTS_THRESHOLD = 50;
        this.CUR_BUFFER_IDX = 0;
        this.adapter = adapter;
        this.adapter.registerHost(this);
    }
  
    notifyEventThresholdReached(buffer, numEvents) {
        pattern = [];
        buffer.notifyBufferPattern(pattern);
    }

    notifyCurTime(time) {
        try {
            this.transport.setCurTime(time);
        } catch (ex) {
            console.log(ex);
        }
    }

    addPattern(pattern) {
        this.patternArr.push(pattern);
    }

    notifyEventOccurred(event) {
        try {
            this.NUM_EVENTS_SINCE_FLUSH++;
            
            if (this.NUM_EVENTS_SINCE_FLUSH > this.NUM_EVENTS_THRESHOLD) {
                let nextEvents = this.getNextEvents(this.NUM_EVENTS_THRESHOLD);
                nextEvents.forEach(nextEvent => {
                    buffer[this.CUR_BUFFER_IDX] = nextEvent;
                    this.CUR_BUFFER_IDX = (this.CUR_BUFFER_IDX + 1) % this.buffer.length;
                });
                this.flushBuffer();
            }

        } catch (ex) {
            console.log(ex);
        }
    }

    getNumEventsSinceFlush() {
        return this.NUM_EVENTS_SINCE_FLUSH;
    }

    flushBuffer() {
        this.adapter.flushEvents(buffer);
        this.NUM_EVENTS_SINCE_FLUSH = 0;
    }

    getNextEvents(numEvents) {
        let nextEventArr = [];

        while(numEvents > 0) {
            let minTicks = -1; 
            let nextEventPatternIdx = -1; // Which pattern will the next event come from?

            this.patternArr.forEach((pattern, patternIdx) => {
                let patternTime = pattern.peekNextEvent().time;
                let patternTicks = this.transport.timeToTicks(patternTime);
                if (minTicks === -1 || patternTicks < minTicks) {
                    nextEventPatternIdx = patternIdx;
                }
            });

            let nextEvent = this.patternArr[nextEventPatternIdx].popNextEvent();
            nextEventArr.push(nextEvent);
        }

        return nextEventArr;
    }
}

module.exports = Host;