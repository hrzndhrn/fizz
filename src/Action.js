// @flow

import {dispatch} from './dispatcher';
import {uid} from 'jsz-uid';

let action: {[key: string]: string} = {};
let busy = false;
let create = false;
let actionIds: Map<Function,string> = new Map();

function defaultMethod( obj: Object): Object {
  return obj;
}

class Action {
  _name: string;
  _method: Function; // @todo Flow?!
  _handler: Function;

  constructor(name: string, method: Function) {
    if (!create) {
      throw new Error('Use Action.create to create an action.');
    }

    this._name = name;
    this._method = method;

    if (action[name] === undefined) {
      action[name] = name;
    } else {
      throw new Error(`An action with name ${name} allready exists!`);
    }

    this._handler = this.execute.bind(this);
  }

  handler(): Function {
    return this._handler;
  }

  execute() {
    if (busy) {
      busy = false;
      throw new Error('An action can not call an action!');
    } else {
      busy = true;
    }

    let payload, promise;
    let result = this._method.apply( window, arguments);

    if (result instanceof Promise) {
      promise = result;
      let name = this._name;
      promise.then(function(payload) {
        dispatch(name, payload);
      });
    } else {
      payload = result;
      dispatch(this._name, payload);
    }

    busy = false;

    return result;
  }

  // $FlowFixMe
  static create<U:Function>(method: U = defaultMethod): U {
    let id = uid();

    create = true;
    // $FlowFixMe
    let handler:U = new Action(id, method).handler();
    create = false;

    actionIds.set(handler, id);

    return handler;
  }
}

export {Action, action, actionIds};
