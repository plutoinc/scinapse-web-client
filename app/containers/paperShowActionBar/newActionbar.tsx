import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import FullTextDialog from "./components/fullTextDialog";
import CiteBox from "./components/citeBox";
import { Paper } from "../../model/paper";
import Icon from "../../icons";
const s = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
}

const PaperShowActionBar: React.FunctionComponent<PaperShowActionBarProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!props.paper) return null;

  return (
    <div className={s.actionBar}>
      <div className={s.actionItem}>
        <PdfSourceButton paper={props.paper} reverseColor />
      </div>
      <div className={s.actionItem}>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className={s.fullTextBtn}
        >
          <Icon icon="SEND" className={s.sendIcon} />
          Request Full-text
        </button>
      </div>
      <div className={s.actionItem}>
        <CiteBox paper={props.paper} />
      </div>

      <FullTextDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar);
