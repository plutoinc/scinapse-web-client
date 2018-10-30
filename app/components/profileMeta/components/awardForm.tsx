import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import ScinapseButton from "../../common/scinapseButton";
import { Profile, Education, Experience, Award } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/makePlutoToastAction";
import { ProfileMetaEnum } from "..";
import { validateDateString, validateLength } from "../helpers/validateDateString";
const styles = require("./form.scss");

interface AwardFormProps {
  toggleAwardFormBox: () => void;
  handleAddMetaItem: (profileMetaType: ProfileMetaEnum, meta: Education | Experience | Award) => void;
  profile: Profile;
}

interface AwardFormField {
  title: string;
  timePeriodYear: string;
  timePeriodMonth: string;
}

interface AwardFormState extends AwardFormField {
  isLoading: boolean;
}

const awardInitialState: AwardFormState = {
  title: "",
  timePeriodYear: "",
  timePeriodMonth: "",
  isLoading: false,
};

const formInputStyle: React.CSSProperties = {
  paddingRight: "8px",
  width: "400px",
  backgroundColor: "#fff",
};

const yearInputFormStyle: React.CSSProperties = {
  paddingRight: "8px",
  width: "72px",
  backgroundColor: "#fff",
  textAlign: "center",
  marginRight: "8px",
};

@withStyles<typeof AwardForm>(styles)
class AwardForm extends React.PureComponent<AwardFormProps, AwardFormState> {
  public constructor(props: AwardFormProps) {
    super(props);

    this.state = awardInitialState;
  }

  public render() {
    const { title, timePeriodMonth, timePeriodYear, isLoading } = this.state;

    return (
      <div className={styles.formContainer}>
        <div className={styles.formControl}>
          <label>Title</label>
          <ScinapseInput
            onChange={e => {
              this.handleChangeInput(e, "title");
            }}
            value={title}
            placeholder=""
            inputStyle={formInputStyle}
          />
        </div>
        <div className={styles.formControl}>
          <label>Received Date</label>
          <ScinapseInput
            value={timePeriodYear}
            onChange={e => {
              this.handleChangeInput(e, "timePeriodYear");
            }}
            placeholder="YYYY"
            inputStyle={yearInputFormStyle}
          />
          <span className={styles.periodText}>-</span>
          <ScinapseInput
            value={timePeriodMonth}
            placeholder="MM"
            inputStyle={yearInputFormStyle}
            onChange={e => {
              this.handleChangeInput(e, "timePeriodMonth");
            }}
          />
        </div>
        {/* TODO: Change below GA category as trackable one. */}
        <div className={styles.buttonWrapper}>
          <div className={styles.formButton}>
            <ScinapseButton
              style={{
                color: "#1e2a35",
                opacity: 0.25,
                width: "64px",
                height: "32px",
              }}
              gaCategory="ProfileMetaSetup"
              content="Cancel"
              onClick={this.handleToggleBox}
            />
          </div>
          <div className={styles.formButton}>
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? "#9aa3b5" : "#48d2a0",
                cursor: isLoading ? "not-allowed" : "pointer",
                width: "64px",
                height: "32px",
              }}
              gaCategory="ProfileMetaSetup"
              content="Save"
              onClick={this.handleClickSaveButton}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleClickSaveButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { profile, handleAddMetaItem, toggleAwardFormBox } = this.props;
    const { title, timePeriodMonth, timePeriodYear } = this.state;
    e.preventDefault();

    try {
      validateLength({ value: title, maxLength: 200, fieldName: "Title" });
      validateDateString(timePeriodYear, "year");
      validateDateString(timePeriodMonth, "month");

      this.setState(prevState => ({ ...prevState, isLoading: true }));

      const res = await ProfileAPI.postAward({
        profileId: profile.id,
        title,
        receivedDate: `${timePeriodYear}-${timePeriodMonth}`,
      });

      handleAddMetaItem(ProfileMetaEnum.AWARD, res.data.content);
      toggleAwardFormBox();
      this.setState(_prevState => awardInitialState);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);

      alertToast({
        type: "error",
        message: error.message,
      });

      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleToggleBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { toggleAwardFormBox } = this.props;
    e.preventDefault();
    toggleAwardFormBox();
  };

  private handleChangeInput = (e: React.FormEvent<HTMLInputElement>, target: keyof AwardFormField) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, [`${target}`]: newValue }));
  };
}

export default AwardForm;
