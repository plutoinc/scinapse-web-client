import React, { FC } from 'react';
import { CURRENT_ONBOARDING_PROGRESS_STEP } from '../../types';
import UploadPublicationList from '../uploadPublicationList';
import MatchUnsyncedPublications from '../matchUnsyncedPublications';
import SelectRepresentativePublications from '../selectRepresentativePublications';
import OnboardingResult from '../onboardingResult';
import { isStepFinal } from '../../helper';

interface OnboardingBodyProps {
  activeStep: CURRENT_ONBOARDING_PROGRESS_STEP;
  profileSlug: string;
}

const OnboardingBody: FC<OnboardingBodyProps> = ({ activeStep, profileSlug }) => {
  if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.UPLOAD_PUB_LIST)
    return <UploadPublicationList profileSlug={profileSlug} />;

  if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.MATCH_UNSYNCED_PUBS) return <MatchUnsyncedPublications />;

  if (activeStep === CURRENT_ONBOARDING_PROGRESS_STEP.SELECT_REPRESENTATIVE_PUBS)
    return <SelectRepresentativePublications profileSlug={profileSlug} />;

  if (isStepFinal(activeStep)) return <OnboardingResult />;

  return <div />;
};

export default OnboardingBody;
