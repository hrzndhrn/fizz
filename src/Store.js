// @flow

import {State} from "./State";

let stores: Array<Store> = [];
let busy = false;

class Store {
  _state: State;
  _methods: Map<string, any> = new Map();
  _onChangeCallbacks: Array = [];

  constructor(object:any) {
    this._state = new State(object);
    stores.push(this);
  }

  state() {
    return this._state.data();
  }

  register(actionName: ?string, method) {
    if (actionName == null) {
      throw new Error("Action name is undefined!");
    }

    this._methods.set(actionName, method);

    return this;
  }

  dispatch(actionName, payload) {
    if (this._methods.has(actionName)) {
      if (busy === true) {
        throw new Error("Nested dispatch call detected.");
      }

      busy = true;

      this._dispatch(actionName, payload);

      busy = false;
    }
  }

  _dispatch(actionName, payload) {
    // apply the store function
    this._methods.get(actionName).apply(this._state.object, [payload]);
    if (this._state.hasChanges()) {
      this._onChangeCallbacks.forEach(function(callback) {
        callback(this._state.data());
      }, this);
    }

    this._state.commit();
  }

  onChange(callback, scope = window) {
    this._onChangeCallbacks.push(callback.bind(scope));
    return this;
  }
}

export {Store, stores};
