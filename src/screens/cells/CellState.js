class CellState {
  statesByKey = {};
  subscribersByKey = {};

  notifyKey(key) {
    if (this.subscribersByKey[key]) this.subscribersByKey[key](this.statesByKey[key]);
  }

  subscribeCell(key, subscriber) {
    this.subscribersByKey[key] = subscriber;
    this.notifyKey(key);
    return () => delete this.subscribersByKey[key];
  }

  updateRaw(key, rawValue) {
    this.statesByKey[key] = { rawValue };
    this.propagateFrom(key);
  }

  propagateFrom(key) {
    this.notifyKey(key);
  }
}

export default CellState;
