const assert = require("assert");
const Host = require("../js/Host");

describe("Host", () => {

    let adapter;

    beforeEach(() => {
        adapter = {
            registerHost: (host) => {}
        }
    });

    describe("#constructor", () => {

        it("Should construct a Host object", () => {
            const host = new Host({}, adapter);
            assert(host instanceof Object);
            assert(host instanceof Host);
        });
    });

    describe("Event notification", () => { 

        it("Should start with 0", () => {
            const host = new Host({}, adapter);
            assert.equal(host.getNumEventsSinceFlush(), 0);
        });

        it("Should augment numEvents when notified", () => {
            const host = new Host({}, adapter);
            assert.equal(host.getNumEventsSinceFlush(), 0);
            host.notifyEventOccurred();
            host.notifyEventOccurred();
            host.notifyEventOccurred();
            assert.equal(host.getNumEventsSinceFlush(), 3);
        });
    });
});