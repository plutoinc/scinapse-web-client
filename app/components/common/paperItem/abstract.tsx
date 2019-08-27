import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { formulaeToHTMLStr } from '../../../helpers/displayFormula';
const styles = require('./abstract.scss');

const MAX_LENGTH_OF_ABSTRACT = 500;

export interface AbstractProps {
  paperId: number;
  abstract: string;
  pageType: Scinapse.ActionTicket.PageType;
  maxLength?: number;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface AbstractStates extends Readonly<{}> {
  isExtendContent: boolean;
}

function createLatexParsedMarkup(rawHTML: string) {
  return { __html: formulaeToHTMLStr(rawHTML) };
}

@withStyles<typeof Abstract>(styles)
class Abstract extends React.PureComponent<AbstractProps, AbstractStates> {
  public constructor(props: AbstractProps) {
    super(props);
    this.state = {
      isExtendContent: false,
    };
  }

  public render() {
    const { abstract, maxLength } = this.props;
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
          <label className={styles.moreOrLess} onClick={this.handelExtendContent}>
            {this.state.isExtendContent ? <span>less</span> : <span>more</span>}
          </label>
        ) : null}
      </div>
    );
  }

  public handelExtendContent = async () => {
    const { pageType, actionArea, paperId } = this.props;
    const { isExtendContent } = this.state;

    this.setState({ isExtendContent: !isExtendContent });

    ActionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea: actionArea || pageType,
      actionTag: isExtendContent ? 'collapseAbstract' : 'extendAbstract',
      actionLabel: String(paperId),
    });
  };
}

export default Abstract;
