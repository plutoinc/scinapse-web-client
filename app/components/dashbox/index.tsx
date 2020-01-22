import React, { FC, CSSProperties } from 'react';

type Props = { style?: CSSProperties };

const defaultStyle: CSSProperties = {
  padding: '8px',
  border: '2px dashed #e22319',
};

const DashBox: FC<Props> = ({ children, style }) => {
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
};

export default DashBox;
