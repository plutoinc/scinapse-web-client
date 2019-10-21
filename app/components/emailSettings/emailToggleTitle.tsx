import React from 'react';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./emailToggleTitle.scss');

interface EmailToggleTitleProps {
  title: string;
  subtitle: string;
}

const EmailToggleTitle: React.FC<EmailToggleTitleProps> = ({ title, subtitle }) => {
  useStyles(s);

  return (
    <div className={s.toggleItemContext}>
      <div className={s.toggleItemTitle}>{title}</div>
      <div className={s.toggleItemSubtitle}>{subtitle}</div>
    </div>
  );
};

export default EmailToggleTitle;
