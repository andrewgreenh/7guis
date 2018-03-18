# Circle Drawer

## Painting circles

I decided to draw circles with svg. This way, we can still leverage the declarative nature of React while keeping the freedom of different shapes of svg.

```jsx
// ...

<CirclesFrame>
  <SVG
    innerRef={svg => (this.svg = svg)}
    onClick={this.handleClick}
    onMouseMove={this.handleMouseMove}
  >
    {sortedCircles.map(({ id, x, y, r }) => (
      <Circle key={id} cx={x} cy={y} r={r} hovered={id === this.state.hoveredCircleId} />
    ))}
  </SVG>
</CirclesFrame>

// ...
```

With declarative UIs the mapping between the mental model of the application and the implementation is very easy. If we want to add a circle, we just add it to the state and return another Circle Component from the render method. No imperative drawing or removing of elements.

## Undo/Redo

To separate the undo/redo logic from the main UI, a separate class was implemented: `ActionHistory`.

```js
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
```

This class keeps the state and a stack for undo and redo. Clients of this class can register themselves as listeners and get updated, whenever an undo/redo or nextState is fired.

This class is then connected to the UI Component via simple composition:

```jsx
class CircleDrawer extends React.PureComponent {
  actionHistory = new ActionHistory({});

  state = {
    circlesById: {},
    hoveredCircleId: null,
    selectedCircleId: null,
    undoable: false,
    redoable: false
  };

  componentDidMount() {
    this.unsubsribe = this.actionHistory.onNewState(({ state: circlesById, undoable, redoable }) =>
      this.setState({ circlesById, undoable, redoable })
    );
  }

  componentWillUnmount() {
    this.unsubsribe();
  }

  addCircle = ({ x, y }) => {
    const id = this.nextId++;
    this.actionHistory.nextState({ ...this.state.circlesById, [id]: { id, x, y, r: 20 } });
  };
// ...
```

Again, the dependency on the concrete implementation of the ActionHistory could be removed by passing the history to the component via its props.
