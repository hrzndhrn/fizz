//@flow
"use strict";

import {test} from "tape";
import {Action, action} from "../src/fizz";

/* eslint-disable no-magic-numbers */

test("fizz: Action.handler", function(t) {

  t.ok(typeof Action === "function",
      "Class Action is imported.");

  const name = "AHT_TEST_VALUE";

  let setValue = new Action(name, function(value: number) {
    return {value}
  });

  t.equal(setValue._name, name);
  t.equal(action.AHT_TEST_VALUE, name);

  let setValueHandler = setValue.handler();

  setValueHandler(1);

  // --------------------------------------------------------------------------
  t.end();

});
