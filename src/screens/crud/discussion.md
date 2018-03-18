# CRUD

In this task, I implemented the component in a way that allows the person store to have an async API (like a backend or a browser-based database).

```jsx
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

// ...
```

The main component is keeping the state of the currently loaded persons (the model) and passes this state to the child components `PersonSelector` and `PersonForm`.

This model could very well live in a separate service or a state container like Redux, however in this simple case, it is easier to keep it inside the component.

As an example of state updates, I'd like to use the creation of new persons:

```jsx
// ...
handleCreate = async () => {
  const created = await addPerson(this.state.name, this.state.surname);
  this.setState(state => ({
    name: '',
    surname: '',
    personsById: { ...state.personsById, [created.id]: created }
  }));
};
// ...
```

We first add the person via our async API, when the result is there, we simply update our state store and reset the states for the two input fields. By separating the state of the input fields from the values of the model (name and surname of a person), we can simply edit those fields and merge the fields back into the model when we want to update.

The same thing happens when filtering in the PersonSelector. As the parent component is not concerned with this state, it is encapsulated inside the child component.

The render method of the PersonSelector can decide, how the persons should be rendered.

```jsx
// ***

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

//***
```

This way, the UI concerns (sorting and filtering) are encapsulated in the component that needs these states. This way the model can be easily separated from the UI rendering.
