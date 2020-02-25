import React, { FC, useMemo } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step, { StepProps } from '@material-ui/core/Step';
import StepLabel, { StepLabelProps } from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

interface ProgressStepperProps {
  activeStep: number;
  progressSteps: string[];
  isStepOptional: (step: number) => boolean;
  isStepSkipped: (step: number) => boolean;
}

const ProgressStepper: FC<ProgressStepperProps> = ({ activeStep, progressSteps, isStepOptional, isStepSkipped }) => {
  const stepList = useMemo(
    () =>
      progressSteps.map((label, index) => {
        const stepProps: StepProps = {};
        const labelProps: StepLabelProps = { children: label };
        if (isStepOptional(index)) {
          labelProps.optional = <Typography variant="caption">Optional</Typography>;
        }
        if (isStepSkipped(index)) {
          stepProps.completed = false;
        }
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps} />
          </Step>
        );
      }),
    [progressSteps, isStepOptional, isStepSkipped]
  );

  return (
    <div>
      <Stepper activeStep={activeStep}>{stepList}</Stepper>
      <div>
        {activeStep === progressSteps.length && (
          <div>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressStepper;
