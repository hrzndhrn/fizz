//@flow
"use strict";

import {test} from "tape";
import {Action} from "../src/fizz";

/* eslint-disable no-magic-numbers */

test("fizz: Action", function(t) {

  t.ok(typeof Action === "function",
      "Class Action is imported.");

  let setValue = Action.create("SET_VALUE", function(value: number) {
    return {value};
  });

  // type BadValue = (x:number) => void;
  let badValue = Action.create("BAD_VALUE", function(step: number) {
    return {step};
  });

  setValue(1);
  badValue(1);

  // --------------------------------------------------------------------------
  t.end();

});
