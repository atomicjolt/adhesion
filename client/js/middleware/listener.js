import AtomicListener from '../libs/atomic_listener/atomic_listener';

const LISTENERS = new WeakMap();
const LISTENER_KEYS = {};

function InvalidListenerActionException(message) {
  this.message = message;
  this.name = 'Invalid Listener Action';
}

function validateAction(action) {
  const { predicate, onComplete, url } = action;
  if (!predicate || !onComplete || !url) {
    throw new InvalidListenerActionException(
      'The action you supplied does not have the required keys'
    );
  }
}

const Listener = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (action.type === 'CREATE_ATOMIC_LISTENER') {
    debugger
    validateAction(action);

    const existingKey = LISTENER_KEYS[`${action.url}_${action.uniqueParam}`];
    if (existingKey) {
      LISTENERS.get(existingKey).kill();
    }
    const key = existingKey || { val: `${action.url}_${action.uniqueParam}` };
    LISTENER_KEYS[`${action.url}_${action.uniqueParam}`] = key;
    LISTENERS.set(key, new AtomicListener(
      {
        settings: store.getState().settings,
        jwt: store.getState().jwt,
      },
      action.url,
      action.params,
      action.predicate,
      action.completePredicate,
      (response) => {
        store.dispatch(action.onComplete(response, action));
      },
      (response) => {
        delete LISTENER_KEYS[`${action.url}_${action.uniqueParam}`];
        store.dispatch(action.onComplete(response, action));
      },
      (err) => {
        delete LISTENER_KEYS[`${action.url}_${action.uniqueParam}`];
        store.dispatch(action.onError ? action.onError(err, action) : {});
      },
      action.interval,
    ));

  }
  next(action);
};


export default Listener;
