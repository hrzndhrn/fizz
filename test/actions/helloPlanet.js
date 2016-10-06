// @flow

import {Action} from '../../src/fizz';

let aaSetPlanet = Action.create('SetPlanet', function(planet: string) {
  return {planet}
});

let abSetPlanet = Action.create('SetPlanetA');

export {aaSetPlanet, abSetPlanet};

