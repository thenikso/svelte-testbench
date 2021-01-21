export class TimeoutError extends Error {
  constructor(timeout) {
    super(`Timed out (${timeout / 1000}s)`);
  }
}

export class AssertionError extends Error {
  constructor(assertion, diff) {
    super(`Assertion failed: ${assertion}`);
    this.diff = diff;
  }
}
