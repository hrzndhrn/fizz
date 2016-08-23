// @flow

import {Action} from "../../src/fizz";

let aaSetPlanet = Action.create("AA_SET_PLANET", function(planet: string) {
  return {planet}
});

let abSetPlanet = Action.create("AB_SET_PLANET");

export {aaSetPlanet, abSetPlanet};

