import * as React from 'react';
import * as classNames from 'classnames';
import { escapeRegExp } from 'lodash';
import HighLightedContent from '../highLightedContent';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./abstract.scss');

const MAX_LENGTH_OF_ABSTRACT = 500;

export interface AbstractProps {
  paperId: number;
  abstract: string;
  searchQueryText?: string;
  pageType: Scinapse.ActionTicket.PageType;
  className?: string;
  maxLength?: number;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface AbstractStates extends Readonly<{}> {
  isExtendContent: boolean;
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
    const { abstract, searchQueryText, maxLength, className } = this.props;
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

    const searchQuery = searchQueryText ? escapeRegExp(searchQueryText) : null;

    return (
      <HighLightedContent
        handelExtendContent={this.handelExtendContent}
        isExtendContent={this.state.isExtendContent}
        originContent={abstract}
        content={finalAbstract}
        highLightContent={searchQuery}
        className={classNames({
          [styles.abstract]: !className,
          [className!]: !!className,
        })}
        maxCharLimit={abstractMaxLength}
      />
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
