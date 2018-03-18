import { flatMap, reverse, uniq } from 'lodash';

import evaluate from './evalutation/evaluate';
import parse from './parser/parse';
import getDependencies from './utils/getDependencies';

class CellState {
  statesByKey = {};
  dependantsByKey = {};
  subscribersByKey = {};

  notifyKey = key => {
    if (this.subscribersByKey[key]) this.subscribersByKey[key](this.statesByKey[key]);
  };

  subscribeCell = (key, subscriber) => {
    this.subscribersByKey[key] = subscriber;
    this.notifyKey(key);
    return () => delete this.subscribersByKey[key];
  };

  updateRaw = (key, rawValue) => {
    if (!this.statesByKey[key]) this.statesByKey[key] = {};
    this.cleanDependencies(key);
    const state = this.statesByKey[key];
    state.rawValue = rawValue;
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
      this.updateTextual(key);
    }
    try {
      const keysToUpdate = this.getKeysToUpdate(key);
      this.evaluateKeys(keysToUpdate);
    } catch (e) {
      state.error = e.message;
      state.value = 'ERROR: ' + state.rawValue;
      state.error = state.error;
      this.notifyKey(key);
    }
  };

  updateTextual = key => {
    const state = this.statesByKey[key];
    state.value = state.rawValue;
    state.ast = null;
    state.error = null;
    state.dependencies = new Set();
  };

  updateCorrectFormula = key => {
    const state = this.statesByKey[key];
    state.value = 'PENDING';
    state.ast = state.ast;
    state.error = null;
    state.dependencies = getDependencies(state.ast);
    [...this.statesByKey[key].dependencies].forEach(dependency => {
      if (!this.dependantsByKey[dependency]) this.dependantsByKey[dependency] = new Set();
      this.dependantsByKey[dependency].add(key);
    });
  };

  updateIncorrectFormula = key => {
    const state = this.statesByKey[key];
    state.value = 'ERROR: ' + state.rawValue;
    state.ast = null;
    state.error = state.error;
    state.dependencies = new Set();
  };

  cleanDependencies = key => {
    const oldDependencies = this.statesByKey[key].dependencies || new Set();
    [...oldDependencies].forEach(dependency => this.dependantsByKey[dependency].delete(key));
  };

  getKeysToUpdate = (startingKey, count = 0) => {
    if (count > 1000) throw new Error('Possible cycle detected');
    const dependants = this.dependantsByKey[startingKey] || new Set();
    return reverse(
      uniq(
        reverse([
          startingKey,
          ...flatMap([...dependants], key => this.getKeysToUpdate(key, count + 1))
        ])
      )
    );
  };

  evaluateKeys = keys => {
    keys.forEach(key => {
      const state = this.statesByKey[key];
      if (state && state.ast) state.value = 'PENDING';
    });
    keys.forEach(key => {
      const state = this.statesByKey[key];
      if (!state) return;
      if (state.value === 'PENDING') state.value = evaluate(state.ast, this.statesByKey);
      this.notifyKey(key);
    });
  };
}

export default CellState;
