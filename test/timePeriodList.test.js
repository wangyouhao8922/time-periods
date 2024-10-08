const { TimePeriodList, TimePeriod } = require('../src/index')

test('Create TimePeriodList, forEach, for loop', () => {
    // Create TimePeriodList
    const timePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T12:00:00')), 
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);

    for (const timePeriod of timePeriodList) {
        // ...
    }

    timePeriodList.forEach((timePeriod, index) => {
        if (index === 1) {
            expect(timePeriod.startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
            expect(timePeriod.endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');
        }
    });
});
test('timePeriodList.subtractMultiple', () => {
    const timePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T12:00:00')), 
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);

    // SubtractMultiple. 
    const subtractedTimePeriodList = timePeriodList.subtractMultiple([
        new TimePeriod(new Date('2024-09-08T09:30:00'), new Date('2024-09-08T10:30:00')), 
        new TimePeriod(new Date('2024-09-08T11:00:00'), new Date('2024-09-08T22:30:00')),
        new TimePeriod(new Date('2024-09-08T08:15:00'), new Date('2024-09-08T08:45:00'))
    ]);
    expect(subtractedTimePeriodList.getAll()[0].startDateTime.toISOString()).toBe('2024-09-08T09:00:00.000Z');
    expect(subtractedTimePeriodList.getAll()[0].endDateTime.toISOString()).toBe('2024-09-08T09:30:00.000Z');
    expect(subtractedTimePeriodList.getAll()[1].startDateTime.toISOString()).toBe('2024-09-08T10:30:00.000Z');
    expect(subtractedTimePeriodList.getAll()[1].endDateTime.toISOString()).toBe('2024-09-08T11:00:00.000Z');
    expect(subtractedTimePeriodList.getAll()[2].startDateTime.toISOString()).toBe('2024-09-08T22:30:00.000Z');
    expect(subtractedTimePeriodList.getAll()[2].endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // SubtractMultiple, with minimumDurationInMins = 40.
    const subtracted40TimePeriodList = timePeriodList.subtractMultiple([
        new TimePeriod(new Date('2024-09-08T09:10:00'), new Date('2024-09-08T09:20:00')), 
        new TimePeriod(new Date('2024-09-08T11:00:00'), new Date('2024-09-08T22:30:00')),
        new TimePeriod(new Date('2024-09-08T08:15:00'), new Date('2024-09-08T08:45:00'))
    ], 40);

    expect(subtracted40TimePeriodList.getAll()[0].startDateTime.toISOString()).toBe('2024-09-08T09:20:00.000Z');
    expect(subtracted40TimePeriodList.getAll()[0].endDateTime.toISOString()).toBe('2024-09-08T11:00:00.000Z');
});
test('timePeriodList.divideAllByLength', () => {
    const timePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T12:00:00')), 
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);

    // TimePeriodList.divideAllByLength
    const dividedTimePeriodList = timePeriodList.divideAllByLength(15);
    expect(dividedTimePeriodList.getAll()[0].startDateTime.toISOString()).toBe('2024-09-08T09:00:00.000Z');
    expect(dividedTimePeriodList.getAll()[0].endDateTime.toISOString()).toBe('2024-09-08T09:15:00.000Z');
});
test('timePeriodList.mergeMultiple', () => {
    const toMergeTimePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T10:30:00')), 
        new TimePeriod(new Date('2024-09-08T13:00:00'), new Date('2024-09-08T15:00:00')),
        new TimePeriod(new Date('2024-09-08T11:30:00'), new Date('2024-09-08T13:30:00')),
        new TimePeriod(new Date('2024-09-08T10:00:00'), new Date('2024-09-08T12:00:00'))
    ]);
    
    // mergeMultiple.
    const mergedTimePeriodList = toMergeTimePeriodList.mergeMultiple();
    expect(mergedTimePeriodList.get(0).startDateTime.toISOString()).toBe('2024-09-08T09:00:00.000Z');
    expect(mergedTimePeriodList.get(0).endDateTime.toISOString()).toBe('2024-09-08T15:00:00.000Z');

    // mergeMultiple, with provided time period.
    const mergedInputTimePeriodList = toMergeTimePeriodList.mergeMultiple([
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);
    expect(mergedInputTimePeriodList.get(1).startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(mergedInputTimePeriodList.get(1).endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');

    // mergeMultiple with a TimePeriodList object.
    const mergedWithObjectTimePeriodList = toMergeTimePeriodList.mergeMultiple(new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]));
    expect(mergedWithObjectTimePeriodList.get(1).startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(mergedWithObjectTimePeriodList.get(1).endDateTime.toISOString()).toBe('2024-09-08T23:00:00.000Z');
});
test('timePeriodList.contains', () => {
    // Contains with this timePeriodList contains provided timePeriod.
    const timePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T12:00:00')), 
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);
    const contains = timePeriodList.contains(new TimePeriod(new Date('2024-09-08T22:10:00'), new Date('2024-09-08T22:50:00')));
    expect(contains).toBe(true);

    // Contains with this timePeriodList do not contains provided timePeriod.
    const doesntContains = timePeriodList.contains(new TimePeriod(new Date('2024-09-08T21:10:00'), new Date('2024-09-08T22:50:00')));
    expect(doesntContains).toBe(false);

    // Contains with none TimePeriod object.
    function expectTypeError() {
        const invalidTimePeriod = "new TimePeriod(new Date('2024-09-08T21:00:00'), new Date('2024-09-08T22:00:00'))";
        timePeriodList.contains(invalidTimePeriod);
    }
    expect(expectTypeError).toThrowError('The parameter timePeriod must be a TimePeriod object.');
});
test('timePeriodList.trimAllEnd', () => {
    // trimAllEnd with 10.
    const timePeriodList = new TimePeriodList([
        new TimePeriod(new Date('2024-09-08T09:00:00'), new Date('2024-09-08T12:00:00')), 
        new TimePeriod(new Date('2024-09-08T22:00:00'), new Date('2024-09-08T23:00:00'))
    ]);
    const trimmedTimePeriodList = timePeriodList.trimAllEnd(10);
    expect(trimmedTimePeriodList.get(0).startDateTime.toISOString()).toBe('2024-09-08T09:00:00.000Z');
    expect(trimmedTimePeriodList.get(0).endDateTime.toISOString()).toBe('2024-09-08T11:50:00.000Z');
    expect(trimmedTimePeriodList.get(1).startDateTime.toISOString()).toBe('2024-09-08T22:00:00.000Z');
    expect(trimmedTimePeriodList.get(1).endDateTime.toISOString()).toBe('2024-09-08T22:50:00.000Z');
});