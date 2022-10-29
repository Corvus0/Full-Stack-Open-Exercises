import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button } from "@material-ui/core";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

import Entry from "./Entry";
import { Patient, Entry as EntryType, NewEntry } from "../types";
import { apiBaseUrl } from "../constants";
import { addEntry, useStateValue } from "../state";
import AddEntryModal from "../AddEntryModal";

const PatientInfoPage = () => {
  const [, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    axios
      .get<Patient>(`${apiBaseUrl}/patients/${id as string}`)
      .then((response) => {
        const patient = response.data;
        setPatient(patient);
      })
      .catch(() => {
        setPatient(undefined);
      });
  }, []);

  if (!patient || !id) {
    return (
      <Box>
        <Typography align="center" variant="h6">
          Invalid Patient ID
        </Typography>
      </Box>
    );
  }

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    try {
      const { data: newEntry } = await axios.post<EntryType>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      patient.entries.push(newEntry);
      dispatch(addEntry(patient));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  let genderIcon = null;
  switch (patient.gender) {
    case "male":
      genderIcon = <MaleIcon />;
      break;
    case "female":
      genderIcon = <FemaleIcon />;
      break;
  }

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          {patient.name} {genderIcon}
        </Typography>
        <Typography align="left" variant="body1">
          SSN: {patient.ssn}
        </Typography>
        <Typography align="left" variant="body1">
          Occupation: {patient.occupation}
        </Typography>
        <Typography align="center" variant="h6">
          {patient.entries.length !== 0 && "Entries"}
        </Typography>
        {patient.entries.map((e) => (
          <Entry entry={e} key={e.id} />
        ))}
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientInfoPage;
