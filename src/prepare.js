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

// Promise resolves

export const waitPromises = async (input) => {
  if (Array.isArray(input)) {
    return await Promise.all(input);
  }
  return await input;
};

// Waiting

const waitingOk = new Map();

export const waitOk = () => {
  const test = getTest(true);
  const ok = defer();
  waitingOk.set(test, ok.resolve);
  return async (input) => {
    await ok.promise;
    return waitPromises(input);
  };
};

// TODO okTrigger?
export const giveOk = () => {
  const section = getSection(true);
  const ok = waitingOk.get(section.test);
  if (!ok) {
    throw new Error(
      `giveOk requires a waitOk prepare for the "${section.section}" test section`,
    );
  }
  waitingOk.delete(section.test);
  return ok;
};

export const waitImagesLoaded = (selector = 'img') => async (input) => {
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
export const snapshot = (options) => async (input) => {
  if (Array.isArray(input)) {
    return Promise.all(input.map(snapshot(options)));
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

// Capture

const capturedSnapshots = new Map();

export const snapshotOnTrigger = (count = 0, snapshotOptions) => {
  const test = getTest(true);
  const takeSnapshot = snapshot(snapshotOptions);
  const ok = defer();
  let okAfter = count || 0;
  const captures = [];
  let target;
  const capture = async () => {
    let res = takeSnapshot(target).catch(() => null);
    if (!Array.isArray(res)) {
      res = [res];
    }
    if (okAfter > 0) {
      res = await Promise.all(res);
    }
    captures.push(...res);
    if (--okAfter === 0) {
      ok.resolve();
    }
  };
  capturedSnapshots.set(test, capture);
  if (okAfter <= 0) {
    ok.resolve();
  }
  return async (input) => {
    target = input;
    await ok.promise;
    return captures;
  };
};

export const snapshotTrigger = () => {
  const section = getSection(true);
  const capture = capturedSnapshots.get(section.test);
  if (!capture) {
    throw new Error(
      `snapshotTrigger requires a snapshotOnTrigger prepare for the "${section.section}" test section`,
    );
  }
  capturedSnapshots.delete(section.test);
  return capture;
};
