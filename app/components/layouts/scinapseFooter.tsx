import * as React from 'react';
import ImprovedFooter from './improvedFooter';
import Footer from './footer';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { HOME_IMPROVEMENT_TEST } from '../../constants/abTestGlobalValue';

const ScinapseFooter: React.FC<{ backgroundColor: string }> = ({ backgroundColor }) => {
  const [showImprovedFooter, setShowImprovedFooter] = React.useState(false);
  let footerBackgroundColor = '';

  React.useEffect(() => {
    setShowImprovedFooter(getUserGroupName(HOME_IMPROVEMENT_TEST) === 'improvement');
  }, []);

  switch (backgroundColor) {
    case 'white':
      footerBackgroundColor = showImprovedFooter ? '#f9f9fa' : backgroundColor;
      break;
    case '#f9f9fa':
      footerBackgroundColor = showImprovedFooter ? 'white' : backgroundColor;
      break;
  }

  const footerStyle: React.CSSProperties = { backgroundColor: footerBackgroundColor };

  return showImprovedFooter ? <ImprovedFooter containerStyle={footerStyle} /> : <Footer containerStyle={footerStyle} />;
};

export default ScinapseFooter;
