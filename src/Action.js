// @flow

import {dispatch} from './dispatcher';
import {uid} from 'jsz-id';
import {EMPTY_STRING} from 'jsz-string';
import type {Payload} from './types';

const HTTP = {
  OK: 200,
  NOT_FOUND: 400
};

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

  /**
   * Execute an action, this will call {@link _method} with the argumetns for
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

    if (result instanceof Promise) {
      // The result is some promise.
      result
        .then(this._status)
        .then(this._dispatch.bind(this))
        .catch(this._error.bind(this));
    } else {
      // The result is the payload for this action.
      dispatch(this._id, result);
    }

    busy = false;

    return result;
  }

  _dispatch(payload: Payload) {
    dispatch(this._id, payload);
  }

  _status(value: Payload|Response): Promise<Payload> {
    let promise: Promise<any> = Promise.reject('An unexpected error occured');

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
