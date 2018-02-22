import { omit, pull } from 'lodash';

class PersonRepository {
  nextId = 1;
  personsById = {};
  subscribers = [];

  constructor() {
    this.add('Hans', 'Emil');
    this.add('Mustermann', 'Max');
    this.add('Roman', 'Tisch');
  }

  subscribe = subscriber => {
    this.subscribers.push(subscriber);
    subscriber(this.personsById);
    return () => pull(this.subscribers, subscriber);
  };
  notify = () => this.subscribers.forEach(fn => fn(this.personsById));

  add = (name, surname) => {
    const person = { id: this.nextId++, name, surname };
    this.personsById = { ...this.personsById, [person.id]: person };
    this.notify();
    return person;
  };

  update = (id, personUpdate) => {
    const oldPerson = this.personsById[id];
    if (!oldPerson) throw new Error('No person with id found');
    this.personsById = { ...this.personsById, [id]: { ...oldPerson, ...personUpdate } };
    this.notify();
    return this.personsById[id];
  };

  delete = id => {
    const person = this.personsById[id];
    if (!person) throw new Error('No person with id found');
    this.personsById = omit(this.personsById, id);
    this.notify();
  };
}

export default PersonRepository;
