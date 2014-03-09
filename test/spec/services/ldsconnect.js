'use strict';

describe('Service: Ldsconnect', function () {

  // load the service's module
  beforeEach(module('sortinghatApp'));

  // instantiate service
  var Ldsconnect;
  beforeEach(inject(function (_Ldsconnect_) {
    Ldsconnect = _Ldsconnect_;
  }));

  it('should do something', function () {
    expect(!!Ldsconnect).toBe(true);
  });

});
