var conditional = require('../lib/conditional.js');

module.exports = {
  bool: function (test) {
    test.expect(3);

    var middleware = conditional(true, function () {
      test.ok(true, 'true conditional worked.');
    });

    middleware({}, {}, function () {
      test.done();
    });

    middleware = conditional(false, function () {
      test.done();
    });

    middleware({}, {}, function () {
      test.ok(true, 'false conditional worked.');
    });

    middleware = conditional(false, function () {
      test.done();
    }, function () {
      test.ok(true, 'fail conditional worked.');
      test.done();
    });

    middleware({}, {}, function () {
      test.done();
    });
  },

  func: function (test) {
    test.expect(3);

    var conditionFunc = function (req) {
      return req.working === true;
    };

    var middleware = conditional(
      conditionFunc,
      function () {
        test.ok(true, 'Conditional function returned true.');
      }
    );

    middleware({working: true}, {}, function () {
      test.done();
    });

    middleware = conditional(
      conditionFunc,
      function () {
        test.done();
      }
    );

    middleware({working: false}, {}, function () {
      test.ok(true, 'Conditional function returned false.');
    });

    middleware = conditional(
      conditionFunc,
      function () {
        test.done();
      },
      function () {
        test.ok(true, 'Conditional function returned false, executed otherwise.');
        test.done();
      }
    );

    middleware({working: false}, {}, function () {
      test.done();
    });
  },

  funcOnce: function (test) {
    test.expect(2);

    var count = 0;

    var conditionFunc = function (req, res, next) {
      next();
      return true;
    };

    var middleware = conditional(
      conditionFunc,
      function (req, res, next) {
        test.ok(true, 'Conditional executed.');
        next();
        test.done();
      }
    );

    middleware({}, {}, function () {
      count++;
      test.equal(count, 1, 'Middleware only executed once.');
    });
  }
};

