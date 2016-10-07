//@flow
'use strict';

import {test} from 'tape';
import {Action} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test('fizz: Failed to fetch', function(t) {

  let reverse = Action.create('fail.Reverse', function(str: string) {
    return fetch(
        '//not.on.this.planet:8000/worldPeace/' + encodeURI(str)
    );
  });

  reverse('bar').then(function() {
    t.fail('Action do not failed!');
    t.end();
  }).catch(function(reason) {
    console.log('catch');
    t.true(/.*TypeError.*/.test(reason.toString()), reason.toString());
    t.end();
  });

});
