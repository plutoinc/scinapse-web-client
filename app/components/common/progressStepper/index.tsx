import React, { FC, useMemo } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step, { StepProps } from '@material-ui/core/Step';
import StepLabel, { StepLabelProps } from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { isStepOptional } from '../../../containers/profileOnboarding/helper';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./progressStepper.scss');

interface ProgressStepperProps {
  activeStep: number;
  progressSteps: string[];
  skipped: any[];
}

const ProgressStepper: FC<ProgressStepperProps> = ({ activeStep, progressSteps, skipped }) => {
  useStyles(s);

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
          <Step key={label} {...stepProps} classes={{ root: s.stepWrapper }}>
            <StepLabel {...labelProps} />
          </Step>
        );
      }),
    [progressSteps, activeSkipped]
  );

  return (
    <div>
      <Stepper activeStep={activeStep}>{stepList}</Stepper>
    </div>
  );
};

export default ProgressStepper;
