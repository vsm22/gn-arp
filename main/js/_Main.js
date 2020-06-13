const Max = require('max-api');
const ArpNotes = require('./ArpNotes');
const ArpEvents = require('./ArpEvents');

var GAMUT = [60, 62, 64];
var COLOR = [0, 2, 5];
var TALEA = ["1/8", "1/16", "1/16", "1/16", "1/32", "1/32"];

var COLOR_IDX = 0;
var TALEA_IDX = 0;

var BEATS_PER_BAR = 4;
var TICKS_PER_BEAT = 480;

let CUR_BUFFER_IDX = 0;
let BUFFER_SIZE = 100;

let CUR_TIME = { bar: 1, beat: 1, tick: 0 };
let LAST_BUFFERED_TIME = { bar: 1, beat: 1, tick: 0 };

function getCurTime() {
    Max.outlet("when");
}

function setCurTime(bar, beat, tick) {
    CUR_TIME = { bar: bar, beat: beat, tick: tick };
}

function setLastBufferedTime(bar, beat, tick) {
    LAST_BUFFERED_TIME = { bar, beat, tick };
}

function bufferNoteEvents(numEvents, bar, beat, tick) {

    CUR_TIME = { bar, beat, tick };

    Max.post("LAST_BUFFERED_TIME: " + ArpEvents.formatTimepoint(LAST_BUFFERED_TIME));
    Max.post("CUR_TIME: " + ArpEvents.formatTimepoint(CUR_TIME));
 
    let refTime = (ArpEvents.timeToTicks(CUR_TIME, BEATS_PER_BAR, TICKS_PER_BEAT) >= ArpEvents.timeToTicks(LAST_BUFFERED_TIME, BEATS_PER_BAR, TICKS_PER_BEAT))
        ? CUR_TIME : LAST_BUFFERED_TIME;

    Max.post("refTime: " + ArpEvents.formatTimepoint(refTime));
     
    let noteEvents = ArpEvents.getNoteEventQueue(numEvents, refTime, GAMUT, TALEA, COLOR, TALEA_IDX, COLOR_IDX, BEATS_PER_BAR, TICKS_PER_BEAT);
    if (noteEvents && noteEvents.length > 0) {
        TALEA_IDX = (TALEA_IDX + numEvents) % TALEA.length;
        COLOR_IDX = (COLOR_IDX + numEvents) % COLOR.length;
        LAST_BUFFERED_TIME = noteEvents[noteEvents.length - 1].time;
    }

    Max.post("CUR_BUFFER_IDX before: " + CUR_BUFFER_IDX);

    let messages = ArpEvents.getNoteEventMessages(noteEvents, CUR_BUFFER_IDX, BUFFER_SIZE);

    messages.forEach(message => {
        Object.entries(message).forEach(([key, value]) => {
            Max.outlet(key, value);
        });
    });
    
    CUR_BUFFER_IDX = (messages !== null && messages !== undefined && messages.length > 0) 
        ? messages[messages.length - 1]["target"]
        : CUR_BUFFER_IDX;

    Max.post("CUR_BUFFER_IDX after: " + CUR_BUFFER_IDX);
}
exports.bufferNoteEvents = bufferNoteEvents;

Max.addHandlers({
	"queryCurTime": getCurTime,
    "setCurTime": setCurTime,
    "setLastBufferedTime": setLastBufferedTime,
	"appendToGamut": (pitch) => ArpNotes.appendToGamut(GAMUT, pitch),
	"removeFromGamut": (pitch) => ArpNotes.removeFromGamut(GAMUT, pitch),
    "bufferNoteEvents": bufferNoteEvents,
    "notifyEventProcessed": notifyEventProcessed(NUM_PROCESSED, THRESHOLD)
});