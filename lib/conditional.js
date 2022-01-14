'use strict';

const once = require('once');

/**
 * Returns a middleware that can be used to conditionally execute another
 * middleware, or alternatively bypass it.
 *
 * @param {(boolean|function)} condition
 *   If true, the middleware will be executed, else the next middleware will be
 *   executed. If the condition is a function it will be executed with the req,
 *   res, and next arguments. The return of the function will be used as the
 *   conditional.
 * @param {function} success
 *   The middleware to conditionally execute if condition is true.
 * @param {function} fail
 *   The middleware to conditionally execute if condition is false.
 *
 * @return {function}
 *   A middleware wrapper to conditionally execute another middleware.
 *
 * @example
 *   // Will enable middleware for requests that use the application/json accept
 *   // header.
 *   app.use(require('express-conditional')(
 *     function (req, res, next) {
 *       return req.get('accept') === 'application/json';
 *     },
 *     function (req, res, next) {
 *       next();
 *     }
 *  ));
 */
module.exports = (condition, success, fail) => (req, res, next, ...rest) => {
  const nextOnce = once(next);
  if (condition === true || (typeof condition === 'function' && condition(req, res, nextOnce, ...rest))) {
    return success(req, res, nextOnce, ...rest);
  }
  if (fail) {
    return fail(req, res, nextOnce, ...rest);
  }

  return nextOnce();
};
