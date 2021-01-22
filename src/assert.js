import eq from './lib/equal';
import pixelmatch from 'pixelmatch';
import { AssertionError } from './errors';
import { toCanvas } from './prepare';

export const equal = (a, b) => {
  if (!eq(a, b)) {
    // TODO better reppresent errors
    throw new AssertionError('a !== b');
  }
};

const defaultToCanvas = toCanvas();

export const imageMatch = (options = { threshold: 0 }) => async (a, b) => {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      throw new AssertionError(
        `Not the same number of images: ${a.length} != ${b.length}`,
      );
    }
    const match = imageMatch(options);
    return Promise.all(a.map((a, i) => match(a, b[i]).catch((e) => e))).then(
      (all) => {
        const errors = all.filter((r) => r instanceof Error);
        const diffs = all.map((c) => (c instanceof Error ? c.diff : c));
        if (errors.length > 0) {
          return Promise.reject(
            new AssertionError(
              `Some image (${errors.length}) do not match`,
              diffs,
            ),
          );
        }
        return diffs;
      },
    );
  }

  a = await defaultToCanvas(a);
  b = await defaultToCanvas(b);

  if (a.width !== b.width || a.height !== b.height) {
    throw new AssertionError('Image size do not match');
  }

  const width = a.width;
  const height = a.height;

  const aData = a.getContext('2d').getImageData(0, 0, width, height);
  const bData = b.getContext('2d').getImageData(0, 0, width, height);

  const diff = document.createElement('canvas');
  diff.width = width;
  diff.height = height;
  const diffCtx = diff.getContext('2d');
  const diffData = diffCtx.createImageData(width, height);

  const diffSize = pixelmatch(
    aData.data,
    bData.data,
    diffData.data,
    width,
    height,
    options,
  );

  diffCtx.putImageData(diffData, 0, 0);

  const okDiffSize =
    options && options.threshold ? width * height * options.threshold : 0;

  if (diffSize > okDiffSize) {
    throw new AssertionError(`Image missmatch of ${diffSize} pixels`, diff);
  }

  return diff;
};
