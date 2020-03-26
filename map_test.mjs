import test from "testami";
import { map } from "./map.mjs";

test("map is defined", (t) => {
  t.is(typeof map, "function");
});
