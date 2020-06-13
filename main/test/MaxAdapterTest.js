const assert = require("assert");
const MaxAdapter = require("../js/MaxAdapter");
const EventType = require("../js/EventType");

describe("MaxAdapter", () => {

    let maxApi;

    beforeEach(() => {
        maxApi = {};
        maxApi.addHandlers = (handlers) => {};
    });

    describe("#constructor", () => {

        it("Should construct a MaxAdapter object", () => {
            const maxAdapter = new MaxAdapter(maxApi);
            assert(maxAdapter instanceof Object);
            assert(maxAdapter instanceof MaxAdapter);
        });

        it("Should throw an exception if no MaxAPI provided", () => {
            assert.throws(() => new MaxAdapter(), Error, "No valid MaxAPI provided");
        });
    });

    describe("#getEventMessageArr", () => {

        let maxAdapter;

        beforeEach(() => {
            maxAdapter = new MaxAdapter(maxApi);
        });

        it("Should convert note events to event messages correctly in a basic scenario", () => {
            let eventArr = [{ 
                    type: EventType.NOTE,
                    note: {pitch: 60, velocity: 110, duration: 200},
                    time: {bar: 1, beat: 1, tick: 0 }
                }, {
                    type: EventType.NOTE,
                    note: {pitch: 62, velocity: 120, duration: 100},
                    time: {bar: 1, beat: 3, tick: 240}
                }, {
                    type: EventType.NOTE,
                    note: {pitch : 64, velocity: 127, duration: 500},
                    time: {bar: 2, beat: 2, tick: 360}
                }];
            
            let eventMessageArr = maxAdapter.getEventMessageArr(eventArr);

            assert.strictEqual(eventMessageArr[0], "target 1");
            assert.strictEqual(eventMessageArr[1], "eventType note");
            assert.strictEqual(eventMessageArr[2], "pitch 60");
            assert.strictEqual(eventMessageArr[3], "velocity 110");
            assert.strictEqual(eventMessageArr[4], "duration 200");
            assert.strictEqual(eventMessageArr[5], "timepoint 1.1.0");
            
            assert.strictEqual(eventMessageArr[6], "target 2");
            assert.strictEqual(eventMessageArr[7], "eventType note");
            assert.strictEqual(eventMessageArr[8], "pitch 62");
            assert.strictEqual(eventMessageArr[9], "velocity 120");
            assert.strictEqual(eventMessageArr[10], "duration 100");
            assert.strictEqual(eventMessageArr[11], "timepoint 1.3.240");

            assert.strictEqual(eventMessageArr[12], "target 3");
            assert.strictEqual(eventMessageArr[13], "eventType note");
            assert.strictEqual(eventMessageArr[14], "pitch 64");
            assert.strictEqual(eventMessageArr[15], "velocity 127");
            assert.strictEqual(eventMessageArr[16], "duration 500");
            assert.strictEqual(eventMessageArr[17], "timepoint 2.2.360");
        });
    });
}); 