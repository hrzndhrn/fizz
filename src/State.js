// @flow

import {ObjectSnapshot} from "ObjectSnapshot";

class State {
  _state: ObjectSnapshot;

  constructor(object: any) {
    this._state = new ObjectSnapshot(object);
  }

  data(keyPath: string) {
    return this._state.immutable(keyPath);
  }

  get object() {
    return this._state.observable();
  }

  hasChanges() {
    return this._state.hasChanges();
  }

  commit() {
    this._state.snapshot();
  }
}

export {State};
