import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseInput from "../../common/scinapseInput";
import ScinapseButton from "../../common/scinapseButton";
import { Profile } from "../../../model/profile";
import ProfileAPI from "../../../api/profile";
import PlutoAxios from "../../../api/pluto";
import alertToast from "../../../helpers/makePlutoToastAction";
const styles = require("./form.scss");

interface AwardFormProps {
  toggleAwardFormBox: () => void;
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

@withStyles<typeof AwardForm>(styles)
class AwardForm extends React.PureComponent<AwardFormProps, AwardFormState> {
  public constructor(props: AwardFormProps) {
    super(props);

    this.state = awardInitialState;
  }

  public render() {
    const { title, timePeriodMonth, timePeriodYear, isLoading } = this.state;

    return (
      <div>
        <div className={styles.formControl}>
          <label>Title</label>
          <ScinapseInput
            onChange={e => {
              this.handleChangeInput(e, "title");
            }}
            value={title}
            placeholder=""
          />
        </div>
        <div className={styles.formControl}>
          <label>Received Date</label>
          <ScinapseInput
            value={timePeriodYear}
            onChange={e => {
              this.handleChangeInput(e, "timePeriodYear");
            }}
            placeholder="2018"
          />
          <ScinapseInput
            value={timePeriodMonth}
            placeholder="10"
            onChange={e => {
              this.handleChangeInput(e, "timePeriodMonth");
            }}
          />
        </div>
        {/* TODO: Change below GA category as trackable one. */}
        <ScinapseButton
          style={{ color: "#1e2a35", opacity: 0.25 }}
          gaCategory="ProfileMetaSetup"
          content="Cancel"
          onClick={this.handleToggleBox}
        />
        <ScinapseButton
          style={{ backgroundColor: isLoading ? "#9aa3b5" : "#48d2a0", cursor: isLoading ? "not-allowed" : "pointer" }}
          gaCategory="ProfileMetaSetup"
          content="Save"
          onClick={this.handleClickSaveButton}
          disabled={isLoading}
        />
      </div>
    );
  }

  private handleClickSaveButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { profile } = this.props;
    const { title, timePeriodMonth, timePeriodYear } = this.state;

    e.preventDefault();

    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));

      await ProfileAPI.postAward({
        profileId: profile.id,
        title,
        receivedDate: `${timePeriodYear}-${timePeriodMonth}`,
      });

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
