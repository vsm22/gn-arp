var p = this.patcher;
var timepoint = p.getnamed("#0timepoint");
var when = p.getnamed("#0when");

var pitchObj = p.getnamed("#0pitch");
var velocityObj = p.getnamed("#0velocity");
var durationObj = p.getnamed("#0duration");

var gamut = [];
var color = [0, 2, 5];
var talea = ["1/8", "1/16", "1/16", "1/16", "1/32", "1/32"];

var colorIdx = 0;
var taleaIdx = 0;

var beatsPerBar = 4;
var ticksPerBeat = 480;

//480 ticks per quarter
var curTimestamp = 0;
var cuedTimestamp = 0;

var curTime = {
	bar: 1,
	beat: 1,
	tick: 0
};

var cuedTime = {
	bar: 1,
	beat: 1,
	tick: 0
};

var cuedNote = {
	pitch: 60,
	velocity: 127,
	duration: 200
};
	
function queryCurTime() {
	when.message("bang");
}

function setCurTime(bar, beat, tick) {
	curTime.bar = bar;
	curTime.beat = beat;
	curTime.tick = tick;

	curTimestamp = calcTimestamp(curTime);
}

function calcTimestamp(time) {
	return ((time.bar - 1) * beatsPerBar * ticksPerBeat) + ((time.beat - 1) * ticksPerBeat) + time.tick;
}

function setNextEvent() {

	queryCurTime();

	if (curTimestamp > cuedTimestamp
		&& gamut.length > 0 && talea.length > 0 && color.length > 0) {

		calcCuedTime();

		timepoint.message(formatTimestamp(cuedTime));

		var gamutIdx = Math.min(gamut.length - 1, color[colorIdx]);
		cuedNote.pitch = gamut[gamutIdx];

		pitchObj.message("set", cuedNote.pitch);
		velocityObj.message("set", cuedNote.velocity);
		durationObj.message("set", cuedNote.duration);

		taleaIdx = (taleaIdx + 1) % talea.length;
		colorIdx = (colorIdx + 1) % color.length;
	}
}

function calcCuedTime() {
	cuedTime.tick += calcDuration(talea[taleaIdx]);

	if (cuedTime.tick >= ticksPerBeat) {
		cuedTime.beat++;
		cuedTime.tick = cuedTime.tick % ticksPerBeat;
	}

	if (cuedTime.beat > beatsPerBar) {
		cuedTime.bar++;
		cuedTime.beat = cuedTime.beat % beatsPerBar;
	}

	cuedTimestamp = calcTimestamp(cuedTime);

	if (cuedTimestamp < curTimestamp) {
		cuedTime.beat = curTime.beat;
		calcCuedTime();
	}
}

function formatTimestamp(time) {
	return time.bar + "." + time.beat + "." + time.tick;
}

/**
 * Calculate the a duration in ticks
 * =================================
 */
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

	//compressColor();
	post("\ncolor: " + color);
	setNextEvent();
}

function removeFromGamut(pitch) {
	for (var idx = 0; idx < gamut.length; idx++) {
		if (gamut[idx] == pitch) {
			gamut.splice(idx, 1);
		}
	}

	//compressColor();
	post("\ncolor: " + color);
	setNextEvent();
}

function compressColor() {
	var maxColorIdx = 0; 
	for (var i = 0; i < color.length; i++) {
		maxColorIdx = Math.max(maxColorIdx, color[i]);
	}

	var ratio = 1.0 * maxColorIdx / gamut.length;
	post("\nratio: " + ratio);

	for (var i = 0; i < color.length; i++) {
		color[i] = Math.floor(color[i] * ratio);
	}
}