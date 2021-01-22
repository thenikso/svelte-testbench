import { defer } from './lib/utils';
import { getTest, getSection } from './lib/context';
import html2canvas from 'html2canvas';

export const nodes = (wrapper) => Array.from(wrapper.childNodes);

export const select = (selector) => (input) => {
  const res = (Array.isArray(input) ? input : [input]).reduce((acc, i) => {
    acc.push(...Array.from(i.querySelectorAll(selector)));
    return acc;
  }, []);
  if (res && res.length === 1) return res[0];
  return res;
};

// Waiting

const waitingOk = new Map();

export const waitOk = () => {
  const test = getTest(true);
  const deferred = defer();
  waitingOk.set(test, deferred.resolve);
  return async (input) => {
    await deferred.promise;
    return input;
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

export const waitImgs = (selector = 'img') => async (input) => {
  const imgs = select(selector);
  await Promise.all(
    imgs.map((img) => {
      if (!img || !img.src) {
        return Promise.resolve();
      }
      const imgReady = defer();
      img = new Image();
      img.onload = imgReady.resolve;
      img.src = img.src;
      return imgReady.promise;
    }),
  );
  return input;
};

// Conversions

// TODO resize
export const toCanvas = (options) => async (input) => {
  if (Array.isArray(input)) {
    return Promise.all(input.map(toCanvas(options)));
  }
  if (input instanceof HTMLCanvasElement) {
    return input;
  }
  if (input instanceof Image) {
    const canvas = document.createElement('canvas');
    canvas.width = input.width;
    canvas.height = input.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(input, 0, 0);
    return canvas;
  }
  if (input instanceof Node) {
    return html2canvas(input, options);
  }
  throw new Error('Can not convert to canvas');
};

// Debug

export const log = (how = 'log') => (input) => {
  console[how](input);
  return input;
};
