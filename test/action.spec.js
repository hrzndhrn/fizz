//@flow
"use strict";

import {test} from "tape";
import {Action, action} from "../src/fizz";

test("fizz: Action", function(t) {

  t.ok(typeof Action === "function",
      "Class Action is imported.");

  let setValue = Action.create("SET_VALUE", function(value: number) {
    return {value}
  });

  setValue("mars");

  // --------------------------------------------------------------------------
  t.end();

});
