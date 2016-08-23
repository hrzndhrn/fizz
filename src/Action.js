// @flow

import {dispatch} from "./dispatcher";

let action: {[key: string]: string} = {};

let defaultMethod = (obj: Object): Object => obj;

class Action {
  _name: string;
  _method: any; // @todo Flow?!

  constructor(name: string, method: any = defaultMethod) {
    this._name = name;
    this._method = method;

    console.log("--------");
    console.log(method);

    if (action[name] === undefined) {
      action[name] = name;
    } else {
      throw new Error(`An action with name ${name} allready exists!`);
    }

  }

  handler() {
    return this.execute.bind(this);
  }

  execute(...args: Array<any>) {
    let payload = this._method.apply( window, args);
    dispatch(this._name, payload);
  }

  static create(name: string, method: any) {
    return new Action(name, method).handler();
  }
}

export {Action, action};
