import { useState } from "react";
import { Grid, Button, Typography, Select, MenuItem } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  SelectField,
  DiagnosisSelection,
} from "../AddPatientModal/FormField";
import { HealthCheckRating, EntryType, NewEntry } from "../types";
import { useStateValue } from "../state";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

export type RatingOption = {
  value: HealthCheckRating;
  label: string;
};

const ratingOptions: RatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

export interface TypeOption {
  value: EntryType;
  label: string;
}

const typeOptions: TypeOption[] = [
  { value: EntryType.HealthCheck, label: "Health Check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" },
];

interface dischargeError {
  date: string;
  criteria: string;
}

interface sickLeaveError {
  startDate: string;
  endDate: string;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck);

  return (
    <Formik
      initialValues={{
        type,
        description: "",
        date: "",
        specialist: "",
        healthCheckRating: HealthCheckRating.Healthy,
        discharge: {
          date: "",
          criteria: "",
        },
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: {
          [field: string]: string | dischargeError | sickLeaveError;
        } = {};
        console.log(errors);
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (values.type === EntryType.Hospital) {
          const discharge = { date: "", criteria: "" };
          if (values.discharge && !values.discharge.date) {
            errors.discharge = { ...discharge, date: requiredError };
          }
          if (values.discharge && !values.discharge.criteria) {
            errors.discharge = { ...discharge, criteria: requiredError };
          }
        }
        if (values.type === EntryType.OccupationalHealthcare) {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          const sickLeave = { startDate: "", endDate: "" };
          if (
            values.sickLeave &&
            values.sickLeave.startDate &&
            !values.sickLeave.endDate
          ) {
            errors.sickLeave = { ...sickLeave, endDate: requiredError };
          }
          if (
            values.sickLeave &&
            !values.sickLeave.startDate &&
            values.sickLeave.endDate
          ) {
            errors.sickLeave = { ...sickLeave, startDate: requiredError };
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Select
              value={type}
              onChange={({ target }) => {
                setType(target.value as EntryType);
                setFieldValue("type", target.value as EntryType);
              }}
            >
              {typeOptions.sort().map((o) => (
                <MenuItem key={o.label} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            {type === EntryType.HealthCheck && (
              <SelectField
                label="Health Check Rating"
                name="healthCheckRating"
                options={ratingOptions}
              />
            )}
            {type === EntryType.Hospital && (
              <>
                <Typography align="left" variant="h6">
                  Discharge
                </Typography>
                <Field
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </>
            )}
            {type === EntryType.OccupationalHealthcare && (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Typography align="left" variant="h6">
                  Sick Leave
                </Typography>
                <Field
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </>
            )}
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
