import * as React from "react";
import * as store from "store";
import * as Cookies from "js-cookie";
import { escapeRegExp } from "lodash";
import HighLightedContent from "../highLightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./abstract.scss");
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { benefitSignUpTest, BENEFIT_EXPERIMENT_KEY, BenefitExp } from "../../../constants/abTest";
import { DEVICE_ID_KEY } from "../../../constants/actionTicket";
import { checkAuth, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";

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

  public handelExtendContent = () => {
    const { pageType, actionArea, paperId, currentPage } = this.props;
    const { isExtendContent } = this.state;

    const currentDeviceId = store.get(DEVICE_ID_KEY);
    if (!isExtendContent && currentPage === 1 && Cookies.get(benefitSignUpTest.name) === "getFromFirstResultPage") {
      const exp: BenefitExp | undefined = store.get(BENEFIT_EXPERIMENT_KEY);
      if (!exp || exp.id !== currentDeviceId) {
        store.set(BENEFIT_EXPERIMENT_KEY, {
          id: currentDeviceId,
          count: 1,
        } as BenefitExp);
      } else {
        const nextCount = exp.count + 1;
        store.set(BENEFIT_EXPERIMENT_KEY, {
          id: currentDeviceId,
          count: nextCount,
        } as BenefitExp);
        if (nextCount > 3) {
          store.set(BENEFIT_EXPERIMENT_KEY, {
            id: currentDeviceId,
            count: 2,
          } as BenefitExp);

          const isVerified = checkAuth({ authLevel: AUTH_LEVEL.VERIFIED, userActionType: "paperShow", actionArea });
          if (!isVerified) return;
        }
      }
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
