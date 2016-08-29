// @flow

import {Store} from '../../src/fizz';
import {aaSetPlanet, abSetPlanet} from '../actions/helloPlanet';

let helloPlanet: Store = new Store({
  'planet': 'earth'
}).register(aaSetPlanet, function(state) {
  console.log('Store helloPlanet: SET_VALUE');
  this.planet = state.planet;
}).register(abSetPlanet);

export {helloPlanet}
