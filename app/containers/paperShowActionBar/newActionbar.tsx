import * as React from "react";
import PdfSourceButton from "../../components/paperShow/components/pdfSourceButton";
import { Paper } from "../../model/paper";
const s = require("./actionBar.scss");

interface PaperShowActionBarProps {
  paper: Paper | null;
}

const PaperShowActionBar: React.FunctionComponent<PaperShowActionBarProps> = props => {
  if (!props.paper) return null;

  return (
    <div className={s.actionBar}>
      <div className={s.actionItem}>
        <PdfSourceButton paper={props.paper} reverseColor />
      </div>
      <div>request txt btn</div>
      <div>cite btn</div>
    </div>
  );
};

export default PaperShowActionBar;
