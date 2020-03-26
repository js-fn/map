import test from "testami";
import { __package_name__ } from "./__package_name__.mjs";

test("__package_name__ is defined", (t) => {
  t.is(typeof __package_name__, "function");
});
