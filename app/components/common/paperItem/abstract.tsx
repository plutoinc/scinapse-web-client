import * as React from "react";
import { escapeRegExp } from "lodash";
import HighLightedContent from "../highLightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./abstract.scss");
import { trackEvent } from "../../../helpers/handleGA";

export interface AbstractProps {
  abstract: string;
  searchQueryText?: string;
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
      .replace(/#[A-Z0-9]+#/g, "");

    const searchQuery = searchQueryText ? escapeRegExp(searchQueryText) : null;

    return <HighLightedContent content={cleanAbstract} searchQueryText={searchQuery} className={styles.abstract} />;
  }
  public handelExtendContent = () => {
    const { isExtendContent } = this.state;
    this.setState({ isExtendContent: !isExtendContent });
    if (isExtendContent) {
      trackEvent({
        category: "Search",
        action: "Extend Abstract",
        label: location.pathname,
      });
    } else {
      trackEvent({
        category: "Search",
        action: "collapse Abstract",
        label: location.pathname,
      });
    }
  };
}

export default Abstract;
