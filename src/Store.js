// @flow

import {StateObjectSnapshot as State} from "./StateObjectSnapshot";

type Callback = (x:Object) => void;
type Method = (x:Object) => void;
type Data = {[key: string]: any};

let stores: Array<Store> = [];
let busy = false;

let defaultMethod = function(obj: Object) {
  Object.assign(this, obj);
}

class Store {
  _state: State;
  _methods: Map<string, Method> = new Map();
  _onChangeCallbacks: Array<Callback> = [];

  constructor(object: Data) {
    this._state = new State(object);
    stores.push(this);
  }

  state() {
    return this._state.data();
  }

  register(actionName: ?string, method: Method = defaultMethod) {
    if (actionName == null) {
      throw new Error("Action name is undefined!");
    }

    this._methods.set(actionName, method);

    return this;
  }

  dispatch(actionName: string, payload: any) {
    if (this._methods.has(actionName)) {
      if (busy === true) {
        throw new Error("Nested dispatch call detected.");
      }

      busy = true;

      let method = this._methods.get(actionName);
      // $FlowFixMe
      this._dispatch(method, payload);

      busy = false;
    }
  }

  _dispatch(method: Method, payload: Object) {
    // apply the store function
    method.apply(this._state.object(), [payload]);
    if (this._state.hasChanges()) {
      this._onChangeCallbacks.forEach(function(callback) {
        callback(this._state.data());
      }, this);
    }

    this._state.commit();
  }

  onChange(callback: Callback, scope: Object = window) {
    this._onChangeCallbacks.push(callback.bind(scope));
    return this;
  }
}

export {Store, stores};
