import React from 'react';
import { PaperImportResType } from '../../../../api/profile';

const ImportResultShow: React.FC<{ importResult: PaperImportResType | null }> = ({ importResult }) => {
  if (!importResult) return null;
  return <div>{importResult.totalImportedCount}</div>;
};

export default ImportResultShow;
