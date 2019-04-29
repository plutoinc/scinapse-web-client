import * as React from "react";
import { escapeRegExp } from "lodash";
import HighLightedContent from "../highLightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import { getCurrentPageType } from "../../locationListener/index";
import { PAPER_FROM_SEARCH_TEST_NAME } from "../../../constants/abTestGlobalValue";
import { getBlockedValueForPaperFromSearchTest } from "../../../helpers/abTestHelper/paperFromSearchTestHelper";
const styles = require("./abstract.scss");

const MAX_LENGTH_OF_ABSTRACT = 500;

export interface AbstractProps {
  paperId: number;
  abstract: string;
  searchQueryText?: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  currentPage?: number;
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
    const { abstract, searchQueryText } = this.props;

    if (!abstract) {
      return null;
    }

    const cleanAbstract = abstract
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "")
      .replace(/\n|\r/g, " ");

    let finalAbstract;
    if (cleanAbstract.length > MAX_LENGTH_OF_ABSTRACT) {
      finalAbstract = cleanAbstract.slice(0, MAX_LENGTH_OF_ABSTRACT) + "...";
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
        className={styles.abstract}
        maxCharLimit={MAX_LENGTH_OF_ABSTRACT}
      />
    );
  }

  public handelExtendContent = async () => {
    const { pageType, actionArea, paperId } = this.props;
    const { isExtendContent } = this.state;

    const userGroupName: string = getUserGroupName(PAPER_FROM_SEARCH_TEST_NAME) || "";
    const currentArea = getCurrentPageType();

    if (!isExtendContent && currentArea === "searchResult") {
      const isBlocked = await getBlockedValueForPaperFromSearchTest(userGroupName, "abstract");

      if (isBlocked) return;
    }

    this.setState({ isExtendContent: !isExtendContent });

    ActionTicketManager.trackTicket({
      pageType,
      actionType: "fire",
      actionArea: actionArea || pageType,
      actionTag: isExtendContent ? "collapseAbstract" : "extendAbstract",
      actionLabel: String(paperId),
    });

    trackEvent({
      category: "Search",
      action: isExtendContent ? "collapse Abstract" : "Extend Abstract",
      label: location.pathname,
    });
  };
}

export default Abstract;
