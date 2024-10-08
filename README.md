# Time Periods

[Docs](https://wangyouhao8922.github.io/time-periods/index.html) |
[npm](https://www.npmjs.com/package/time-periods)

A utility library for working with periods of time in JavaScript. It allows you to create time periods, divide them into smaller periods, subtract time periods, and perform other common operations on time periods.

## Installation

The library is available as an [npm package](https://www.npmjs.com/package/time-periods).
To install the package use:
```bash
npm install time-periods --save 
```

## Usage

Creating Time Periods

```js
const { TimePeriod, TimePeriodList } = require('time-periods');

// Create a time period from two dates
const start = new Date('2024-01-01T10:00:00');
const end = new Date('2024-01-01T12:00:00');
const timePeriod = new TimePeriod(start, end);
```

Subtracting Time Periods

```js
// Subtract a time period
const timePeriodToSubtract = new TimePeriod(new Date('2024-01-01T10:30:00'), new Date('2024-01-01T11:00:00'));
const remainingPeriods = timePeriod.subtract(timePeriodToSubtract);
console.log(remainingPeriods); 
// => 
// [
//     TimePeriod {
//         startDateTime: 2024-01-01T10:00:00.000Z,
//         endDateTime: 2024-01-01T10:30:00.000Z,
//     },
//     TimePeriod {
//         startDateTime: 2024-01-01T11:00:00.000Z,
//         endDateTime: 2024-01-01T12:00:00.000Z,
//     }
// ]
```

Working with TimePeriodList

```js
const timePeriodList = new TimePeriodList([
  new TimePeriod(new Date('2024-01-01T08:00:00'), new Date('2024-01-01T09:00:00')),
  new TimePeriod(new Date('2024-01-01T10:00:00'), new Date('2024-01-01T12:00:00'))
]);

const periodsToSubtract = [
  new TimePeriod(new Date('2024-01-01T08:30:00'), new Date('2024-01-01T10:30:00'))
];

const subtractedTimePeriodList = timePeriodList.mergeMultiple().subtractMultiple(periodsToSubtract);
console.log(subtractedTimePeriodList);
// => 
// TimePeriodList {
//     timePeriodList: [
//         TimePeriod {
//             startDateTime: 2024-01-01T08:00:00.000Z,
//             endDateTime: 2024-01-01T08:30:00.000Z,
//         },
//         TimePeriod {
//             startDateTime: 2024-01-01T10:30:00.000Z,
//             endDateTime: 2024-01-01T12:00:00.000Z,
//         }
//     ]
// }
```

Splitting a Time Period

```js
const splitPeriods = timePeriod.divideByLength(15);
console.log(splitPeriods); // Splits the time period into 8 equal parts, with duration = 15mins.
```

Iterating over TimePeriodList

```js
splitPeriods.forEach((period, index) => {
  console.log(`Period ${index}: ${period.startDateTime} to ${period.endDateTime}`);
});
```

## TimePeriod API Reference

### Constructor

```js
new TimePeriod(startDateTime, endDateTime)
```

Creates a new TimePeriod object.

startDateTime (Date): The start of the time period.
endDateTime (Date): The end of the time period.
Throws an TypeError if the startDateTime or endDateTime is not a valid Date object.
Throws an RangeError if startDateTime is greater than endDateTime.

### Instance properties

#### TimePeriod.prototype.divideByLength(divisorInMins):
Divides a timePeriod into periods with same duration provided.

#### TimePeriod.prototype.merge(timePeriod):
Merges two timePeriod into one period if no overlap bewteen two timePeriod, this timePeriod will be return.

#### TimePeriod.prototype.subtract(timePeriod, minimumDurationInMins):
Subtracts the overlapped time period bewteen this timePeriod and provided timePeriod from this timePeriod.

#### TimePeriod.prototype.trimEnd(durationInMins):
Trims the end of this timePeriod by the provided duration.

#### TimePeriod.prototype.contains(timePeriod):
Returns true if the provided timePeriod is fully contained within this timePeriod.

### Static methods

#### TimePeriod.isNotLessThanDuration(startDateTime, endDateTime, duration):
Compares the duration of a pair of start time and end time.

### TimePeriodList API Reference

### Constructor

```js
new TimePeriodList(timePeriodList);
```

Creates a new TimePeriodList object with an array of TimePeriod objects.

### Instance properties

#### TimePeriodList.prototype.divideAllByLength(divisorInMins):
Divides all the time period in this timePeriodList into periods with same duration provided.

#### TimePeriodList.prototype.forEach(callback):
Iterates over each time period in the list and applies the provided callback function. The callback is invoked with three arguments: the current time period, the index, and the entire timePeriodList.

#### TimePeriodList.prototype.get(index):
Gets the first (index + 1) timePeriod in timePeriodList.

#### TimePeriodList.prototype.getAll():
Gets an array contains all the timePeriod in this timePeriodList.

#### TimePeriodList.prototype.mergeMultiple(timePeriodList):
Merges all timePeriod, until no overlap bewteen every timePeriod.

#### TimePeriodList.prototype.subtractMultiple(timePeriodToSubtractList, minimumDurationInMins):
Subtracts the overlapped time period between provided timePeriodList and this timePeriodList from this timePeriodList.

#### TimePeriodList.prototype.contains(timePeriod):
Returns true if the provided timePeriod is fully contained within any timePeriod of this timePeriodList.

#### TimePeriodList.prototype.trimAllEnd(durationInMins):
Trims the end of all timePeriod in this timePeriodList by the provided duration.

# License
[MIT © Stanley Wang (You Hao Wang)](https://github.com/wangyouhao8922/time-periods/blob/main/LICENSE.md)
