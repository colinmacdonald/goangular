# $on

```
Stability: 2 - Unstable
```

Used to monitor actions performed on a key associated with this model. The `#on`
method allows you to register a listener to room events, key events, and model events.

The model events `ready` and `error` do not accept an `optionsObject`.

The `ready` listener will be passed no arguments and is called when the model is
first synchronized.

The `error` listener will be passed a single `errorObject` argument if
triggered.

## Monitorable Events

- ###### `join`
- ###### `leave`
- ###### `set`
- ###### `add`
- ###### `remove`
- ###### `ready`
- ###### `error`

## Methods

- ###### model.$on(eventName, listener(user))
- ###### model.$on(eventName, listener(value, contextObject))
- ###### model.$on(eventName, optionsObject, listener(value, contextObject))
- ###### model.$on(eventName, listener())
- ###### model.$on(eventName, listener(errorObject))

## Parameters

| eventName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The event to monitor. |
| Must be one of the monitorable events listed above. An error will be thrown otherwise. |

| listener(user) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called whenever a user `join`s or `leave`s. |
| - `user` will be the userObject associated with the user who triggered the event. |

| listener(value, contextObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called whenever a user performs an `$add`, `$set`, or `$remove` operation on the model. |
| Local events will only trigger this listener if it is part of the optionsObject (defined below), and the `local` parameter is set to `true`. |
| - `value` will be the value of the key upon the listener being fired. |
| - `contextObject` will be a [KeyContext](../../javascript_api/key/context.html) object for the event. |

| listener(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called when an error occurs. |
| - `errorObject` will contain the error that occurred. |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with two properties, `local` and `bubble`, that determines how this action behaves. |
| - `local` [**default: false**] is a boolean where, if true, the listener will be triggered for local events. |
| - `bubble` [**default: false**] is a boolean where, if true, the listener will bubble events. |

## Examples

Register a listener for whenever a user joins or leaves:
```js
angular.module('yourApp').controller('aCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  $scope.users.$on('join', function(user) {
    console.log(user, 'join');
  });

  $scope.users.$on('leave', function(user) {
    console.log(user, 'leave');
  });
});
```
