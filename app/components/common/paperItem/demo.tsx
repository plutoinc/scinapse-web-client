import React from 'react';
import { useEnvHook } from '../../../hooks/useEnvHook';
import FullPaperItem from './fullPaperItem';
import { dummyPaper, paperSource, paperWithFigureAndManyAuthors } from './paperData';
import MediumPaperItem from './mediumPaperItem';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./demo.scss');

const PaperItemDemo: React.FC = () => {
  useStyles(s);
  const { isOnClient } = useEnvHook();

  if (!isOnClient) return null;

  return (
    <div className={s.container}>
      <h1 className={s.title}>Paper Item museum</h1>
      <div>
        <div>
          <h2>FULL PAPER ZONE</h2>
          <FullPaperItem paper={dummyPaper} pageType="unknown" actionArea="test" sourceDomain={paperSource} />
          <FullPaperItem paper={dummyPaper} pageType="unknown" actionArea="test" />
          <FullPaperItem
            paper={paperWithFigureAndManyAuthors}
            pageType="unknown"
            actionArea="test"
            sourceDomain={paperSource}
          />
        </div>
        <div>
          <h2>MEDIUM PAPER ZONE</h2>
          <MediumPaperItem paper={dummyPaper} pageType="unknown" actionArea="test" sourceDomain={paperSource} />
          <FullPaperItem paper={dummyPaper} pageType="unknown" actionArea="test" />
          <MediumPaperItem
            paper={paperWithFigureAndManyAuthors}
            pageType="unknown"
            actionArea="test"
            sourceDomain={paperSource}
          />
        </div>
      </div>
    </div>
  );
};

export default PaperItemDemo;
