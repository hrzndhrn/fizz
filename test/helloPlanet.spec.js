//@flow
"use strict";

import {test} from "tape";
import {setPlanet} from "./actions/helloPlanet";
import {helloPlanet as store} from "./stores/helloPlanet";
import {view} from "./views/helloPlanet";

test("fizz: hello panet", function(t) {

  t.deepEqual( store.state(), {planet:"earth"},
      "storeHelloPlanet.state() === {'planet':'earth'}");

  t.equal( view.render(), "Hello, earth!", "Hello, earth!");

  let time1 = view.updated;

  setPlanet("mars");

  t.deepEqual( store.state(), {planet:"mars"},
      "storeHelloPlanet.state() === {'planet':'mars'}");

  t.equal( view.render(), "Hello, mars!", "Hello, mars!");

  let time2 = view.updated;

  t.true(time2 > time1, `time between updates ${time2 - time1} ms`);

  setPlanet("mars");

  t.deepEqual( store.state(), {planet:"mars"},
      "storeHelloPlanet.state() === {'planet':'mars'}");

  t.equal( view.render(), "Hello, mars!", "Hello, mars!");

  let time3 = view.updated;

  t.true(time3 === time2, "no updated in view");

  // --------------------------------------------------------------------------
  t.end();

});
