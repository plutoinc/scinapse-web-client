import React from 'react';
import ImprovedFooter from './improvedFooter';
import Footer from './footer';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { HOME_IMPROVEMENT_TEST } from '../../constants/abTestGlobalValue';

const ScinapseFooter: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  const [showImprovedFooter, setShowImprovedFooter] = React.useState(false);
  let backgroundColor = '';

  React.useEffect(() => {
    setShowImprovedFooter(getUserGroupName(HOME_IMPROVEMENT_TEST) === 'improvement');
  }, []);

  switch (style.backgroundColor) {
    case 'white':
      backgroundColor = showImprovedFooter ? '#f9f9fa' : style.backgroundColor;
      break;
    case '#f9f9fa':
      backgroundColor = showImprovedFooter ? 'white' : style.backgroundColor;
      break;
  }

  const footerStyle = {
    ...style,
    backgroundColor,
  };

  return showImprovedFooter ? <ImprovedFooter containerStyle={footerStyle} /> : <Footer containerStyle={footerStyle} />;
};

export default ScinapseFooter;
