// @flow

import {dispatch} from './dispatcher';
import {isPromise} from 'jsz-isType';
import {EMPTY_STRING} from 'jsz-string';
import type {Payload} from './types';

const HTTP = {
  OK: 200,
  NOT_FOUND: 400
};

let busy = false;
let create = false;
export let actions: Map<string, Action> = new Map();

function defaultMethod( obj: Object = {}): Object {
  // return Promise.resolve(obj);
  return obj;
}

export class Action {
  _id: string;
  _method: Function; // TODO: Flow?!
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

  /**
   * Execute an action, this will call {@link _method} with the arguments for
   * {@link execute}.
   */
  execute() {
    // Check if an action calls an action.
    if (busy) {
      busy = false;
      throw new Error('An action can not call an action!');
    } else {
      busy = true;
    }

    // The result is some value or a promise.
    let result = this._method.apply( window, arguments);

    if (isPromise(result)) {
      // The result is some promise.
      result
        .then(this._status)
        .then(this._dispatch.bind(this))
        .catch(this._error.bind(this));
    } else {
      // The result is the payload for this action.
      dispatch(this._id, result);
      result = Promise.resolve(result);
    }

    busy = false;

    return result;
  }

  _dispatch(payload: Payload) {
    dispatch(this._id, payload);
  }

  _status(value: Payload|Response): Promise<Payload> {
    let promise: Promise<any>;

    if (value instanceof Response) {
      if (value.status === HTTP.OK) {
        promise = value.json();
      } else {
        promise = Promise.reject(value);
      }
    } else {
      promise = Promise.resolve(value);
    }

    return promise;
  }

  _error(reason: any) {
    // TODO: Error handling

    let msg = EMPTY_STRING;

    if (reason instanceof Response) {
      if (reason.ok) {
        msg = `${reason.status} - ${reason.statusText} - ${reason.url}`;
      } else {
        msg = 'Response is not ok!';
      }
    } else {
      msg = 'Error in action! ' + reason;
    }

    throw new Error(msg);
  }

  // ??? FlowFixMe
  // static create<U:Function>(id: string, method: U = defaultMethod): U {
  static create(id: string, method: any = defaultMethod): any {
    // check id
    if (actions.has(id)) {
      throw new Error(`Action with id ${id} allready exists!`);
    }

    create = true;
    let action = new Action(id, method);
    create = false;

    let handler = action.handler();
    handler._ACTION_ID_ = id;

    actions.set(id, action);

    return handler;
  }
}
