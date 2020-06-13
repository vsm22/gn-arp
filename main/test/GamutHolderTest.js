const assert = require("assert");
const GamutHolder = require("../js/GamutHolder");

describe("GamutHolder", () => {

    describe("#constructor", () => {

        it("Should construct a GamutHolder object", () => {
            const gamutHolder = new GamutHolder();
            assert(gamutHolder instanceof Object);
            assert(gamutHolder instanceof GamutHolder);
        });
    });

    describe("Adding and removing values", () => {
        it("Should add and and remove values correctly", () => {
            const gamutHolder = new GamutHolder();
            gamutHolder.values = [1, 2, 3, 4, 5];
            gamutHolder.add(6);
            gamutHolder.add(7);
            assert(gamutHolder.getGamut().includes(6));
            assert(gamutHolder.getGamut().includes(7));
            gamutHolder.remove(2);
            gamutHolder.remove(4);
            assert(gamutHolder.getGamut().includes(2) === false);
            assert(gamutHolder.getGamut().includes(4) === false);
        });
    });
});