//@flow
'use strict';

import {test} from 'tape';
import {Store} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: circular dependency', function(t) {

  let storeA = new Store({foo:1});
  let storeB = new Store({foo:1});
  let storeC = new Store({foo:1});

  storeA.dependsOn(storeB);
  storeB.dependsOn(storeC);

  t.throws(function() {
    storeC.dependsOn(storeA);
  }, /.*Circular.dependency.detected.*/);

  t.end();
});
