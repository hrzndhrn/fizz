// @flow

import {Action} from "../../src/fizz";

let setPlanet = Action.create("SET_PLANET", function(planet: string) {
  console.log("--- Action ---");
  return {planet}
});

export {setPlanet};

