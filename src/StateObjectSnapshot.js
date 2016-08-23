// @flow

import {ObjectSnapshot} from "ObjectSnapshot";
import {State} from "./State";
import {EMPTY_STRING} from "jsz-string";

class StateObjectSnapshot extends State{
  _state: ObjectSnapshot;

  constructor(object: any) {
    super();
    this._state = new ObjectSnapshot(object);
  }

  data(keyPath: string = EMPTY_STRING) {
    return this._state.immutable(keyPath);
  }

  object(): any {
    return this._state.observable();
  }

  hasChanges() {
    return this._state.hasChanges();
  }

  commit() {
    this._state.commit();
  }
}

export {StateObjectSnapshot};
