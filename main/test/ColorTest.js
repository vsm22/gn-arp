const assert = require("assert");
const Color = require("../js/Color");

describe("Color", () => {

    describe("#constructor", () => {

        it("Should construct a Color object", () => {
            const color = new Color();
            assert(color instanceof Object);
            assert(color instanceof Color);
        });
    });
});