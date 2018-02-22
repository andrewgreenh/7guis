import { map, mapValues } from 'lodash';
import React from 'react';

import Input from '../../__shared__/Input';
import InputGroup from '../../__shared__/InputGroup';
import Label from '../../__shared__/Label';

const r = round(2);
const formatsByName = {
  Celsius: {
    name: 'Celsius',
    convert: c => r(c),
    revert: x => r(x)
  },
  Kelvin: {
    name: 'Kelvin',
    convert: c => r(c + 273.15),
    revert: k => r(k - 273.15)
  },
  Fahrenheit: {
    name: 'Fahrenheit',
    convert: c => r(c * (9 / 5) + 32),
    revert: f => r((f - 32) * (5 / 9))
  }
};

class TemperatureConverter extends React.PureComponent {
  state = {
    inputStates: mapValues(formatsByName, format => format.convert(5).toString())
  };
  render = () => {
    return (
      <InputGroup>
        {map(formatsByName, format => (
          <Label htmlFor={format.name} label={format.name} key={format.name}>
            <Input
              id={format.name}
              value={this.state.inputStates[format.name]}
              onChange={this.handleChange(format)}
              invalid={!isNumberString(this.state.inputStates[format.name])}
            />
          </Label>
        ))}
      </InputGroup>
    );
  };

  handleChange = format => e => {
    const value = e.target.value;
    const parsed = Number(value);
    if (isNumberString(value)) {
      const reverted = format.revert(parsed);
      this.setState(state => ({
        inputStates: mapValues(state.inputStates, (oldValue, inputName) => {
          const inputFormat = formatsByName[inputName];
          if (name === format.name) return value;
          return inputFormat.convert(reverted).toString();
        })
      }));
    }
    this.setState(state => ({ inputStates: { ...state.inputStates, [format.name]: value } }));
  };
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
