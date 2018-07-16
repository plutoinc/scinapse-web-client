import * as React from "react";
import { escapeRegExp } from "lodash";
import SearchQueryHighlightedContent from "../../common/searchQueryHighlightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./abstract.scss");

const MAX_LENGTH_OF_ABSTRACT = 400;

export interface AbstractProps {
  abstract: string;
  searchQueryText?: string;
}

@withStyles<typeof Abstract>(styles)
class Abstract extends React.PureComponent<AbstractProps, {}> {
  public render() {
    const { abstract, searchQueryText } = this.props;

    if (!abstract) {
      return null;
    }

    const cleanAbstract = abstract
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    let finalAbstract;
    if (cleanAbstract.length > MAX_LENGTH_OF_ABSTRACT) {
      finalAbstract = cleanAbstract.slice(0, MAX_LENGTH_OF_ABSTRACT) + "...";
    } else {
      finalAbstract = cleanAbstract;
    }

    const searchQuery = searchQueryText ? escapeRegExp(searchQueryText) : null;

    return (
      <SearchQueryHighlightedContent
        content={finalAbstract}
        searchQueryText={searchQuery}
        className={styles.abstract}
      />
    );
  }
}

export default Abstract;
