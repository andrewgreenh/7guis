# Counter

Really not much to discuss here. Since we are using plain React, the state of the counter lives inside the component state. This requires us to update the state via the `setState` call, so that React knows when it should perform a rerender. The declarative nature of React allows us to directly map the required UI to components. I don't feel like there is much need to go into further detail for each evaluation dimension for this simple example as this is about as bare as it gets.

**Note** With the help of [styled components](https://www.styled-components.com) we can also keep the styles out of the component definition.

```JSX
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
```
