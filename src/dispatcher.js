// @ flow

import {stores} from "./Store";

function dispatch(action, payload) {
  stores.forEach((store) => store.dispatch(action, payload));
}

export {dispatch};
