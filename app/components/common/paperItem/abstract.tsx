import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { formulaeToHTMLStr } from '../../../helpers/displayFormula';
const styles = require('./abstract.scss');

const MAX_LENGTH_OF_ABSTRACT = 500;

export interface AbstractProps {
  paperId: number;
  abstract: string;
  maxLength?: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

export interface AbstractStates extends Readonly<{}> {
  isExtendContent: boolean;
}

function createLatexParsedMarkup(rawHTML: string) {
  return { __html: formulaeToHTMLStr(rawHTML) };
}

const Abstract: React.FC<AbstractProps> = ({ abstract, maxLength, pageType, actionArea, paperId }) => {
  const [isExtendContent, setIsExtendContent] = React.useState(false);
  const abstractMaxLength = maxLength || MAX_LENGTH_OF_ABSTRACT;

  if (!abstract) {
    return null;
  }

  const cleanAbstract = abstract
    .replace(/^ /gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/#[A-Z0-9]+#/g, '')
    .replace(/\n|\r/g, ' ');

  let finalAbstract;
  if (cleanAbstract.length > abstractMaxLength) {
    finalAbstract = cleanAbstract.slice(0, abstractMaxLength) + '...';
  } else {
    finalAbstract = cleanAbstract;
  }

  return (
    <div className={styles.abstract}>
      <span dangerouslySetInnerHTML={createLatexParsedMarkup(finalAbstract)} />
      {finalAbstract.length > abstractMaxLength ? (
        <label
          className={styles.moreOrLess}
          onClick={() => {
            setIsExtendContent(!isExtendContent);
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: isExtendContent ? 'collapseAbstract' : 'extendAbstract',
              actionLabel: String(paperId),
            });
          }}
        >
          {isExtendContent ? <span>less</span> : <span>more</span>}
        </label>
      ) : null}
    </div>
  );
};

export default withStyles<typeof Abstract>(styles)(Abstract);
