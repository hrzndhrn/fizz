import {Store} from "../../src/fizz";
import {action} from "../../src/fizz";

let helloPlanet = new Store({
  "planet": "earth"
}).register( action.SET_PLANET, function(state) {
  console.log("Store helloPlanet: SET_VALUE");
  this.planet = state.planet;
});

export {helloPlanet}
