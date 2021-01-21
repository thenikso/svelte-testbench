import { defer } from './utils';
import { getTest, getSection } from './context';

export const nodes = (wrapper) => Array.from(wrapper.childNodes);

export const select = (selector) => (wrapper) =>
  Array.from(wrapper.querySelectorAll(selector));

const waitingOk = new Map();

export const waitOk = (prepare) => {
  const test = getTest(true);
  const deferred = defer();
  waitingOk.set(test, deferred.resolve);
  return async (wrapper) => {
    await deferred.promise;
    return prepare(wrapper);
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
