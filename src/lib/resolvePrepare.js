import { elements, select } from '../prepare';

export default function resolvePrepare(prepare) {
  if (typeof prepare === 'function') {
    return prepare;
  }
  if (typeof prepare === 'string') {
    return select(prepare);
  }
  if (Array.isArray(prepare)) {
    const fs = prepare.map(resolvePrepare);
    return async (input) => {
      let output = input;
      for (let i = 0, l = fs.length; i < l; i++) {
        const f = fs[i];
        output = await f(output);
      }
      return output;
    };
  }
  return elements;
}
