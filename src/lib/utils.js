export function defer() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject,
  };
}

export function setTimeout(t) {
  return new Promise((resolve) => window.setTimeout(resolve, t));
}
