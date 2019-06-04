import * as React from 'react';
import * as classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { formulaeToHTMLStr } from '../../../helpers/displayFormula';
import actionTicketManager from '../../../helpers/actionTicketManager';
import { ActionCreators } from '../../../actions/actionTypes';
const styles = require('./title.scss');

interface TitleProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  paperId: number;
  paperTitle: string;
  highlightTitle?: string;
  highlightAbstract?: string;
  source: string;
  titleClassName?: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

class NewTabTitle extends React.PureComponent<TitleProps> {
  public render() {
    const { paperTitle, highlightTitle, paperId, titleClassName } = this.props;
    const finalTitle = highlightTitle || paperTitle;

    if (!finalTitle) {
      return null;
    }

    const trimmedTitle = finalTitle
      .replace(/^ /gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/#[A-Z0-9]+#/g, '');

    return (
      <div>
        <a
          href={`/papers/${paperId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            this.handleClickTitle();
          }}
          dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(trimmedTitle) }}
          className={classNames({
            [styles.title]: !titleClassName,
            [titleClassName!]: !!titleClassName,
          })}
        />
      </div>
    );
  }

  private handleClickTitle = () => {
    const { dispatch, pageType, actionArea, paperId, highlightTitle, highlightAbstract } = this.props;
    actionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea: actionArea || pageType,
      actionTag: 'paperShow',
      actionLabel: String(paperId),
    });

    if (highlightTitle || highlightAbstract) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: highlightTitle || '',
          abstract: highlightAbstract || '',
        })
      );
    }
  };
}

export default connect()(withRouter(withStyles<typeof NewTabTitle>(styles)(NewTabTitle)));
