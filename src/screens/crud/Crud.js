import { isEmpty, omit } from 'lodash';
import React from 'react';
import styled from 'styled-components';

import Button from '../../__shared__/Button';
import { lightGray } from '../../__shared__/colors';
import { addPerson, deletePerson, getPersonsById, updatePerson } from './personApi';
import PersonForm from './PersonForm';
import PersonSelector from './PersonSelector';

class Crud extends React.PureComponent {
  state = {
    personsById: {},
    selectedPersonId: null,
    name: '',
    surname: ''
  };

  async componentDidMount() {
    const personsById = await getPersonsById();
    this.setState({ personsById });
  }

  render() {
    return (
      <Main>
        <PersonSelector
          personsById={this.state.personsById}
          selectedPersonId={this.state.selectedPersonId}
          onSelect={this.handleSelect}
        />
        <PersonForm
          name={this.state.name}
          surname={this.state.surname}
          onChange={this.handleChange}
        />
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

  handleCreate = async () => {
    const created = await addPerson(this.state.name, this.state.surname);
    this.setState(state => ({
      name: '',
      surname: '',
      personsById: { ...state.personsById, [created.id]: created }
    }));
  };

  handleDelete = async () => {
    deletePerson(this.state.selectedPersonId);
    this.setState(state => ({
      selectedPersonId: null,
      name: '',
      surname: '',
      personsById: omit(state.personsById, this.state.selectedPersonId)
    }));
  };

  handleSelect = person => {
    this.setState({ selectedPersonId: person.id, name: person.name, surname: person.surname });
  };

  handleUpdate = async () => {
    const updated = await updatePerson(this.state.selectedPersonId, {
      name: this.state.name,
      surname: this.state.surname
    });
    this.setState(state => ({ personsById: { ...state.personsById, [updated.id]: updated } }));
  };
}

export default Crud;

const Main = styled.div`
  border: 1px solid ${lightGray};
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto 1fr auto;
  height: 300px;
  width: 500px;
`;

const Commands = styled.div`
  grid-row: 3;
  grid-column: 1 / 2;
  padding: 0 0.5rem 0.5rem;
`;
