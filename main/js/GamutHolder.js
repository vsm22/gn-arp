class GamutHolder {
    constructor(o) {
        o = o !== undefined ? o : {};
        this.appliesTo = o.appliesTo !== undefined ? o.appliesTo : "pitch";
        this.gamut = [];
    }

    add(val) {
        try {
            this.gamut.push(val);
        } catch(ex) { 
            console.log(ex); 
        }
    }

    remove(val) {
        try {
            this.gamut = this.gamut.filter(gamutVal => gamutVal !== val);
        } catch(ex) { 
            console.log(ex); 
        }
    }
    
    getGamut() {
        try {
            return Array.from(this.gamut);
        } catch (ex) {
            console.log(ex);
        }
    }
}

module.exports = GamutHolder;