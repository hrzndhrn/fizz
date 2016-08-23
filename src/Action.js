// @flow

import {dispatch} from "./dispatcher";

let action: {[key: string]: string} = {};

class Action {
  _name: string;
  _method; // @todo Flow?!

  constructor(name: string, method) {
    this._name = name;
    this._method = method;

    if (action[name] === undefined) {
      action[name] = name;
    } else {
      throw new Error(`An action with name ${name} allready exists!`);
    }

  }

  handler() {
    return this.execute.bind(this);
  }

  execute(...args) {
    let payload = this._method.apply( window, args);
    dispatch(this._name, payload);
  }

  static create(name: string, method) {
    return new Action(name, method).handler();
  }
}

export {Action, action};
