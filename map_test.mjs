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

test("map accepts generator functions", (t) => {
  t.deepEqual([...map(odd(), (n) => n + 1)], [2, 4, 6, 8]);
});

test("map accepts async generator functions", async (t) => {
  const res = map(asyncOdd(), (n) => n + 1);
  const arr = [];
  for await (const it of res) {
    arr.push(it);
  }
  t.deepEqual(arr, [2, 4, 6, 8]);
});

function* odd() {
  yield 1;
  yield 3;
  yield 5;
  yield 7;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* asyncOdd() {
  yield 1;
  await wait(10);
  yield 3;
  await wait(30);
  yield 5;
  await wait(50);
  yield Promise.resolve(7);
  await wait(70);
}
