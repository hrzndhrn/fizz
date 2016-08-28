// @flow

import {dispatch} from "./dispatcher";

let action: {[key: string]: string} = {};

function defaultMethod( obj: Object): Object {
  return obj;
}

class Action {
  _name: string;
  _method: Function; // @todo Flow?!

  constructor(name: string, method: Function) {
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
    let payload = this._method.apply( window, arguments);
    dispatch(this._name, payload);
    return payload;
  }

  // $FlowFixMe
  static create<U:Function>(name: string, method: U = defaultMethod): U {
    // $FlowFixMe
    let handler:U = new Action(name, method).handler();
    return handler;
  }
}

export {Action, action};
