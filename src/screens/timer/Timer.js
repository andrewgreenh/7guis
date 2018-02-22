import { round } from 'lodash';
import React from 'react';

import Button from '../../__shared__/Button';
import Input from '../../__shared__/Input';

class Timer extends React.PureComponent {
  state = {
    duration: 20,
    value: 0
  };
  componentDidMount = () => (this.interval = setInterval(this.tick, 100));

  componentWillUnmount = () => clearInterval(this.interval);
  render = () => (
    <div>
      {this.state.value.toFixed(1)} / {this.state.duration.toFixed(1)}
      <br />
      {this.state.value.toFixed(1)}s
      <br />
      <Input
        type="range"
        onChange={this.handleDurationChange}
        min={0}
        max={60}
        value={this.state.duration}
      />
      <br />
      <Button onClick={this.reset}>Reset</Button>
    </div>
  );

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

export default Timer;
