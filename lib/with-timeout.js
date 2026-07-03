/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within
 * the given milliseconds, the returned promise rejects with a timeout error.
 *
 * @param {Promise} promise - The promise to wrap.
 * @param {number} ms - Timeout in milliseconds.
 * @param {string} [label] - Optional label for the error message.
 * @returns {Promise} Resolves with the original value or rejects on timeout.
 */
export function withTimeout(promise, ms, label = 'Operation') {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}
