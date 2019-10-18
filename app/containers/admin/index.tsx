import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./admin.scss');

const DesignPage: FC = () => {
  useStyles(s);

  return (
    <div style={{ margin: '100px auto', width: '1200px' }}>
      <h2>PLUTO DESIGN SYSTEM 🚀</h2>
      <Link className={s.linkItem} to="/button-demo">
        Button Demo Page
      </Link>
      <Link className={s.linkItem} to="/ui-demo">
        Button Builder Page
      </Link>
      <Link className={s.linkItem} to="/paper-item-demo">
        Paper Item Demo Page
      </Link>
    </div>
  );
};

export default DesignPage;
