const Max = require("max-api");
const MaxAdapter = require("../js/MaxAdapter");

let maxAdapter = new MaxAdapter(Max);

let messages = [
    "target 1",
    "eventType note",
    "pitch 60",
    "velocity 100",
    "duration 200",
    "timepoint 1.1.0",

    "target 2",
    "eventType note",
    "pitch 62",
    "velocity 110",
    "duration 200",
    "timepoint 1.2.0",

    "target 3",
    "eventType note",
    "pitch 64",
    "velocity 127",
    "duration 200",
    "timepoint 1.3.0",

    "target 4",
    "eventType note",
    "pitch 65",
    "velocity 127",
    "duration 200",
    "timepoint 1.3.240",
];

Max.addHandlers({
    "testOutputEventMessages": () => maxAdapter.outputEventMessages(messages)
});
