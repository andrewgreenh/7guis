import React from 'react';

import Button from '../../__shared__/Button';
import Input from '../../__shared__/Input';

class Counter extends React.PureComponent {
  state = {
    value: 1
  };
  render = () => (
    <React.Fragment>
      <Input value={this.state.value} readOnly />
      <Button onClick={() => this.setState(state => ({ value: state.value + 1 }))}>Count</Button>
    </React.Fragment>
  );
}

export default Counter;
