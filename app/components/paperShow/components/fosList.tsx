import * as React from "react";
import PaperShowKeyword from "./keyword";
import { Fos } from "../../../model/fos";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./fosList.scss");

interface PaperShowFOSListProps {
  FOSList?: Fos[];
}

class PaperShowFOSList extends React.PureComponent<PaperShowFOSListProps, {}> {
  public render() {
    const { FOSList } = this.props;

    if (!FOSList || FOSList.length === 0) {
      return null;
    } else {
      const FOSNodeArray = FOSList.map((fos, index) => {
        if (fos) {
          return (
            <PaperShowKeyword
              fos={fos}
              key={`${fos.fos}_${index}}`}
              pageType="paperShow"
              actionArea="paperDescription"
            />
          );
        }
      });

      return <div className={styles.FOSBox}>{FOSNodeArray}</div>;
    }
  }
}

export default withStyles<typeof PaperShowFOSList>(styles)(PaperShowFOSList);
