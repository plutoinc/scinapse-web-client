import React, { FC, useMemo } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step, { StepProps } from '@material-ui/core/Step';
import StepLabel, { StepLabelProps } from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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

  const theme = createMuiTheme({
    overrides: {
      MuiStepIcon: {
        root: {
          '&$completed': {
            color: '#81acff',
          },
          '&$active': {
            color: '#3e7fff',
          },
        },
        active: {},
        completed: {},
      },
      MuiStepLabel: {
        label: {
          '&$completed': {
            color: '#9aa3b5',
          },
          '&$active': {
            color: 'rgba(30, 42, 53, 0.8)',
          },
        },
      },
    },
  });

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
      <MuiThemeProvider theme={theme}>
        <Stepper activeStep={activeStep}>{stepList}</Stepper>
      </MuiThemeProvider>
    </div>
  );
};

export default ProgressStepper;
