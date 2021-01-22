import { equal as eq } from './lib/utils';
import pm from 'pixelmatch';
import { AssertionError } from './errors';

export const equal = (a, b) => {
  if (!eq(a, b)) {
    // TODO better reppresent errors
    throw new AssertionError('a !== b');
  }
};

export const imageMatch = (options) => async (a, b) => {
  // TODO a/b are canvas or img
  // TODO opts is threshold
};
