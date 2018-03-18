import { format, isBefore, isEqual, isValid } from 'date-fns';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import Input from '../../__shared__/Input';
import Select from '../../__shared__/Select';

class FlightBooker extends React.PureComponent {
  state = {
    flightType: 'One-way flight',
    start: format(Date.now(), 'DD.MM.YYYY'),
    end: format(Date.now(), 'DD.MM.YYYY')
  };

  render() {
    const { start, end, flightType } = this.state;
    const endDisabled = flightType === 'One-way flight';
    const startValid = isDateString(start);
    const endValid = endDisabled || isDateString(end);
    const formValid = this.isFormValid();
    return (
      <FlightBookerForm onSubmit={this.handleSubmit}>
        <Select onChange={this.handleFlightChange} value={flightType}>
          <Select.Option>One-way flight</Select.Option>
          <Select.Option>Return flight</Select.Option>
        </Select>
        <Input value={start} invalid={!startValid} onChange={this.handleDateChange('start')} />
        <Input
          value={end}
          invalid={!endValid}
          onChange={this.handleDateChange('end')}
          disabled={endDisabled}
        />
        <Button disabled={!formValid} type="submit">
          Book
        </Button>
      </FlightBookerForm>
    );
  }

  isFormValid() {
    const { start, end, flightType } = this.state;
    const endDisabled = flightType === 'One-way flight';
    const startValid = isDateString(start);
    const endValid = endDisabled || isDateString(end);
    if (!startValid || !endValid) return false;

    const startParsed = parse(start);
    const endParsed = parse(end);
    return endDisabled || isEqual(startParsed, endParsed) || isBefore(startParsed, endParsed);
  }

  handleDateChange = name => e => this.setState({ [name]: e.target.value });
  handleFlightChange = e => this.setState({ flightType: e.target.value });

  handleSubmit = e => {
    e.preventDefault();
    const { start, end, flightType } = this.state;
    let msg;
    if (flightType === 'One-way flight') {
      msg = `You have booked a one-way flight on ${format(parse(start), 'DD.MM.YYYY')}`;
    } else {
      msg = `You have booked a flight on ${format(
        parse(start),
        'DD.MM.YYYY'
      )} with a return flight on ${format(parse(end), 'DD.MM.YYYY')}`;
    }
    alert(msg);
  };
}

export default FlightBooker;

const FlightBookerForm = styled.form`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  width: 200px;

  ${Select}, ${Input}, ${Button} {
    margin-bottom: 0.5rem;
  }
`;

const dateRegex = /^(\d+)\.(\d+).(\d{4})$/;

function isDateString(date) {
  const stringFormatIsCorrect = typeof date === 'string' && date.match(dateRegex);
  if (!stringFormatIsCorrect) return;
  const [, day, month, year] = date.match(dateRegex);
  const parsed = new Date(`${year}-${month}-${day}`);
  return isValid(parsed);
}

function parse(date) {
  const stringFormatIsCorrect = typeof date === 'string' && date.match(dateRegex);
  if (!stringFormatIsCorrect) return;
  const [, day, month, year] = date.match(dateRegex);
  const parsed = new Date(`${year}-${month}-${day}`);
  return parsed;
}
