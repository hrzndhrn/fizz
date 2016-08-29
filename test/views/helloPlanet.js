// @flow

import {helloPlanet as store} from '../stores/helloPlanet';

let view = {
  state: store.state(),

  updated: Date.now(),

  render() {
    return `Hello, ${this.state.planet}!`;
  }
};

store.onChange( (state) => {
  console.log('>>>>>>>>> onChange');
  view.state = state;
  view.updated = Date.now();
});



export {view};
