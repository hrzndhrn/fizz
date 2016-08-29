// @flow

import {dispatch} from './dispatcher';
import {uid} from 'jsz-uid';

let busy = false;
let create = false;
export let actionIds: Map<Function,string> = new Map();

function defaultMethod( obj: Object): Object {
  return obj;
}

export class Action {
  _id: string;
  _method: Function; // @todo Flow?!
  _handler: Function;

  constructor(id: string, method: Function) {
    if (!create) {
      throw new Error('Use Action.create to create an action.');
    }

    this._id = id;
    this._method = method;

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
      let id = this._id;
      promise.then(function(payload) {
        dispatch(id, payload);
      });
    } else {
      payload = result;
      dispatch(this._id, payload);
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
