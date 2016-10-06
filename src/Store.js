// @flow

import {StateObjectSnapshot as State} from './StateObjectSnapshot';

type Callback = (x:Object) => void;
type Method = (x:Object) => void;
type Data = {[key: string]: any};

let stores: Array<Store> = [];
let busy = false;
let create = false;

let defaultMethod = function(obj: Object) {
  Object.assign(this, obj);
};

class Store{
  _state: State;
  _id: string;
  _methods: Map<string, Method> = new Map();
  _onChangeCallbacks: Array<Callback> = [];
  _dependsOn: Set<Store> = new Set();

  constructor(id: string, object: Data) {
    if (!create) {
      throw new Error('Issue #1 is not completed!');
    }

    // check id
    if (stores.some((store) => store.id() === id)) {
      throw new Error(`A Store with id ${id} allready exists!`);
    }

    this._id = id;
    this._state = new State(object);
    stores.push(this);
  }

  id() {
    return this._id;
  }

  state() {
    return this._state.data();
  }

  register(action: Function, method: Method = defaultMethod) {
    let actionName = action._ACTION_ID_;
    if (actionName == null) {
      throw new Error('Action name is undefined!');
    }

    this._methods.set(actionName, method);

    return this;
  }

  dispatch(actionName: string, payload: any) {
    if (this._methods.has(actionName)) {
      if (busy === true) {
        throw new Error('Nested dispatch call detected.');
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
      let state = this._state.data();

      this._onChangeCallbacks.forEach(function(callback) {
        callback(state);
      }, this);

      this._state.commit();
    }

  }

  onChange(callback: Callback, scope: Object = window) {
    this._onChangeCallbacks.push(callback.bind(scope));
    return this;
  }

  dependsOn(store: Store) {
    this._dependsOn.add(store);

    stores = stores.filter((store) => store !== this);
    stores.push(this);

    this._checkCircularDependency();
  }

  _checkCircularDependency(dependedStores: Set<Store> = new Set()) {
    if (dependedStores.has(this)) {
      throw new Error('Circular dependency detected!');
    }

    dependedStores.add(this);

    this._dependsOn.forEach(
        (store) => store._checkCircularDependency(dependedStores));
  }

  static create(id: string, data: Data): Store {
    create = true;
    let store = new Store(id, data);
    create = false;
    return store;
  }
}

export {Store, stores};
