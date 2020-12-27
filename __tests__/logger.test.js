const loggerMiddleware = require('../src/middleware/logger.js');

describe('Test logger middleware', () => {

  let consoleSpy;
  let req = {};
  let res = {};
  let next = jest.fn(); // Allow jest to spy on next()

  beforeEach(() => { // Attach jest's spy to the console
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => { // Stops spying on the console (I think...)
    consoleSpy.mockRestore();
  });

  it('should log something', () => {
    loggerMiddleware(req, res, next);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('passes to the next middleware', () => {
    loggerMiddleware(req, res, next);
    // Make sure that next() wasn't called with parameters
    // Or it will pass a 500 status and end the 'next()' chain.
    expect(next).toHaveBeenCalledWith();
  });

});
