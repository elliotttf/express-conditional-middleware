'use strict';

const conditional = require('../lib/conditional.js');

module.exports = {
  bool(test) {
    test.expect(3);

    let middleware = conditional(true, () => {
      test.ok(true, 'true conditional worked.');
    });

    middleware({}, {}, () => {
      test.done();
    });

    middleware = conditional(false, () => {
      test.done();
    });

    middleware({}, {}, () => {
      test.ok(true, 'false conditional worked.');
    });

    middleware = conditional(false, () => {
      test.done();
    }, () => {
      test.ok(true, 'fail conditional worked.');
      test.done();
    });

    middleware({}, {}, () => {
      test.done();
    });
  },

  boolAdditional(test) {
    test.expect(2);
    const middleware = conditional(true, (req, res, next, extra) => {
      test.ok(true, 'true conditional worked.');
      test.equal(extra, 'extra received');
      next();
    });
    middleware({}, {}, () => {
      test.done();
    }, 'extra received');
  },

  func(test) {
    test.expect(3);

    const conditionFunc = req => req.working === true;

    let middleware = conditional(conditionFunc, () => test.ok(true,
      'Conditional function returned true.'));

    middleware({ working: true }, {}, () => test.done());

    middleware = conditional(conditionFunc, () => test.done());

    middleware({ working: false }, {}, () => {
      test.ok(true, 'Conditional function returned false.');
    });

    middleware = conditional(conditionFunc, () => test.done(), () => {
      test.ok(true, 'Conditional function returned false, executed otherwise.');
      test.done();
    });

    middleware({ working: false }, {}, () => {
      test.done();
    });
  },

  funcAdditional(test) {
    const conditionFunc = (req, res, next, extra) => extra === true;

    const middleware = conditional(conditionFunc, (req, res, next) => {
      test.ok(true, 'Conditional function returned true.');
      next();
    });

    middleware({ working: true }, {}, () => test.done(), true);
  },

  funcOnce(test) {
    test.expect(2);

    let count = 0;

    const conditionFunc = (req, res, next) => {
      next();
      return true;
    };

    const middleware = conditional(conditionFunc, (req, res, next) => {
      test.ok(true, 'Conditional executed.');
      next();
      test.done();
    });

    middleware({}, {}, () => {
      count += 1;
      test.equal(count, 1, 'Middleware only executed once.');
    });
  },
};
