/**
 * Will only log if not in test environment
 * @param  {...any} args arguments to pass to console.log
 */
function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
}

module.exports = { log }
