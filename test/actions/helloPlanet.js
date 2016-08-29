// @flow

import {Action} from '../../src/fizz';

let aaSetPlanet = Action.create(function(planet: string) {
  return {planet}
});

let abSetPlanet = Action.create();

export {aaSetPlanet, abSetPlanet};

