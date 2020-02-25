import React, { FC, useMemo } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step, { StepProps } from '@material-ui/core/Step';
import StepLabel, { StepLabelProps } from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { isStepOptional } from '../../../containers/profileOnboarding/helper';

interface ProgressStepperProps {
  activeStep: number;
  progressSteps: string[];
  skipped: any[];
}

const ProgressStepper: FC<ProgressStepperProps> = ({ activeStep, progressSteps, skipped }) => {
  const activeSkipped = new Set(skipped);

  const stepList = useMemo(
    () =>
      progressSteps.map((label, index) => {
        const stepProps: StepProps = {};
        const labelProps: StepLabelProps = { children: label };
        if (isStepOptional(index)) {
          labelProps.optional = <Typography variant="caption">Optional</Typography>;
        }
        if (activeSkipped.has(index)) {
          stepProps.completed = false;
        }
        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps} />
          </Step>
        );
      }),
    [progressSteps, activeSkipped]
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
