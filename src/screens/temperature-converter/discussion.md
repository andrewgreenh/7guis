# Temperature Converter

Here, the implementation departs a little bit from the task description.
The description states that there is a "bidirectional data flow between the Celsius and Fahrenheit inputs". Typically, you don't do this sibling to sibling communication. Instead, the developer should lift the state up into a common parent and propagate changes back down to all children. One of the advantages of this approach is, that you don't need to add n more connections when adding an input field n+1.

At first, definitions of different number formats are declared:

```jsx
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
```

Noe that these formats are currently defined in the same file, however it would be very simple to move this into the props of the component to have a more generic ConverterComponent.

```jsx
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

  // ...
```

As you can see in this part of the ComponentDefinition, each input field gets its own state so that we are only using controlled components. The state is only kept inside of React and gets propagated back to the DOM on changes. This way, it is really easy to add validations to the Input Component. Additionally we simply iterate over all defined formats and render a labeled input field with the current change and a bound change handler:

```jsx
// ...

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
```

This gets a little complicated in plain React. It is recommended to always work with immutable data. This means we should not simply set the new state but create a new state object and tell react to update accordingly. Immutable libraries or something like Mobx could help here. On the upside, it is not necessary to check for cyclic updates between the different inputs, as changes to the state are applied at the top and simply trickle down to the components.
