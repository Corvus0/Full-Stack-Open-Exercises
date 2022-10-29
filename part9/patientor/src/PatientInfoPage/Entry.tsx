import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Typography } from "@material-ui/core";
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
    <Box m={1} p={1} sx={{ border: "1px dashed grey", borderRadius: "16px" }}>
      <Typography align="left" variant="body2">
        {entry.date}
        <EntryDetails entry={entry} />
      </Typography>
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
