'use strict';

describe('Service: StProgress', function () {

  // load the service's module
  beforeEach(module('sortinghatApp'));

  // instantiate service
  var StProgress;
  beforeEach(inject(function (_StProgress_) {
    StProgress = _StProgress_;
  }));

  it('should do something', function () {
    expect(!!StProgress).toBe(true);
  });

});
