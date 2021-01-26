import { defer } from './lib/utils';
import { getTest, getSection } from './lib/context';
import html2canvas from 'html2canvas';
import resolvePrepare from './lib/resolvePrepare';

export const nodes = (wrapper) => Array.from(wrapper.childNodes);
export const elements = (wrapper) => Array.from(wrapper.children);

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

export const snapshot = (options) => {
  const shouldResize = options && options.resize && resize(options.resize);
  return async (input) => {
    if (Array.isArray(input)) {
      return Promise.all(input.map(snapshot(options)));
    }
    let canvas;
    if (input instanceof HTMLCanvasElement || input instanceof Image) {
      canvas = document.createElement('canvas');
      canvas.width = input.width;
      canvas.height = input.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(input, 0, 0);
    } else if (input instanceof Node) {
      canvas = await html2canvas(input, options);
    }
    if (canvas) {
      if (shouldResize) {
        canvas = shouldResize(canvas);
      }
      return canvas;
    }
    throw new Error('Can not convert to canvas');
  };
};

export const resize = (options) => (canvas) => {
  if (!options || !(options.width || options.height)) {
    throw new Error('To resize you need to specify width and/or height');
  }
  if (Array.isArray(canvas)) {
    return canvas.map(resize(options));
  }
  if (!(canvas instanceof HTMLCanvasElement)) {
    return canvas;
  }
  let { width: resizeWidth, height: resizeHeight, aspectRatio } = options;
  if (!resizeWidth || !resizeHeight) {
    aspectRatio = aspectRatio || canvas.width / canvas.height;
    if (resizeWidth) {
      resizeHeight = resizeWidth / aspectRatio;
    } else {
      resizeWidth = resizeHeight * aspectRatio;
    }
  }
  resizeWidth = Math.round(resizeWidth);
  resizeHeight = Math.round(resizeHeight);

  if (resizeWidth === canvas.width && resizeHeight === canvas.height) {
    return canvas;
  }

  const resCanvas = document.createElement('canvas');
  resCanvas.width = Math.max(resizeWidth, canvas.width);
  resCanvas.height = Math.max(resizeHeight, canvas.height);
  const resCtx = resCanvas.getContext('2d');
  resCtx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    resizeWidth,
    resizeHeight,
  );
  const res = document.createElement('canvas');
  res.width = resizeWidth;
  res.height = resizeHeight;
  res.getContext('2d').drawImage(resCanvas, 0, 0);
  return res;
};

export const dataURL = (fallback = null) => (input) => {
  if (Array.isArray(input)) {
    return input.map(dataURL(fallback));
  }
  if (input instanceof HTMLCanvasElement) {
    return input.toDataURL();
  }
  return fallback;
};

export const html = (fallback = null) => (input) => {
  if (Array.isArray(input)) {
    return input.map(html(fallback));
  }
  if (input instanceof Node) {
    return input.outerHTML;
  }
  return fallback;
};

// Capture

const capturedSnapshots = new Map();

export const snapshotOnTrigger = (count, snapshotOptions) => {
  if (typeof count === 'object') {
    snapshotOptions = count;
    count = count.count;
  }
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

export const text = (input) => {
  if (Array.isArray(input)) {
    return input.map(text);
  }
  if (input instanceof Element) {
    return input.innerText;
  }
  return String(input);
};

// Actions

export const action = (label, innerPrepare) => {
  const test = getTest(true);
  let target;
  const fn = resolvePrepare(innerPrepare);
  const callback = () => {
    fn(target);
  };
  return (input) => {
    target = input;
    test.addAction(label, callback);
    return input;
  };
};

export const copy = (template = (x) => String(x)) => (input) =>
  navigator.clipboard.writeText(template(input));

// Debug

export const log = (how = 'log') => (input) => {
  console[how](input);
  return input;
};
