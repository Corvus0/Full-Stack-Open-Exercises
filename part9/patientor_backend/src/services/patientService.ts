import patients from "../../data/patients";
import { PublicPatient, Patient, NewPatient, NewEntry, Entry } from "../types";
import { v1 as uuid } from "uuid";

const getEntries = (): Array<Patient> => {
  return patients;
};

const getPublicEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findPatient = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (entry: NewPatient) => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    return;
  }
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addPatient,
  getPublicEntries,
  findPatient,
  addEntry,
};
