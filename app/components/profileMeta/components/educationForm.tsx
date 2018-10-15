import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
const styles = require("./form.scss");

interface EducationFormProps {}

interface EducationFormState {
  institution: string;
  department: string;
  degree: string;
  timePeriod: string; // yyyy-MM
}

@withStyles<typeof EducationForm>(styles)
class EducationForm extends React.PureComponent<EducationFormProps, EducationFormState> {
  public constructor(props: EducationFormProps) {
    super(props);

    this.state = {
      institution: "",
      department: "",
      degree: "",
      timePeriod: "", // yyyy-MM
    };
  }

  public render() {
    console.log(this.state);

    return (
      <div>
        <div className={styles.formControl}>
          <label>Institution</label>
          <ScinapseInput placeholder="" />
        </div>
        <div className={styles.formControl}>
          <label>Department</label>
          <ScinapseInput placeholder="" />
        </div>
        <div className={styles.formControl}>
          <label>Degree</label>
          <ScinapseInput placeholder="" />
        </div>
        <div className={styles.formControl}>
          <label>Time Period</label>
          <ScinapseInput placeholder="" />
        </div>
      </div>
    );
  }
}

export default EducationForm;
