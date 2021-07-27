const wda = require('./index');
const internals = require('./_internals');
const data = require('./mocks/fooWithBarCollection.json')

describe('Retry Persist', () => {
  test('It uses the correct input parameter', async () => {
    data.interval = 100;
    data.__requestCkg = async (...args) => new Promise((resolve) => resolve(args))
    const persistSpy = jest.spyOn(internals, 'persist');

    await wda.persist(data);

    expect(persistSpy).toHaveBeenCalledWith(data);
  })
})
