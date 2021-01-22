import { getContext, setContext } from 'svelte';

const SUITE = Symbol('suite');
const DESCRIBE = Symbol('describe');
const TEST = Symbol('test');
const SECTION = Symbol('section');

export function setSuite(value) {
  setContext(SUITE, value);
}

export function getSuite() {
  return getContext(SUITE);
}

export function setDescribe(value) {
  setContext(DESCRIBE, value);
}

export function getDescribe() {
  return getContext(DESCRIBE);
}

export function setTest(value) {
  setContext(TEST, value);
  const describe = getDescribe();
  if (describe) {
    describe.addTest(value);
  }
}

export function getTest(required) {
  const value = getContext(TEST);
  if (required && !value) {
    throw new Error('Must be in a Test');
  }
  return value;
}

export function setSection(value) {
  setContext(SECTION, value);
}

export function getSection(required) {
  const value = getContext(SECTION);
  if (required && !value) {
    throw new Error('Must be in a Test section');
  }
  return value;
}

export function getConfig() {
  // TODO
}
