import { equal as eq } from './utils';
import { AssertionError } from './errors';

export const equal = (a, b) => {
  if (!eq(a, b)) {
    // TODO better reppresent errors
    throw new AssertionError('a !== b');
  }
};
