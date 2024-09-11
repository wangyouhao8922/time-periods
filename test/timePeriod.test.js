const { TimePeriod } = require('../src/index');

test('Create TimePeriod', () => {
    // Create TimePeriod with none Date object.
    function expectTypeError() {
        const timePeriod = new TimePeriod('2024-09-08T22:00:00', '2024-09-08T23:00:00');
    }
    expect(expectTypeError).toThrowError('The parameter startDateTime and endDateTime must be a valid Date objects.');

    // Create TimePeriod with startDateTime > endDateTime.
    function expectRangeError() {
        const timePeriod = new TimePeriod(new Date('2024-09-08T23:00:00'), new Date('2024-09-08T22:00:00'));
    }
    expect(expectRangeError).toThrowError('startDateTime must be less than or equal to endDateTime.');

    // Create with invalid Date Object.
    function expectInvalidDateError() {
        const timePeriod = new TimePeriod(new Date('2024-09-8T23:00:00'), new Date('2024-09-08T22:00:00'));
    }
    expect(expectInvalidDateError).toThrowError('The parameter startDateTime and endDateTime must be a valid Date objects.');
});
test('timePeriod.merge', () => {
    // Merge with this timePeriod start = provided end.
    const mergedTimePeriod = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00')));
    expect(mergedTimePeriod.isMerged).toBe(null);
    expect(mergedTimePeriod.startDateTime.toISOString()).toBe('2024-09-08T21:00:00.000Z');
    expect(mergedTimePeriod.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with this timePeriod fall behind the provided one. 
    const mergeFallBehind = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T20:00:00'), new Date('2024-09-08T21:00:00')));
    expect(mergeFallBehind.isMerged).toBe(false);
    expect(mergeFallBehind.startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(mergeFallBehind.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with this timePeriod fall ahead the provided one.
    const mergeFallAhead = new TimePeriod(new Date('2024-09-08T20:00:00'), new Date('2024-09-08T21:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00')));
    expect(mergeFallAhead.isMerged).toBe(false);
    expect(mergeFallAhead.startDateTime.toISOString()).toBe('2024-09-08T20:00:00.000Z');
    expect(mergeFallAhead.endDateTime.toISOString()).toBe('2024-09-08T21:00:00.000Z');

    // Merge with this timePeriod covering the provided one.
    const mergeCover = new TimePeriod(new Date('2024-09-08T20:00:00'), new Date('2024-09-08T23:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00')));
    expect(mergeCover.isMerged).toBe(null);
    expect(mergeCover.startDateTime.toISOString()).toBe('2024-09-08T20:00:00.000Z');
    expect(mergeCover.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with this timePeriod covered by the provided one.
    const mergeCovered = new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T20:00:00'), new Date('2024-09-08T23:00:00')));
    expect(mergeCovered.isMerged).toBe(null);
    expect(mergeCovered.startDateTime.toISOString()).toBe('2024-09-08T20:00:00.000Z');
    expect(mergeCovered.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with this timePeriod overlaps at the beginning.
    const mergeOverlapBeginning = new TimePeriod(new Date('2024-09-08T21:30:00'), new Date('2024-09-08T23:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00')));
    expect(mergeOverlapBeginning.isMerged).toBe(null);
    expect(mergeOverlapBeginning.startDateTime.toISOString()).toBe('2024-09-08T21:00:00.000Z');
    expect(mergeOverlapBeginning.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with this timePeriod overlaps at the end.
    const mergeOverlapEnd = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .merge(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:15:00')));
    expect(mergeOverlapEnd.isMerged).toBe(null);
    expect(mergeOverlapEnd.startDateTime.toISOString()).toBe('2024-09-08T21:00:00.000Z');
    expect(mergeOverlapEnd.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Merge with none TimePeriod object.
    function expectTypeError() {
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
            .merge("new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:15:00'))");
    }
    expect(expectTypeError).toThrowError('The parameter timePeriod must be a TimePeriod object.');
});
test('timePeriod.subtract', () => {
    // Subtract with this timePeriod overlaps at the beginning.
    const subtractOverlapBeginning = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:15:00')));
    expect(subtractOverlapBeginning[0].startDateTime.toISOString()).toBe('2024-09-08T22:15:00.000Z');
    expect(subtractOverlapBeginning[0].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Subtract with this timePeriod overlaps at the beginning, minimumDurationInMins = 70.
    const subtractOverlapBeginning70 = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:15:00')), 70);
    expect(subtractOverlapBeginning70[0]).toBe(undefined);
    
    // Subtract with this timePeriod overlaps at the end.
    const subtractOverlapEnd = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T22:30:00'), new Date('2024-09-08T23:30:00')));
    expect(subtractOverlapEnd[0].startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(subtractOverlapEnd[0].endDateTime.toISOString()).toBe('2024-09-08T22:30:00.000Z');

    // Subtract with this timePeriod overlaps at the end, minimumDurationInMins = 70.
    const subtractOverlapEnd70 = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T22:30:00'), new Date('2024-09-08T23:30:00')), 70);
    expect(subtractOverlapEnd70[0]).toBe(undefined);

    // Subtract with this timePeriod overlaps at the middle.
    const subtractOverlapMiddle = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T22:15:00'), new Date('2024-09-08T22:45:00')));
    expect(subtractOverlapMiddle[0].startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(subtractOverlapMiddle[0].endDateTime.toISOString()).toBe('2024-09-08T22:15:00.000Z');
    expect(subtractOverlapMiddle[1].startDateTime.toISOString()).toBe('2024-09-08T22:45:00.000Z');
    expect(subtractOverlapMiddle[1].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Subtract with this timePeriod overlaps at the middle, minimumDurationInMins = 30 mins.
    const subtractOverlapMiddle30 = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T22:15:00'), new Date('2024-09-08T22:45:00')), 30);
    expect(subtractOverlapMiddle30[0]).toBe(undefined);

    // Subtract with this timePeriod overlaps at the middle, minimumDurationInMins = 15 mins.
    const subtractOverlapMiddle15 = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T22:10:00'), new Date('2024-09-08T22:40:00')), 15);
    expect(subtractOverlapMiddle15[0].startDateTime.toISOString()).toBe('2024-09-08T22:40:00.000Z');
    expect(subtractOverlapMiddle15[0].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');
    
    // Subtract with this timePeriod fall ahead the provided one.
    const subtractFallAhead = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T08:10:00'), new Date('2024-09-08T08:40:00')));
    expect(subtractFallAhead[0].startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(subtractFallAhead[0].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // Subtract with this timePeriod fall ahead the provided one, minimumDurationInMins = 70.
    const subtractFallAhead70 = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T08:10:00'), new Date('2024-09-08T08:40:00')), 70);
    expect(subtractFallAhead70[0]).toBe(undefined);

    // Subtract with this timePeriod fall behind the provided one.
    const subtractFallBehind = new TimePeriod(new Date('2024-09-08T08:00:00'), new Date('2024-09-08T09:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T18:10:00'), new Date('2024-09-08T18:40:00')));
    expect(subtractFallBehind[0].startDateTime.toISOString()).toBe('2024-09-08T08:00:00.000Z');
    expect(subtractFallBehind[0].endDateTime.toISOString()).toBe('2024-09-08T09:00:00.000Z');

    // Subtract with this timePeriod fall behind the provided one, minimumDurationInMins = 70.
    const subtractFallBehind70 = new TimePeriod(new Date('2024-09-08T08:00:00'), new Date('2024-09-08T09:00:00'))
        .subtract(new TimePeriod(new Date('2024-09-08T18:10:00'), new Date('2024-09-08T18:40:00')), 70);
    expect(subtractFallBehind70[0]).toBe(undefined);

    // Subtract with minimumDurationInMins < 0
    function expectInvalidInputError() {
        subtractFallBehind.forEach((timePeriod) => {
            timePeriod.subtract(timePeriod, -1);
        })
    }
    expect(expectInvalidInputError).toThrowError('The parameter minimumDurationInMins is out of range.');

    // Subtract with none timePeriod instance.
    function expectInvalidObjectError() {
        subtractFallBehind.forEach((timePeriod) => {
            timePeriod.subtract('timePeriod', 0);
        })
    };
    expect(expectInvalidObjectError).toThrowError('The parameter timePeriod must be a TimePeriod object.');

    // Subtract with none timePeriod instance.
    function expectMinimumDurationInMinsTypeError() {
        subtractOverlapBeginning.forEach((timePeriod) => {
            timePeriod.subtract('timePeriod', '0');
        })
    };
    expect(expectMinimumDurationInMinsTypeError).toThrowError('The parameter minimumDurationInMins must be a number.');

    // Subtract with itself.
    const timePeriod = new TimePeriod(new Date('2024-01-01T01:00:00'), new Date('2024-01-01T02:00:00'))
    const emptyList = timePeriod.subtract(timePeriod);
    expect(emptyList.length).toBe(0);
});
test('timePeriod.divideByLength', () => {
    // Divide by length with string.
    const timePeriod = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'));
    function expectNumberError() {
        timePeriod.divideByLength('15');
    }
    expect(expectNumberError).toThrowError('The parameter divisorInMins must be a number.');

    // Divide by length with 0.
    function expectNumberGreaterError() {
        timePeriod.divideByLength(0);
    }
    expect(expectNumberGreaterError).toThrowError('The parameter divisorInMins is out of range.');
    
    // Divide by length with 15.
    const timePeriodList = timePeriod.divideByLength(15);
    expect(timePeriodList[0].startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(timePeriodList[0].endDateTime.toISOString()).toBe('2024-09-08T22:15:00.000Z');
    expect(timePeriodList[1].startDateTime.toISOString()).toBe('2024-09-08T22:15:00.000Z');
    expect(timePeriodList[1].endDateTime.toISOString()).toBe('2024-09-08T22:30:00.000Z');
    expect(timePeriodList[2].startDateTime.toISOString()).toBe('2024-09-08T22:30:00.000Z');
    expect(timePeriodList[2].endDateTime.toISOString()).toBe('2024-09-08T22:45:00.000Z');
    expect(timePeriodList[3].startDateTime.toISOString()).toBe('2024-09-08T22:45:00.000Z');
    expect(timePeriodList[3].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');
});
test('timePeriod.trimEnd', () => {
    // trimEnd with 15.
    const timePeriod = new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'));
    const trimmedTimePeriod = timePeriod.trimEnd(15);
    expect(trimmedTimePeriod.startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(trimmedTimePeriod.endDateTime.toISOString()).toBe('2024-09-08T22:45:00.000Z');
    
    // trimEnd with < 0. 
    function expectInvalidInputError() {
        const trimmedTimePeriod = timePeriod.trimEnd(-15);
    }
    expect(expectInvalidInputError).toThrowError('The parameter durationInMins is out of range.');

    // trimEnd with string. 
    function expectTypeInputError() {
        const trimmedTimePeriod = timePeriod.trimEnd('15');
    }
    expect(expectTypeInputError).toThrowError('The parameter durationInMins must be a number.');

    // trimEnd with duration > trimmedEndDateTime - startDateTime.
    const startEndEqualedTimePeriod = timePeriod.trimEnd(150);
    expect(startEndEqualedTimePeriod.startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(startEndEqualedTimePeriod.endDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
});
test('TimePeriod.isNotLessThanDuration', () => {
    // isNotLessThanDuration with duration < 0.
    function expectOutOfRangeError() {
        TimePeriod.isNotLessThanDuration(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'), -1);
    };
    expect(expectOutOfRangeError).toThrowError('The parameter duration is out of range.');

    // isNotLessThanDuration with duration = sting.
    function expectTypeError() {
        TimePeriod.isNotLessThanDuration(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'), '1');
    };
    expect(expectTypeError).toThrowError('The parameter duration must be a number.');

    // isNotLessThanDuration with duration 1.
    function expectRangeError() {
        TimePeriod.isNotLessThanDuration(new Date('2024-09-08T23:00:00'), new Date('2024-09-08T22:00:00'), 1);
    };
    expect(expectRangeError).toThrowError('startDateTime must be less than or equal to endDateTime.');
});
test('timePeriod.contains', () => {
    // Contains with this timePeriod start = provided start, this timePeriod end = provided end.
    const timePeriod = new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00'));
    const contains = timePeriod.contains(timePeriod);
    expect(contains).toBe(true);

    // Contains with this timePeriod do not contains provided timePeriod.
    const doesntContains = timePeriod.contains(new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:10:00')));
    expect(doesntContains).toBe(false);

    // Contains with none TimePeriod object.
    function expectTypeError() {
        const invalidTimePeriod = "new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00'))";
        timePeriod.contains(invalidTimePeriod);
    }
    expect(expectTypeError).toThrowError('The parameter timePeriod must be a TimePeriod object.');
});