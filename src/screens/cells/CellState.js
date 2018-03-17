import { flatMap } from 'lodash';

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
      this.updatePlain(key);
    }
    let keysToUpdate;
    try {
      keysToUpdate = this.getKeysToUpdate(key);
    } catch (e) {
      state.error = e.message;
      this.updateIncorrectFormula(key);
      this.notifyKey(key);
    }
    if (keysToUpdate) this.evaluateKeys(keysToUpdate);
  };

  updatePlain = key => {
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

  getKeysToUpdate = (startingKey, alreadySeen = new Set()) => {
    if (alreadySeen.has(startingKey)) throw new Error('Cyclic dependencies');
    alreadySeen.add(startingKey);
    const dependants = this.dependantsByKey[startingKey] || new Set();
    return [
      startingKey,
      ...flatMap([...dependants], key => this.getKeysToUpdate(key, alreadySeen))
    ];
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
