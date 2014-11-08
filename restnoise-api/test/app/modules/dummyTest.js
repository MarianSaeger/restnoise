/* jshint ignore:start */
require('../../init');

describe('dummy', function() {

    var dummy;

    beforeEach(function() {
        dummy = require('../../../app/modules/renderinterface');
    });

    describe('isThisTemplateAwesome', function() {

        it('should return true', function(done) {
            var result = dummy.isThisTemplateAwesome();
            expect(result).to.be.true;
            done();
        });

    });

});
