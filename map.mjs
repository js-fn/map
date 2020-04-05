function* _map(iterable, fn) {
  let i = 0;
  for (const item of iterable) {
    yield fn(item, i);
    i++;
  }
}

async function* _mapAsync(iterable, fn) {
  let i = 0;
  for await (const item of iterable) {
    yield fn(item, i);
    i++;
  }
}

export function map(iterable, fn = iterable) {
  // this is a clever trick, but it leave some space to
  // inconsistencies like map(fn,fn) or map(2,2) that create a partial
  // application. Previopusly it was:
  // if (typeof fn === "undefined" && typeof iterable == "function") {
  //   fn = iterable;

  if (fn === iterable) {
    // partial application of map
    return (iterable) => map(iterable, fn);
  }

  if (isAsyncIterable(iterable)) {
    return _mapAsync(iterable, fn);
  }

  if (isIterable(iterable)) {
    return _map(iterable, fn);
  }

  throw new Error("Iterable argument expected.");
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
