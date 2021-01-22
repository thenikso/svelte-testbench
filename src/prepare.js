import { defer } from './lib/utils';
import { getTest, getSection } from './lib/context';

export const nodes = (wrapper) => Array.from(wrapper.childNodes);

export const select = (selector) => (input) =>
  Array.from(input.querySelectorAll(selector));

const waitingOk = new Map();

export const waitOk = (then) => {
  const test = getTest(true);
  const deferred = defer();
  waitingOk.set(test, deferred.resolve);
  return async (input) => {
    await deferred.promise;
    return typeof then === 'function' ? then(input) : input;
  };
};

export const giveOk = () => {
  const section = getSection(true);
  const ok = waitingOk.get(section.test);
  if (!ok) {
    throw new Error(
      `giveOk must have a waitOk prepare for the "${section.section}" test section`,
    );
  }
  waitingOk.delete(section.test);
  return ok;
};
