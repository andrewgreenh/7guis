import React from 'react';

import InputGroup from '../../__shared__/InputGroup';
import Label from '../../__shared__/Label';
import ValidatedInput from '../../__shared__/ValidatedInput';

const r = round(2);
const formats = [
  {
    name: 'Celsius',
    convert: c => r(c),
    revert: x => r(x)
  },
  {
    name: 'Kelvin',
    convert: c => r(c + 273.15),
    revert: k => r(k - 273.15)
  },
  {
    name: 'Fahrenheit',
    convert: c => r(c * (9 / 5) + 32),
    revert: f => r((f - 32) * (5 / 9))
  }
];

class TemperatureConverter extends React.PureComponent {
  state = {
    value: 5
  };
  render = () => {
    return (
      <InputGroup>
        {formats.map(({ name, convert, revert }) => (
          <Label label={name} key={name}>
            <ValidatedInput
              value={convert(this.state.value)}
              onChange={this.handleChange(revert)}
              isValid={isNumberString}
            />
          </Label>
        ))}
      </InputGroup>
    );
  };

  handleChange = revert => e => this.setState({ value: revert(Number(e.target.value)) });
}

export default TemperatureConverter;

function isNumberString(string) {
  if (string.trim() === '') return false;
  const parsed = Number(string);
  return !Number.isNaN(parsed);
}

function round(decimals, number) {
  if (number === undefined) return number => round(decimals, number);
  return Math.round(number * 10 ** decimals) / 10 ** decimals;
}
