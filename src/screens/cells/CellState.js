import parse from './ast/parse';

class CellState {
  statesByKey = JSON.parse(localStorage.getItem('7guis-cell-state') || '{}');
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
    localStorage.setItem('7guis-cell-state', JSON.stringify(this.statesByKey));
    this.propagateFrom(key);
  }

  propagateFrom(key) {
    const { rawValue } = this.statesByKey[key];
    if (!rawValue.startsWith('=')) {
      this.notifyKey(key);
      return;
    }
    try {
      const ast = parse(rawValue.substring(1));
    } catch (e) {
      console.error(e);
    }
    this.notifyKey(key);
  }
}

export default CellState;
