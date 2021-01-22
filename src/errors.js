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

export class AssertionMultiError extends Error {
  constructor(errors) {
    super(`Multiple assertions failed: ${errors.length}`);
    this.errors = errors;
  }
}
