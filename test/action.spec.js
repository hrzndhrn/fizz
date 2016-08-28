//@flow
'use strict';

import {test} from 'tape';
import {Action} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: Action', function(t) {

  t.ok(typeof Action === 'function',
      'Class Action is imported.');

  let setValue = Action.create('SET_VALUE', function(value: number) {
    return {value};
  });

  // type BadValue = (x:number) => void;
  let badValue = Action.create('BAD_VALUE', function(value: number) {
    return setValue(value);
  });

  setValue(1);

  t.throws( function() {
    badValue(1);
  }, /.*An.action.can.not.call.an.action.*/);

  t.throws(function() {
    new Action('FOO', function() {});
  }, /.*Use.Action.create.to.create.an.action.*/);

  // --------------------------------------------------------------------------
  t.end();

});
