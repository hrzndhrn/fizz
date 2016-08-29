// @flow

import {dispatch} from './dispatcher';

let action: {[key: string]: string} = {};
let busy = false;
let create = false;
let actions: Set<Function> = new Set();

function defaultMethod( obj: Object): Object {
  return obj;
}

class Action {
  _name: string;
  _method: Function; // @todo Flow?!

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

  }

  handler(): Function {
    return this.execute.bind(this);
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
  static create<U:Function>(name: string, method: U = defaultMethod): U {
    create = true;
    // $FlowFixMe
    let handler:U = new Action(name, method).handler();
    create = false;
    actions.add(handler);
    console.log('>>>>>>>>>> ' + actions.size);
    return handler;
  }
}

export {Action, action};
