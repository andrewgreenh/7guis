import React from 'react';

class Subscribe extends React.PureComponent {
  state = {
    value: null
  };

  static defaultProps = {
    mapValue: x => x
  };

  componentWillMount() {
    this.unsubscribe = this.props.observable.subscribe(value => {
      const mappedValue = this.props.mapValue(value);
      if (mappedValue === this.state.value) return;
      this.setState({ value: mappedValue });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.props.children(this.state.value);
  }
}

export default Subscribe;
