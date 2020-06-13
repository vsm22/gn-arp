class PatternHolder {
    constructor(o) {
        o = o !== undefined ? o : {};        
        this.gamut = o.gamut;
        this.color = o.color;
        this.talea = o.talea;
        this.latestPatternHolderedTime = this.curTime;
    }

    setGamut(gamut) {
        this.gamut = gamut;
    }

    setColor(color) {
        this.color = color;
    }

    setTalea(tale) {
        this.talea = talea;
    }

    peekNextEvent() {
        
    }
}

module.exports = PatternHolder;