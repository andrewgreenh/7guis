import { pull } from 'lodash';

class ActionHistory {
  stateListeners = [];
  undoStack = [];
  redoStack = [];

  constructor(initialState) {
    this.state = initialState;
  }

  onNewState = listener => {
    this.stateListeners.push(listener);
    this.notify();
    return () => pull(this.stateListeners, listener);
  };

  notify = () => {
    const payload = {
      state: this.state,
      undoable: this.undoStack.length > 0,
      redoable: this.redoStack.length > 0
    };
    this.stateListeners.forEach(fn => fn(payload));
  };

  nextState = state => {
    this.undoStack.push(this.state);
    this.state = state;
    this.redoStack = [];
    this.notify();
  };

  undo = () => {
    if (this.undoStack.length === 0) return;
    const current = this.state;
    this.state = this.undoStack.pop();
    this.redoStack.push(current);
    this.notify();
  };

  redo = () => {
    if (this.redoStack.length === 0) return;
    const current = this.state;
    this.state = this.redoStack.pop();
    this.undoStack.push(current);
    this.notify();
  };
}

export default ActionHistory;
