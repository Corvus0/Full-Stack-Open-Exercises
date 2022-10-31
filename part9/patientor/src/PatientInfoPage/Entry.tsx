import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Typography, Divider } from "@mui/material";
import { Entry as EntryType, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

const HospitalEntry = () => {
  return (
    <>
      {" "}
      <LocalHospitalIcon />
    </>
  );
};

const OccupationalHealthcareEntry = ({ employer }: { employer: string }) => {
  return (
    <>
      {" "}
      <WorkIcon /> {employer}
    </>
  );
};

const HealthCheckEntry = ({
  healthRating,
}: {
  healthRating: HealthCheckRating;
}) => {
  let color = "";
  let healthIcon = null;
  switch (healthRating) {
    case 0:
      color = "green";
      break;
    case 1:
      color = "yellow";
      break;
    case 2:
      color = "orange";
      break;
    case 3:
      color = "red";
      break;
  }
  if (color) {
    healthIcon = <FavoriteIcon htmlColor={color} />;
  }
  return (
    <>
      {" "}
      <MedicalServicesIcon />
      {healthIcon}
    </>
  );
};

const EntryDetails: React.FC<{ entry: EntryType }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry employer={entry.employerName} />;
    case "HealthCheck":
      return <HealthCheckEntry healthRating={entry.healthCheckRating} />;
    default:
      return <div></div>;
  }
};

const Entry: React.FC<{ entry: EntryType }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Box
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        m: 2,
        p: 2,
        minWidth: 300,
        "&:hover": { boxShadow: 8 },
      }}
    >
      <Typography align="left" variant="body1">
        {entry.date}
        <EntryDetails entry={entry} />
      </Typography>
      <Divider />
      <Typography align="left" variant="body2">
        <em>{entry.description}</em>
      </Typography>
      <ul>
        {entry.diagnosisCodes?.map((code) => {
          const diagnosis = diagnoses.find((d) => d.code === code);
          let name = null;
          if (diagnosis) {
            name = diagnosis.name;
          }
          return (
            <li key={code}>
              <Typography align="left" variant="body2">
                {code} {name}
              </Typography>
            </li>
          );
        })}
      </ul>
      <Typography align="left" variant="body2">
        Diagnosed by {entry.specialist}
      </Typography>
    </Box>
  );
};

export default Entry;
