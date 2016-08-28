//@flow
'use strict';

import {test} from 'tape';
import {action,Action,Store} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: promise', function(t) {

  let setValue = Action.create('PROMISE_SET_VALUE', function(value: number) {
    return new Promise(function(resolve) {
      window.setTimeout( function() {
        resolve({value});
      }, 1000);
    });

  });

  let store = new Store({
    data:1
  }).register( action.PROMISE_SET_VALUE, function(response) {
    this.data = response.value;
  });

  store.onChange(function(state) {
    t.equal(state.data, 42, 'state.data === 42');
  });

  setValue(42).then(function() {
    t.end();
  });

});
