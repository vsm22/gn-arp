class Color {
    constructor(o) {
        o = o !== undefined ? o : {};
        this.curIdx = 0;
        this.color = [];
    }
}

module.exports = Color;