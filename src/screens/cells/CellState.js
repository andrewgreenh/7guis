import parse from './parser/parse';
import getDependencies from './utils/getDependencies';

class CellState {
  statesByKey = {};
  dependantsByKey = {};
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
    if (!this.statesByKey[key]) this.statesByKey[key] = {};
    this.cleanDependencies(key);
    const state = this.statesByKey[key];
    state.rawValue = rawValue;
    localStorage.setItem('7guis-cell-state', JSON.stringify(this.statesByKey));
    const isFormula = rawValue.startsWith('=');

    if (isFormula) {
      try {
        const ast = parse(rawValue.substring(1));
        state.ast = ast;
        this.updateCorrectFormula(key);
      } catch (e) {
        state.error = e.message;
        this.updateIncorrectFormula(key);
      }
    } else {
      this.updatePlain(key);
    }
    this.propagateFrom(key);
  }

  updatePlain(key) {
    const state = this.statesByKey[key];
    state.value = state.rawValue;
    state.ast = null;
    state.error = null;
    state.dependencies = new Set();
  }

  updateCorrectFormula(key) {
    const state = this.statesByKey[key];
    state.value = 'formula: ' + state.rawValue;
    state.ast = state.ast;
    state.error = null;
    state.dependencies = getDependencies(state.ast);
    [...this.statesByKey[key].dependencies].forEach(dependency => {
      if (!this.dependantsByKey[dependency]) this.dependantsByKey[dependency] = new Set();
      this.dependantsByKey[dependency].add(key);
    });
  }

  updateIncorrectFormula(key) {
    const state = this.statesByKey[key];
    state.value = 'ERROR: ' + state.rawValue;
    state.ast = null;
    state.error = state.error;
    state.dependencies = new Set();
  }

  cleanDependencies(key) {
    const oldDependencies = this.statesByKey[key].dependencies || new Set();
    [...oldDependencies].forEach(dependency => this.dependantsByKey[dependency].delete(key));
  }

  propagateFrom(key, queue = []) {
    const { rawValue } = this.statesByKey[key];
    if (!rawValue.startsWith('=')) {
      this.notifyKey(key);
      return;
    }
    this.notifyKey(key);
  }
}

export default CellState;
