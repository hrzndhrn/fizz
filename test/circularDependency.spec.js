//@flow
'use strict';

import {test} from 'tape';
import {Store} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: circular dependency', function(t) {

  let storeA = Store.create('StoreA', {foo:1});
  let storeB = Store.create('StoreB', {foo:1});
  let storeC = Store.create('StoreC', {foo:1});

  storeA.dependsOn(storeB);
  storeB.dependsOn(storeC);

  t.throws(function() {
    storeC.dependsOn(storeA);
  }, /.*Circular.dependency.detected.*/);

  t.end();
});
