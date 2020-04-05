export function map(iterable, options = iterable) {
  // this is a clever trick, but it leave some space to
  // inconsistencies like map(fn,fn) or map(2,2) that create a partial
  // application. Previopusly it was:
  // if (typeof fn === "undefined" && typeof iterable == "function") {
  //   fn = iterable;

  if (options === iterable) {
    // partial application of map
    return (iterable) => map(iterable, options);
  }

  const opts = _mkOptions(options);

  if (isAsyncIterable(iterable) || opts.forceAsync) {
    return _mapAsync(iterable, opts);
  }

  if (isIterable(iterable)) {
    return _map(iterable, opts);
  }

  throw new Error("Iterable argument expected.");
}

const _defaultOptions = {
  fn: (a) => a,
  forceAsync: false,
};

function _mkOptions(options) {
  if (typeof options === "function") {
    options = { fn: options };
  }

  return Object.assign({}, _defaultOptions, options);
}

function* _map(iterable, { fn }) {
  let i = 0;
  for (const item of iterable) {
    yield fn(item, i);
    i++;
  }
}

async function* _mapAsync(iterable, { fn }) {
  let i = 0;
  for await (const item of iterable) {
    yield fn(item, i);
    i++;
  }
}

function isIterable(iter) {
  return (
    typeof iter === "object" &&
    iter !== null &&
    typeof iter[Symbol.iterator] === "function"
  );
}

function isAsyncIterable(iter) {
  return (
    typeof iter === "object" &&
    iter !== null &&
    typeof iter[Symbol.asyncIterator] === "function"
  );
}
