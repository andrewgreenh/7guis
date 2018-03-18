# Flight Booker

This one is simpler again:

```jsx
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

  // ...
```

We define initial states for all three control elements and render the UI according to this state.
Again, the declarative nature of React makes this very simple. In the render function we can simply describe what the UI would look given a certain state. React takes care of the rest.

The validations of this form are written inside methods on this class. This keeps the render method itself slim while keeping validations bundlet at a single place.

When writing larger forms, this approach could get rather tedious which is why developers often get form helpers like [Formik](https://www.npmjs.com/package/formik).
