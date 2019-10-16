import React from 'react';
import { getUserGroupName } from '../helpers/abTestHelper';
import { FULLTEXT_EXPERIMENT } from '../constants/abTestGlobalValue';
import { FullTextExperimentType } from '../constants/abTestObject';

export function useFullTextExpHook() {
  const [fullTextUserGroup, setFullTextUserGroup] = React.useState<FullTextExperimentType | null>(null);

  React.useEffect(() => {
    const userGroup = getUserGroupName(FULLTEXT_EXPERIMENT) as FullTextExperimentType;
    setFullTextUserGroup(userGroup);
  }, []);

  return fullTextUserGroup;
}
