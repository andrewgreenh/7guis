import { round } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import Input from '../../__shared__/Input';
import ProgressBar from '../../__shared__/ProgressBar';

const Wrapper = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 400px;
`;

const Element = styled.div`
  align-items: center;
  display: flex;
  overflow: hidden;
`;

const Label = styled.div`
  flex: 0 0 auto;
  padding-right: 3rem;
`;

const Value = styled.div`
  flex: 1 1 auto;
  width: 100%;

  & > * {
    width: 100%;
  }
`;

class Timer extends React.PureComponent {
  state = {
    duration: 20,
    value: 0
  };
  componentDidMount = () => (this.interval = setInterval(this.tick, 100));

  componentWillUnmount = () => clearInterval(this.interval);

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
