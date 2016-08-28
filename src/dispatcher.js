// @flow

import {stores} from "./Store";
import type {Payload} from "./types";

function dispatch(action: string, payload: Payload) {
  stores.forEach((store) => store.dispatch(action, payload));
}

export {dispatch};
