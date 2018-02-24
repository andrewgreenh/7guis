import { orderBy } from 'lodash';
import { lighten } from 'polished';
import React from 'react';
import styled from 'styled-components';

import { lightGray } from '../../__shared__/colors';
import Input from '../../__shared__/Input';

const List = styled.ul`
  grid-column: 1;
  grid-row: 2;
  max-height: 100%;
  list-style-type: none;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ListItem = styled.li`
  background-color: ${props => (props.selected ? lighten(0.15, lightGray) : undefined)};
  cursor: pointer;
  padding: 0.2rem;

  &:hover {
    background-color: ${lighten(0.1, lightGray)};
  }
`;

const Filter = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  padding: 0.5rem;

  ${Input} {
    flex: 1 1 auto;
    width: 100%;
  }
`;

const Label = styled.label`
  flex: 0 0 auto;
  padding-right: 1rem;
`;

class PersonSelector extends React.PureComponent {
  state = {
    filter: ''
  };

  render() {
    return (
      <React.Fragment>
        <Filter>
          <Label>Filter:</Label>
          <Input
            value={this.state.filter}
            onChange={e => this.setState({ filter: e.target.value })}
          />
        </Filter>
        <List>{this.renderPersons()}</List>
      </React.Fragment>
    );
  }

  renderPersons = () => {
    const { personsById } = this.props;
    const sorted = orderBy(personsById, ['name', 'surname']);
    const filter = this.state.filter.toLowerCase();
    const filtered = sorted.filter(
      person =>
        person.name.toLowerCase().includes(filter) || person.surname.toLowerCase().includes(filter)
    );
    return filtered.map(person => (
      <ListItem
        key={person.id}
        selected={person.id === this.props.selectedPersonId}
        onClick={() => this.props.onSelect(person)}
      >
        {person.name}, {person.surname}
      </ListItem>
    ));
  };
}

export default PersonSelector;
