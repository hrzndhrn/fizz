0.2.0 / 2016-10-07
------------------
- All stores need an id.
- All actions need an id.
- New signature for store dispatcher methods: 
  ```state:Object, payload:Object => newState:Object```


0.1.6 / 2016-09-01
------------------
- Processing of fetch promises.
- Using isPromise from jsz-isTyp insteed of instanceof.

0.1.5 / 2016-08-30
------------------
- Added Store.create.

0.1.4 / 2016-08-29
------------------
- Use of internal ids.
- Exception for new Action. Use Action.create to create an action.
- Added Store.dependsOn.

0.1.2 / 2016-08-28
------------------
- Action can return promise.

0.1.1 / 2016-08-23
------------------
- Add flow anotations.

0.1.0 / 2016-08-23
------------------
- First beta version.
