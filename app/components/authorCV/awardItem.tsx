import * as React from "react";
import { Award } from "../../model/profile";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import AwardForm, { AwardFormState } from "./awardForm";
import { Dispatch, connect } from "react-redux";
import { updateAuthorCvInfo } from "../../actions/author";
import PlutoAxios from "../../api/pluto";
import alertToast from "../../helpers/makePlutoToastAction";
import { AppState } from "../../reducers";
const styles = require("./authorCVItem.scss");

interface AwardItemState {
  isEditMode: boolean;
}

interface AwardItemProps {
  authorId: number;
  award: Award;
  handleRemoveItem: (cvInfoId: string) => void;
  dispatch: Dispatch<any>;
}

@withStyles<typeof AwardItem>(styles)
class AwardItem extends React.PureComponent<AwardItemProps, AwardItemState> {
  public constructor(props: AwardItemProps) {
    super(props);

    this.state = {
      isEditMode: false,
    };
  }

  public render() {
    const { award, handleRemoveItem } = this.props;
    const { isEditMode } = this.state;
    const { id, title, received_date } = award;
    return isEditMode ? (
      <AwardForm
        handleClose={() => {
          this.handelToggleAwardEditForm;
        }}
        isOpen={isEditMode}
        handleSubmitForm={this.handelUpdateAward}
        isLoading={false}
        initialValues={{
          id,
          title,
          received_date,
        }}
      />
    ) : (
      <div className={styles.itemWrapper}>
        <div className={styles.dateSectionWrapper}>
          <span className={styles.dateContent}>{received_date}</span>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.hoverButtonWrapper}>
            <span onClick={this.handelToggleAwardEditForm}>
              <Icon className={styles.hoverButton} icon="PEN" />
            </span>

            <span
              onClick={() => {
                handleRemoveItem(id);
              }}
            >
              <Icon className={styles.hoverButton} icon="X_BUTTON" />
            </span>
          </div>
          <span className={styles.awardTitleContent}>{title}</span>
        </div>
      </div>
    );
  }

  private handelToggleAwardEditForm = () => {
    const { isEditMode } = this.state;

    this.setState({ isEditMode: !isEditMode });
  };

  private handelUpdateAward = async (params: AwardFormState) => {
    const { dispatch, authorId } = this.props;
    console.log(params);
    try {
      params.id && (await dispatch(updateAuthorCvInfo("awards", authorId, params)));
      this.handelToggleAwardEditForm();
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to add award data.",
      });
    }
  };
}

function mapStateToProps(_state: AppState) {
  return {};
}

export default connect(mapStateToProps)(AwardItem);
