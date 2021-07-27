const {
	aggregateInstances,
	persist,
	persistAllInstances,
	persistKindInstances,
	sanityCheck
} = require('./_internals')

// Retry failed attempts to persist:
async function retry(fn, retriesLeft = 3, interval = 10000, exponential = false) {
  try {
    const val = await fn();
    return val;
  } catch (error) {
    if (retriesLeft) {
      await new Promise(r => setTimeout(r, interval));
      return retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
    } else throw new Error(`Max retries reached with error: ${error.message}`);
  }
}

module.exports = {
	persist,
	persistAndRetry: async (input) => await retry(
		async () => await persist(input),
		input.retries,
		input.interval,
		input.exponentialRetries
	),
}
