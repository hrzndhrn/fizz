//@flow
"use strict";

import {test} from "tape";
import {Action} from "../src/fizz";
import type {Payload} from "../src/fizz";

/* eslint-disable no-magic-numbers */

test("fizz: Action", function(t) {

  t.ok(typeof Action === "function",
      "Class Action is imported.");

  type F = (value:number) => Payload;

  let setValue: F = Action.create("SET_VALUE", function(value: number) {
    return {value}
  });

  let incValue = Action.create("INC_VALUE", function(step: number) {
    return {step};
  });

  setValue(1);

  // --------------------------------------------------------------------------
  t.end();

});
