/**
 * Get an array of messages to send to max in order to buffer some note events.
 * 
 */
function getNoteEventMessages(noteEventArr, curEventBufferIdx, eventBufferSize) {
    
    let bufferIdx = curEventBufferIdx;
    
    return noteEventArr.map(noteEvent => {
        let message = {
            "target": bufferIdx + 1,
            "timepoint": formatTimepoint(noteEvent.time),
            "pitch": noteEvent.note.pitch,
            "velocity": noteEvent.note.velocity,
            "duration": noteEvent.note.duration
        };

        bufferIdx = (bufferIdx + 1) % eventBufferSize;

        return message;
    })
}
exports.getNoteEventMessages = getNoteEventMessages;


/**
 * Get an array of note events to buffer.
 * 
 */
function getNoteEventQueue(numEventsToBuffer, curTime, gamut, talea, color, taleaIdx, colorIdx, beatsPerBar, ticksPerBeat) {

	let events = [];

	for (let i = 0; i < numEventsToBuffer; i++) {
		let prevEventTime = events.length > 0 
			? events[events.length - 1].time
			: curTime;

		let nextEventTime = getNextEventTime(prevEventTime, talea, taleaIdx, beatsPerBar, ticksPerBeat);
		taleaIdx = (taleaIdx + 1) % talea.length;
		
		let nextNote = getNextNote(gamut, color, colorIdx);
		colorIdx = (colorIdx + 1) % color.length;

		let nextEvent = {
			time: nextEventTime,
			note: nextNote
		}

		events.push(nextEvent);
	}

	return events;
}
exports.getNoteEventQueue = getNoteEventQueue;


/**
 * Get next note.
 *
 */
function getNextNote(gamut, color, colorIdx) {
	let note = {
		pitch: getNextPitch(gamut, color, colorIdx),
		velocity: getNextVelocity(),
		duration: getNextDuration()
	}

	return note;
}
exports.getNextNote = getNextNote;


/**
 * Get the next pitch.
 * 
 */
function getNextPitch(gamut, color, colorIdx) {
	let gamutIdx = Math.min(gamut.length - 1, color[colorIdx]);
    let pitch = gamut[gamutIdx];
    return pitch;
}
exports.getNextPitch = getNextPitch;


/**
 * Get the next velocity.
 * 
 */
function getNextVelocity(velocityGamut, velocityColor, colorIdx) {
    return 127;
}
exports.getNextVelocity = getNextVelocity;


/**
 * Get the next duration.
 * 
 */
function getNextDuration(durationGamut, durationColor, colorIdx) {
    return 200;
}
exports.getNextDuration = getNextDuration;


/**
 * Get the next event time.
 * 
 */
const getNextEventTime = (prevEventTime, talea, taleaIdx, beatsPerBar, ticksPerBeat) => {
	
	let nextEventTime = { ...prevEventTime }; 

	nextEventTime.tick += calcDuration(talea[taleaIdx]);

	if (nextEventTime.tick >= ticksPerBeat) {
		nextEventTime.beat++;
		nextEventTime.tick = nextEventTime.tick % ticksPerBeat;
	}

	if (nextEventTime.beat > beatsPerBar) {
		nextEventTime.bar++;
		nextEventTime.beat = nextEventTime.beat % beatsPerBar;
	}

	return nextEventTime;
}
exports.getNextEventTime = getNextEventTime;


/**
 * Convert a timepoint to a string in bar.beat.tick format. 
 *
 */
function formatTimepoint(time) {
	return time.bar + "." + time.beat + "." + time.tick;
}
exports.formatTimepoint = formatTimepoint;


/**
 * Calculate the duration, in ticks for a note given as a string, i.e. "1/8", "3/4" etc.
 * 
 */
function calcDuration(durStr) {
	var dur = durStr.split("\/");
	var durNumerator = dur[0];
	var durDenominator = dur[1];

	var ticks = durNumerator * (480 / (durDenominator / 4));
	return ticks;
}
exports.calcDuration = calcDuration;

/**
 * Convert time to ticks.
 * 
 */
function timeToTicks(time, beatsPerBar, ticksPerBeat) {
    let ticks = ((time.bar - 1) * beatsPerBar * ticksPerBeat)
        + ((time.beat - 1) * ticksPerBeat)
        + time.tick;

    return ticks;
}
exports.timeToTicks = timeToTicks;