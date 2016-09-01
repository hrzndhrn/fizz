//@flow
'use strict';

import {test} from 'tape';
import {Action,Store} from '../src/fizz';

/* eslint-disable no-magic-numbers */

test.skip('fizz: fetch', function(t) {
  // Will be skipped for the moment. The test used the web api from fizz-
  // example reverse and will fail if reverse is not running.
  let reverse = Action.create(function(str: string) {
    return fetch(
      '//localhost:8000/reverse/' + encodeURI(str)
    );
  });

  let store = Store.create({
    data: 'foo'
  }).register(reverse, function(response) {
    this.data = response.data;
  });

  store.onChange(function(state) {
    t.equal(state.data, 'rab', 'state.data === "rab"');
  });

  reverse('bar').then(function() {
    t.end();
  }).catch(function() {
    t.fail('Action failed!');
    t.end();
  });

});
