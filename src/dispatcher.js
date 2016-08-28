// @flow

import {stores} from "./Store";

type Payload = {[key: string]: any};

function dispatch(action: string, payload: Payload) {
  stores.forEach((store) => store.dispatch(action, payload));
}

export {dispatch};
