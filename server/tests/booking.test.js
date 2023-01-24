const { isValidObjectID } = require('../services/bookingValidation');

//test to see if regex is succesfull
test('6109dc9adcf23a013990701d, is a valid MongoDB ObjectID', () => {
    expect(isValidObjectID("6109dc9adcf23a013990701d")).toEqual(true);
});
test('teapot, is not a valid MongoDB ObjectID', () => {
    expect(isValidObjectID("teapot")).toEqual(false);
});
