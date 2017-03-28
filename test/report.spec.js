import {expect} from 'chai';

describe('webapp', function () {
  it('should not throw', function () {
    expect(() => require('../src/webapp/report')).to.not.throw();
  });
});
