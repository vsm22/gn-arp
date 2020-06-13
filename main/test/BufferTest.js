const assert = require("assert");
const Buffer = require("../js/Buffer");
const Host = require("../js/Host");

describe("Buffer", () => {

    describe("#constructor", () => {

        it("Should construct a Buffer object", () => {
            const buffer = new Buffer();
            assert(buffer instanceof Object);
            assert(buffer instanceof Buffer);
        });
    });
    
    describe("event threshold", () => {

        it("Should be reached", () => {

        });
    });
});