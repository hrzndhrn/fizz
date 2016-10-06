// @flow

import {Store} from '../../src/fizz';
import {aaSetPlanet, abSetPlanet} from '../actions/helloPlanet';

let helloPlanet: Store = Store.create('HelloPlanet', {
  'planet': 'earth'
}).register(aaSetPlanet, function(state) {
  this.planet = state.planet;
}).register(abSetPlanet);

export {helloPlanet}
