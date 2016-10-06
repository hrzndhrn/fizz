//@flow
'use strict';

import {test} from 'tape';
import {Action,Store} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: dependsOn', function(t) {

  let initialFoo = 1;
  let dependsOn = false;
  let counter = {
    storeSecond: {
      onChange: 1
    },
    storeFirst: {
      onChange: 1
    }
  }

  let setFoo = Action.create(function(value: number) {
    return {foo: value};
  });

  let storeFirst = Store.create('StoreFirst', {
    bar: initialFoo + 1
  });

  let storeSecond = Store.create('StoreSecond', {
    foo: initialFoo
  });

  t.deepEqual(storeFirst.state(), {bar:2}, 'storeFirst inital state');
  t.deepEqual(storeSecond.state(), {foo:1}, 'storeFirst inital state');

  storeSecond.register(setFoo, function(payload) {
    this.foo = payload.foo;
  });

  storeFirst.register(setFoo, function() {
    this.bar = storeSecond.state().foo +  1;
  });

  storeSecond.onChange(function(state) {
    t.comment(`- storeSecond.onChange #${counter.storeSecond.onChange++}`);
    if (dependsOn) {
      t.equal(state.foo, 21, 'state.foo === 21');
      t.deepEqual(storeFirst.state(), {bar:2}, 'state.bar === 2');
    } else {
      t.equal(state.foo, 42, 'state.foo === 42');
      t.deepEqual(storeFirst.state(), {bar:2}, 'state.bar === 2');
    }
  });

  storeFirst.onChange(function(state) {
    t.comment(`- storeFirst.onChange #${counter.storeFirst.onChange++}`);
    if (dependsOn) {
      t.equal(storeSecond.state().foo, 21, 'state.foo === 21');
      t.deepEqual(state.bar, 22, 'state.bar === 22');
    } else {
      t.fail('unreachable code');
    }
  });


  setFoo(42);
  t.deepEqual(storeFirst.state(), {bar:2}, 'dependsOn = false');

  t.comment('- store.First.dependsOn(storeSecond)');
  storeFirst.dependsOn(storeSecond);
  dependsOn = true;

  t.deepEqual(storeFirst.state(), {bar:2}, 'storeFirst: {bar:2}');
  t.deepEqual(storeSecond.state(), {foo:42}, 'storeSecond: {foo:42}');

  setFoo(21);
  t.deepEqual(storeFirst.state(), {bar:22}, 'dependsOn = true');

  t.end();
});
