import api from '../api';
import NetworkConstants from '../../constants/network';

export default class AtomicListener {
  constructor(
    releventState,
    url,
    params,
    predicate,
    completePredicate,
    onMatch,
    onComplete,
    onError = () => ({}),
    interval = 10000,
  ) {
    this.timeout = null;
    this.url = url;
    this.params = params;
    this.predicate = predicate;
    this.completePredicate = completePredicate;
    this.onMatch = onMatch;
    this.onComplete = onComplete;
    this.onError = onError;
    this.releventState = releventState;
    this.interval = interval;

    this.recursiveListen();
  }

  recursiveListen() {
    const updatedParams = {
      oauth_consumer_key: this.releventState.settings.oauthConsumerKey,
      ...this.params,
    };

    const promise = api.execRequest(
      NetworkConstants.GET,
      this.url,
      this.releventState.settings.apiUrl,
      this.releventState.jwt,
      this.releventState.settings.csrfToken,
      updatedParams,
      {},
      null,
      20000,
    );

    promise.then(
      (response) => {
        if (this.completePredicate(response)) {
          this.onComplete(response);
          this.kill();
        } else if (this.predicate(response)) {
          this.onMatch(response);
        } else {
          this.timeout = setTimeout(() => this.recursiveListen(), this.interval);
        }
      },
      (error) => {
        this.onError(error);
      },
    );
  }

  kill() { // let this thing be garbage collected
    clearTimeout(this.timeout);
    this.timeout = null;
    this.url = null;
    this.params = null;
    this.predicate = null;
    this.onComplete = null;
    this.onError = null;
    this.releventState = null;
    this.interval = null;
  }
}
