const Max = require("max-api");

var GAMUT = [60, 62, 64];
var COLOR = [0, 2, 5];
var TALEA = ["1/8", "1/16", "1/16", "1/16", "1/32", "1/32"];

var COLOR_IDX = 0;
var TALEA_IDX = 0;

var BEATS_PER_BAR = 4;
var TICKS_PER_BEAT = 480;

let DEFAULT_VELOCITY = 127;
let DEFAULT_DURATION = 200;

let CUR_BUFFER_IDX = 0;
let BUFFER_SIZE = 100;

var CUR_TIME = {
	bar: 1,
	beat: 1,
	tick: 0
};

Max.addHandlers({
	"queryCurTime": queryCurTime,
	"setCurTime": setCurTime,
	"appendToGamut": appendToGamut,
	"removeFromGamut": removeFromGamut,
	"bufferNoteEvents": bufferNoteEvents
});

function queryCurTime(Max) {
	Max.outlet("when");
}

function setCurTime(bar, beat, tick) {
	CUR_TIME.bar = bar;
	CUR_TIME.beat = beat;
	CUR_TIME.tick = tick;
}

function bufferNoteEvents(numEvents) {
	
	queryCurTime();
	
	let events = getNoteEventsQueue(numEvents, CUR_TIME);

	events.forEach(event => {
		Max.outlet("target", CUR_BUFFER_IDX + 1);
		Max.outlet("timepoint", formatTimestamp(event.time));
		Max.outlet("pitch", event.note.pitch);
		Max.outlet("velocity", event.note.velocity);
		Max.outlet("duration", event.note.duration);

		CUR_BUFFER_IDX = (CUR_BUFFER_IDX + 1) % BUFFER_SIZE;
	});
}

function getNoteEventsQueue(numEventsToBuffer, curTime) {

	let events = [];

	for (let i = 0; i < numEventsToBuffer; i++) {
		let prevEventTime = events.length > 0 
			? events[events.length - 1].time
			: curTime;

		let nextEventTime = calcNextEventTime(prevEventTime, TALEA_IDX);
		TALEA_IDX = (TALEA_IDX + 1) % TALEA.length;
		
		let nextNote = calcNextNote(GAMUT, COLOR_IDX);
		COLOR_IDX = (COLOR_IDX + 1) % COLOR.length;

		let nextEvent = {
			time: nextEventTime,
			note: nextNote
		}

		events.push(nextEvent);
	}

	return events;
}

function calcNextNote(gamut, colorIdx) {
	let note = {
		pitch: 0,
		velocity: DEFAULT_VELOCITY,
		duration: DEFAULT_DURATION
	}

	let gamutIdx = Math.min(gamut.length - 1, COLOR[colorIdx]);
	note.pitch = gamut[gamutIdx];
	
	return note;
}

function calcNextEventTime(prevEventTime, taleaIdx) {
	
	let nextEventTime = { ...prevEventTime }; 

	nextEventTime.tick += calcDuration(TALEA[taleaIdx]);

	if (nextEventTime.tick >= TICKS_PER_BEAT) {
		nextEventTime.beat++;
		nextEventTime.tick = nextEventTime.tick % TICKS_PER_BEAT;
	}

	if (nextEventTime.beat > BEATS_PER_BAR) {
		nextEventTime.bar++;
		nextEventTime.beat = nextEventTime.beat % BEATS_PER_BAR;
	}

	return nextEventTime;
}

function formatTimestamp(time) {
	return time.bar + "." + time.beat + "." + time.tick;
}

function calcDuration(durStr) {
	var dur = durStr.split("\/");
	var durNumerator = dur[0];
	var durDenominator = dur[1];

	var ticks = durNumerator * (480 / (durDenominator / 4));
	return ticks;
}

function appendToGamut(pitch) {
	gamut.push(pitch);
	gamut.sort();
}

function removeFromGamut(pitch) {
	for (var idx = 0; idx < gamut.length; idx++) {
		if (gamut[idx] == pitch) {
			gamut.splice(idx, 1);
		}
	}
}