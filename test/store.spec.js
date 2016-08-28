// @flow

"use strict";

import {test} from "tape";
import {Store} from "../src/fizz";

test("fizz: Store", function(t) {


  t.ok(typeof Store === "function",
      "Class Store is imported.");

  /* eslint-disable no-magic-numbers */

  let store = new Store({data:1});

  t.deepEqual( store.state(), {data:1}, "store.state() === {'data':1}");

  // --------------------------------------------------------------------------
  t.end();

});
