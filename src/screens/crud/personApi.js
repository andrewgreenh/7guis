import { omit } from 'lodash';

let nextId = 1;
let personsById = {};

const sleep = ms => new Promise(r => setTimeout(r, ms));

export const getPersonsById = async () => {
  await sleep(300);
  return personsById;
};

export const addPerson = async (name, surname) => {
  const person = { id: nextId++, name, surname };
  personsById = { ...personsById, [person.id]: person };
  await sleep(200);
  return person;
};

export const updatePerson = async (id, personUpdate) => {
  await sleep(200);
  const oldPerson = personsById[id];
  if (!oldPerson) throw new Error('No person with id found');
  personsById = { ...personsById, [id]: { ...oldPerson, ...personUpdate } };
  return personsById[id];
};

export const deletePerson = async id => {
  await sleep(200);
  const person = personsById[id];
  if (!person) throw new Error('No person with id found');
  personsById = omit(personsById, id);
};

addPerson('Mustermann', 'Max');
addPerson('Emil', 'Hans');
addPerson('Tisch', 'Roman');
