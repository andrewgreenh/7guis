# Timer

I was really looking forward to this as working with async events is quite natural in JS.

```jsx
class Timer extends React.PureComponent {
  state = {
    duration: 20,
    value: 0
  };
  componentDidMount = () => (this.interval = setInterval(this.tick, 100));

  componentWillUnmount = () => clearInterval(this.interval);

  // render method omitted

  handleDurationChange = e => {
    this.setState({ duration: Number(e.target.value) });
  };

  reset = () => this.setState({ value: 0 });

  tick = () => {
    this.setState(state => ({
      value: state.value >= state.duration ? state.value : round(state.value + 0.1, 1)
    }));
  };
}
```

As you can see, we only need 2 states for this UI: The total duration and the current value. On mount we start an interval to increase the current value, if it is lower than the max duration (see the `tick` method).

User interactions (rest button and change of the slider) are simply merged into the state of the component, the `tick` method automatically uses the current values from state to update correctly.

```jsx
// ...

render = () => (
  <Wrapper>
    <Element>
      <Label>Elapsed Time</Label>
      <Value>
        <ProgressBar value={this.state.value / this.state.duration} />
      </Value>
    </Element>
    <Element>
      <Label>Elapsed seconds</Label>
      <Value>{this.state.value.toFixed(1)}s</Value>
    </Element>
    <Element>
      <Label>Duration</Label>
      <Value>
        <Input
          type="range"
          onChange={this.handleDurationChange}
          min={0}
          max={60}
          value={this.state.duration}
        />
      </Value>
    </Element>
    <Button onClick={this.reset}>Reset</Button>
  </Wrapper>
);

//...
```

The render methods is just displaying the current state. In React, when writing the render method, you can assume that there are no async effects. The state is just there and you describe how your UI should look like.
