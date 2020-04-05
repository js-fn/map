import test from "testami";
import { map } from "./map.mjs";

test("map is defined", (t) => {
  t.is(typeof map, "function");
});

test("map returns an iterable that emit function application results", (t) => {
  const res = map([1, 2], String);
  t.deepEqual([...res], ["1", "2"]);
  t.is(typeof res[Symbol.iterator], "function");
});

test("map throw if argument is not an iterable", (t) => {
  t.throws(() => map(42, () => 0).next(), "Iterable argument expected.");
});

test("map returns a partially applied function when given no iterable", (t) => {
  const zero = map(() => 0);
  const zeros = zero([1, 2, 3]);
  t.deepEqual([...zeros], [0, 0, 0]);
});

const inc = (n) => n + 1;

test("map accepts generator functions", (t) => {
  t.deepEqual([...map(odd(), inc)], [2, 4, 6, 8]);
});

test("map default function is identity", (t) => {
  t.deepEqual([...map(odd(), {})], [1, 3, 5, 7]);
});

test("map can transform a sync iterator of promises into async iterator", async (t) => {
  const asyncIterator = map(oddPromises(), { forceAsync: true });
  t.false(isIterable(asyncIterator));
  t.true(isAsyncIterable(asyncIterator));
  t.deepEqual(await awaitIntoArray(asyncIterator), [1, 3, 5, 7]);
});

test("map await fn results if promises", async (t) => {
  const asyncIterator = map(oddPromises(), {
    forceAsync: true,
    fn: (a) => Promise.resolve(a * 2),
  });
  t.false(isIterable(asyncIterator));
  t.true(isAsyncIterable(asyncIterator));
  t.deepEqual(await awaitIntoArray(asyncIterator), [2, 6, 10, 14]);
});

test("map accepts options object", (t) => {
  t.deepEqual([...map(odd(), { fn: inc })], [2, 4, 6, 8]);
});

test("map accepts async generator functions", async (t) => {
  const res = map(asyncOdd(), inc);
  t.deepEqual(await awaitIntoArray(res), [2, 4, 6, 8]);
});

function* odd() {
  yield 1;
  yield 3;
  yield 5;
  yield 7;
}

function* oddPromises() {
  yield Promise.resolve(1);
  yield Promise.resolve(3);
  yield Promise.resolve(5);
  yield Promise.resolve(7);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function awaitIntoArray(asyncIterable) {
  const arr = [];
  for await (const it of asyncIterable) {
    arr.push(it);
  }
  return arr;
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

async function* asyncOdd() {
  yield 1;
  await wait(10);
  yield 3;
  await wait(60);
  yield 5;
  await wait(50);
  yield Promise.resolve(7);
  await wait(20);
}
