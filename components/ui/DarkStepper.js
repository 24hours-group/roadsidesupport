import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import styles from "./DarkStepper.module.css";

// Custom connector with dark theme styling
const DarkConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#FF6D00",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#FF6D00",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: "#455A64",
    borderRadius: 1,
  },
}));

// Custom step icon
function StepIcon({ active, completed, icon }) {
  return (
    <div
      className={`${styles.stepIcon} ${
        completed || active ? styles.stepIconActive : styles.stepIconInactive
      }`}
    >
      {icon}
    </div>
  );
}

export default function DarkStepper({
  steps = ["Situation", "Vehicle", "Contact"],
  activeStep = 0,
  className = "",
}) {
  return (
    <div className={className}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<DarkConnector />}
        sx={{
          "& .MuiStepLabel-label": {
            color: "rgba(255,255,255,0.5)",
            fontWeight: 500,
            fontSize: "0.75rem",
            marginTop: "8px",
            "&.Mui-active": {
              color: "#FF6D00",
            },
            "&.Mui-completed": {
              color: "rgba(255,255,255,0.7)",
            },
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <StepIcon
                  {...props}
                  active={index === activeStep}
                  completed={index < activeStep}
                  icon={index + 1}
                />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
