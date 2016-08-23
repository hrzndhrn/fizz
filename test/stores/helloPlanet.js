// @flow

import {Store} from "../../src/fizz";
import {action} from "../../src/fizz";

let helloPlanet: Store = new Store({
  "planet": "earth"
}).register(action.AA_SET_PLANET, function(state) {
  console.log("Store helloPlanet: SET_VALUE");
  this.planet = state.planet;
}).register(action.AB_SET_PLANET);

export {helloPlanet}
