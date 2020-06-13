const Host = require("./Host");
const EventType = require("./EventType");

class MaxAdapter {
    constructor(max) {
        this.max = max;
        this.host = null;
        this.validateMaxAPI();
    }

    // ==============================================================
    // Setup and validations
    // ==============================================================

    registerHost(host) {
        this.host = host;
        this.addHandlers;
    }

    addHandlers() {
        this.max.addHandlers({
            "notifyCurTime": this.host.notifyCurTime,
            "notifyEventOccurred": this.host.notifyEventOccurred
        });
    }

    validateMaxAPI() {
        if (this.max === null || this.max === undefined) {
            throw new Exception("No valid MaxAPI provided");
        } 
    }

    // ==============================================================
    // Event notifications
    // ==============================================================

    /**
     * Flush an array of events as messages to Max. 
     */
    flushEvents(eventArr) {
        this.outputEventMessages(this.getEventMessageArr(eventArr));
    }

    /**
     * Convert an array of events to an array of messages that will
     * be sent out to Max. The resulting messages will look like 
     * "target 1", "eventType note", "pitch 60", "velocity 80",
     * "duration 50", "timepoint 1.3.240"
     */
    getEventMessageArr(eventArr) {
        let eventMessageArr = [];
        let targetIdx = 1;
        eventArr.forEach(event => {
            eventMessageArr.push("target " + targetIdx);
            targetIdx++;
            if (event.type === EventType.NOTE) {
                eventMessageArr.push("eventType note");
                eventMessageArr.push("pitch " + event.note.pitch);
                eventMessageArr.push("velocity " + event.note.velocity);
                eventMessageArr.push("duration " + event.note.duration);
                eventMessageArr.push("timepoint " + event.time.bar 
                        + "." + event.time.beat 
                        + "." + event.time.tick);
           }
        });
        return eventMessageArr;
    }

    /**
     * Output messages from eventMessageArr to Max. 
     */
    outputEventMessages(eventMessageArr) {
        eventMessageArr.forEach(message => {
            this.max.outlet(message);
        });
    }
}

module.exports = MaxAdapter;