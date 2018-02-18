import React from 'react';
import Input from './Input';
import styled from 'styled-components';
import { error } from './colors';
import { animationDuration } from './variables';

const ValidatedInputElement = styled(Input)`
  background-color: ${({ valid }) => (valid ? 'transparent' : error)};
  transition: background-color ${animationDuration};
`;

class ValidatedInput extends React.PureComponent {
  state = {
    focussed: false,
    value: null,
    valid: true
  };

  componentWillReceiveProps() {
    if (this.state.focussed) return;
    this.setState({ value: null, valid: true });
  }

  render = () => (
    <ValidatedInputElement
      {...this.props}
      value={this.state.value === null ? this.props.value : this.state.value}
      onChange={this.handleChange}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      valid={this.state.valid}
    />
  );

  handleChange = e => {
    const isValid = this.props.isValid(e.target.value);
    if (isValid) this.props.onChange(e);
    this.setState({ value: e.target.value, valid: isValid });
  };

  handleFocus = () => this.setState({ focussed: true });

  handleBlur = () => this.setState({ focussed: false });
}

export default ValidatedInput;
