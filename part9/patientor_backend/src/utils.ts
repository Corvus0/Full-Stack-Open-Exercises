import {
  NewPatient,
  Gender,
  EntryType,
  NewEntry,
  HealthCheckRating,
} from "./types";

type PatientFields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

export const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: PatientFields): NewPatient => {
  const newPatient = {
    name: parseStringField(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseStringField(ssn),
    gender: parseGender(gender),
    occupation: parseStringField(occupation),
  };

  return newPatient;
};

export const toNewEntry = (entry: unknown): NewEntry => {
  const newEntry = parseEntry(entry);
  return newEntry;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseStringField = (field: unknown): string => {
  if (!field || !isString(field)) {
    throw new Error("Incorrect or missing field:" + field);
  }

  return field;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const isEntryType = (param: any): param is EntryType => {
  return Object.values(EntryType).includes(param);
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isEntryType(type)) {
    throw new Error("Incorrect entry type: " + type);
  }
  return type;
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error("Incorrect health check rating: " + rating);
  }
  return rating;
};

const parseEntry = (param: any): NewEntry => {
  const entry = {
    type: parseEntryType(param.type),
    description: parseStringField(param.description),
    date: parseDate(param.date),
    specialist: parseStringField(param.specialist),
  };
  switch (param.type) {
    case "HealthCheck":
      if (param.diagnosisCodes) {
        return {
          ...entry,
          healthCheckRating: parseHealthCheckRating(param.healthCheckRating),
          type: EntryType.HealthCheck,
          diagnosisCodes: param.diagnosisCodes,
        };
      }
      return {
        ...entry,
        healthCheckRating: parseHealthCheckRating(param.healthCheckRating),
        type: EntryType.HealthCheck,
      };
    case "Hospital":
      return {
        ...entry,
        discharge: {
          date: parseDate(param.discharge.date),
          criteria: parseStringField(param.discharge.criteria),
        },
        type: EntryType.Hospital,
      };
    case "OccupationalHealthcare":
      if (
        param.sickLeave &&
        param.sickLeave.startDate &&
        param.sickLeave.endDate
      ) {
        return {
          ...entry,
          employerName: parseStringField(param.employerName),
          sickLeave: {
            startDate: parseDate(param.sickLeave.startDate),
            endDate: parseDate(param.sickLeave.endDate),
          },
          type: EntryType.OccupationalHealthcare,
        };
      }
      return {
        ...entry,
        employerName: parseStringField(param.employerName),
        type: EntryType.OccupationalHealthcare,
      };
    default:
      throw new Error("Incorrect entry type: " + param.type);
  }
};
