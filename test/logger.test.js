describe('Testing utils/logger', function () {
  it('test buildLogger()', function (done) {
    const logger = require('../src/utils/logger');
    logger.info('test openrateboost-server.buildLogger');
    done();
  });
});
