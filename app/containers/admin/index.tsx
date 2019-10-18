import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const DesignPage: FC = () => {
  return (
    <div style={{ margin: '100px auto', width: '1200px' }}>
      <h2>PLUTO DESIGN SYSTEM 🚀</h2>
      <Link style={{ display: 'block', marginTop: '12px' }} to="/button-demo">
        Button Demo Page
      </Link>
      <Link style={{ display: 'block', marginTop: '12px' }} to="/ui-demo">
        Button Builder Page
      </Link>
      <Link style={{ display: 'block', marginTop: '12px' }} to="/paper-item-demo">
        Paper Item Builder Page
      </Link>
    </div>
  );
};

export default DesignPage;
