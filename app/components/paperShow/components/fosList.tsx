import * as React from "react";
import { List } from "immutable";
import PaperShowKeyword from "./keyword";
import { IFosRecord } from "../../../model/fos";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./fosList.scss");

interface PaperShowFOSListProps {
  FOSList: List<IFosRecord | undefined>;
}

class PaperShowFOSList extends React.PureComponent<PaperShowFOSListProps, {}> {
  public render() {
    const { FOSList } = this.props;

    if (!FOSList || FOSList.isEmpty()) {
      return null;
    } else {
      const FOSNodeArray = FOSList.map((fos, index) => {
        if (fos) {
          return <PaperShowKeyword fos={fos} key={`${fos.fos}_${index}}`} />;
        }
      });

      return <div className={styles.FOSBox}>{FOSNodeArray}</div>;
    }
  }
}

export default withStyles<typeof PaperShowFOSList>(styles)(PaperShowFOSList);
