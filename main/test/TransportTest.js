let assert = require("assert");
let Transport = require("../js/Transport");

describe("Transport", () => {

    describe("#constructor", () => {

        it("Should construct a Transport object", () => {
            const transport = new Transport();
            assert(transport instanceof Object);
            assert(transport instanceof Transport);
        });

        it("Should have the expected defaults", () => {
            const transport = new Transport();
            assert.equal(transport.BEATS_PER_BAR, 4);
            assert.equal(transport.TICKS_PER_BEAT, 480);
        });
    });
    
    describe("#getCurTime and #setCurTime", () => {
        it ("Should start with a default time", () => {
            const transport = new Transport();
            assert.deepEqual(transport.getCurTime(), {bar: 1, beat: 1, tick: 0});
        });

        it ("Should be able to set a new curTime", () => {
            const transport = new Transport();
            let newTime = {bar: 3, beat: 4, tick: 360};
            transport.setCurTime(newTime);
            assert.deepEqual(transport.getCurTime(), {bar: 3, beat: 4, tick: 360});
        });

        it ("Should not expose internal references in time object directly", () => {
            const transport = new Transport();
            let newTime = {bar: 3, beat: 4, tick: 360};
            transport.setCurTime(newTime);
            assert.deepEqual(transport.getCurTime(), {bar: 3, beat: 4, tick: 360});
            assert.notEqual(transport.getCurTime(), newTime);
            newTime.bar = 12;
            newTime.beat = 3;
            assert.deepEqual(transport.getCurTime(), {bar: 3, beat: 4, tick: 360});
        });
    });
});