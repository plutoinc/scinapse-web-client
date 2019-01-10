import * as React from "react";
import * as format from "date-fns/format";
import { Dispatch, connect } from "react-redux";
import Icon from "../../icons";
import PlutoAxios from "../../api/pluto";
import { updateAuthorCvInfo } from "../../actions/author";
import { AppState } from "../../reducers";
import { Award } from "../../model/profile";
import AwardForm, { AwardFormState } from "./awardForm";
import alertToast from "../../helpers/makePlutoToastAction";
import { withStyles } from "../../helpers/withStylesHelper";
import { getFormattingDate, getMonthOptionItems } from "../../containers/authorCvSection";
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
        monthItems={getMonthOptionItems()}
        handleClose={this.handelToggleAwardEditForm}
        isOpen={isEditMode}
        handleSubmitForm={this.handelUpdateAward}
        isLoading={false}
        initialValues={{
          id,
          title,
          received_date,
          received_date_year: received_date.split("-")[0],
          received_date_month: received_date.split("-")[1],
        }}
      />
    ) : (
      <div className={styles.itemWrapper}>
        <div className={styles.dateSectionWrapper}>
          <span className={styles.dateContent}>{format(received_date, "MMM YYYY")}</span>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.hoverButtonWrapper}>
            <span className={styles.hoverEditButton} onClick={this.handelToggleAwardEditForm}>
              <Icon icon="PEN" />
            </span>

            <span
              className={styles.hoverDeleteButton}
              onClick={() => {
                handleRemoveItem(id);
              }}
            >
              <Icon icon="X_BUTTON" />
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

    params.received_date = getFormattingDate(params.received_date_year, params.received_date_month);

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
