var assert = require('assert');
var ArpEvents = require('../js/ArpEvents');
var calcDuration = ArpEvents.calcDuration;
var getNoteEventMessages = ArpEvents.getNoteEventMessages;
var getNoteEventQueue = ArpEvents.getNoteEventQueue;
var getNextNote = ArpEvents.getNextNote;
var getNextPitch = ArpEvents.getNextPitch;
var getNextVelocity = ArpEvents.getNextVelocity;
var getNextDuration = ArpEvents.getNextDuration;
var timeToTicks = ArpEvents.timeToTicks;

describe('ArpEvents', function() {

    describe('#getNoteEventMessages', function() {
        it('produces expected event messages in a basic scenario', function() {
            let noteEvents = [
                {
                    time: {
                        bar: 1,
                        beat: 1,
                        tick: 0
                    },
                    note: {
                        pitch: 60,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 2,
                        beat: 1,
                        tick: 240
                    },
                    note: {
                        pitch: 62,
                        velocity: 100,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 2,
                        beat: 3,
                        tick: 360
                    },
                    note: {
                        pitch: 54,
                        velocity: 30,
                        duration: 20
                    }
                }
            ]

            let noteEventMessages = getNoteEventMessages(noteEvents, 8, 10);
            assert.deepEqual(noteEventMessages, [
                {
                    "target": 9,
                    "timepoint": "1.1.0",
                    "pitch": 60,
                    "velocity": 127,
                    "duration": 200 
                },
                {
                    "target": 10,
                    "timepoint": "2.1.240",
                    "pitch": 62,
                    "velocity": 100,
                    "duration": 200
                },
                {
                    "target": 1,
                    "timepoint": "2.3.360",
                    "pitch": 54,
                    "velocity": 30,
                    "duration": 20
                }
            ])
        });
    });

    describe('#getNoteEventQueue', function() {
        it('produces expected result in a basic scenario with C major scale and simple rhythm', function() {
            const GAMUT = [60, 62, 64, 65, 67, 69, 71];
            const COLOR = [0, 2, 5];
            const TALEA = ["1/4", "1/8", "1/8", "1/8"];

            let noteEvents = getNoteEventQueue(10, { bar: 3, beat: 2, tick: 0 }, GAMUT, TALEA, COLOR, 2, 1, 4, 480);

            assert.deepEqual(noteEvents, [
                {
                    time: {
                        bar: 3,
                        beat: 2,
                        tick: 240
                    },
                    note: {
                        pitch: 64,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 3,
                        beat: 3,
                        tick: 0
                    },
                    note: {
                        pitch: 69,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 3,
                        beat: 4,
                        tick: 0
                    },
                    note: {
                        pitch: 60,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 3,
                        beat: 4,
                        tick: 240
                    },
                    note: {
                        pitch: 64,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 1,
                        tick: 0
                    },
                    note: {
                        pitch: 69,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 1,
                        tick: 240
                    },
                    note: {
                        pitch: 60,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 2,
                        tick: 240
                    },
                    note: {
                        pitch: 64,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 3,
                        tick: 0
                    },
                    note: {
                        pitch: 69,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 3,
                        tick: 240
                    },
                    note: {
                        pitch: 60,
                        velocity: 127,
                        duration: 200
                    }
                },
                {
                    time: {
                        bar: 4,
                        beat: 4,
                        tick: 0
                    },
                    note: {
                        pitch: 64,
                        velocity: 127,
                        duration: 200
                    }
                }
            ]);

        
        });
    });

    describe('#getNextVelocity', function() {
        it('is defaulted to 127', function() {
            assert.equal(getNextVelocity(), 127);
        });
    });
    
    describe('#getNextDuration', function() {
        it('is defaulted to 200', function() {
            assert.equal(getNextDuration(), 200);
        });
    });

    describe('#calcDuration()', function() {
        it('for 1/8 notes', function() {
            var eigthTicks = calcDuration("1/8");
            
            assert.equal(eigthTicks, 240);
        });
    });
    
    describe('#timeToTicks()', function() {
        it('test a simple scenario', function() {
            let time = {
                bar: 2,
                beat: 3,
                tick: 240
            };

            assert.equal(timeToTicks(time, 4, 480), 3120);
        });
    });
});