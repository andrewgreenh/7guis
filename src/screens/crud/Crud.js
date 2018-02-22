import { isEmpty } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import { lightGray } from '../../__shared__/colors';
import PersonForm from './PersonForm';
import PersonRepository from './PersonRepository';
import PersonSelector from './PersonSelector';

const Main = styled.div`
  border: 1px solid ${lightGray};
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 500px;
`;

const Columns = styled.div`
  display: flex;
  height: 100%;
  flex: 1 1 auto;
  overflow: hidden;
`;

const Column = styled.div`
  flex: 1 1 0;
  height: 100%;
  padding: 0.5rem;
`;

const Commands = styled.div`
  flex: 0 0 auto;
  padding: 0 0.5rem 0.5rem;
  width: 100%;
`;

class Crud extends React.PureComponent {
  state = {
    selectedPersonId: null,
    name: '',
    surname: ''
  };

  componentWillMount() {
    this.personRepository = new PersonRepository();
  }

  render() {
    return (
      <Main>
        <Columns>
          <Column>
            <PersonSelector
              personRepository={this.personRepository}
              selectedPersonId={this.state.selectedPersonId}
              onSelect={this.handleSelect}
            />
          </Column>
          <Column>
            <PersonForm
              name={this.state.name}
              surname={this.state.surname}
              onChange={this.handleChange}
            />
          </Column>
        </Columns>
        <Commands>
          <Button
            disabled={isEmpty(this.state.name) || isEmpty(this.state.surname)}
            onClick={this.handleCreate}
          >
            Create
          </Button>
          <Button disabled={!this.state.selectedPersonId} onClick={this.handleUpdate}>
            Update
          </Button>
          <Button disabled={!this.state.selectedPersonId} onClick={this.handleDelete}>
            Delete
          </Button>
        </Commands>
      </Main>
    );
  }

  handleChange = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleCreate = () => {
    this.personRepository.add(this.state.name, this.state.surname);
    this.setState({ name: '', surname: '' });
  };

  handleDelete = () => {
    this.personRepository.delete(this.state.selectedPersonId);
    this.setState({ selectedPersonId: null, name: '', surname: '' });
  };

  handleSelect = person => {
    this.setState({ selectedPersonId: person.id, name: person.name, surname: person.surname });
  };

  handleUpdate = () => {
    this.personRepository.update(this.state.selectedPersonId, {
      name: this.state.name,
      surname: this.state.surname
    });
  };
}

export default Crud;
