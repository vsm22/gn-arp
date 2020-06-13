class Transport {
    constructor(o) {
        o = o !== undefined ? o : {};

        this.BEATS_PER_BAR = o.BEATS_PER_BAR !== undefined ? o.BEATS_PER_BAR : 4;
        this.TICKS_PER_BEAT = o.TICKS_PER_BEAT !== undefined ? o.TICKS_PER_BEAT : 480;
    
        this.curTime = o.curTime !== undefined ? o.curTime : {bar: 1, beat: 1, tick: 0};
    }
    
    setCurTime(time) {
        try {
            this.curTime = {...time};
        } catch (ex) {
            console.log(ex);
        }
    }
    
    getCurTime() {
        try {
            return {...this.curTime};
        } catch (ex) {
            console.log(ex);
        }
    }

    /**
     * Convert a timestamp to ticks.
     * @param {bar, beat, tick} time 
     */
    timeToTicks(time) {
        let ticks = ((time.bar - 1) * this.BEATS_PER_BAR * this.TICKS_PER_BEAT)
            + ((time.beat - 1) * this.TICKS_PER_BEAT)
            + time.tick;
        return ticks;
    }
}

module.exports = Transport;