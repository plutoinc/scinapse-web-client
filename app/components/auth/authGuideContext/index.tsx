import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./authGuideContext.scss");

interface AuthGuideContextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

const GuideContent: React.FunctionComponent<{ mainText: string; image: string; subText: string }> = React.memo(
  props => {
    const { mainText, image, subText } = props;

    return (
      <>
        <div className={styles.mainText}>{mainText}</div>
        <div className={styles.subText}>{subText}</div>
        <img className={styles.guideImage} src={image} alt="general-scinapse" />
      </>
    );
  }
);

const GuideContentsByActionType: React.FunctionComponent<AuthGuideContextProps> = React.memo(props => {
  const { userActionType } = props;

  switch (userActionType) {
    case "downloadPdf":
      return <div />;
    case "citePaper":
      return <div />;
    case "viewMorePDF":
      return <div />;
    case "query":
      return <div />;
    case "paperShow":
      return <div />;
    default:
      return (
        <GuideContent mainText={"Scinapse Love Researchers"} subText={""} image={"https://i.imgur.com/HYqea1H.png"} />
      );
  }
});

const AuthGuideContext: React.FunctionComponent<AuthGuideContextProps> = props => {
  const { userActionType } = props;
  return (
    <div className={styles.container}>
      <Icon icon="SCINAPSE_LOGO" className={styles.logoIcon} />
      <GuideContentsByActionType userActionType={userActionType} />
    </div>
  );
};
export default withStyles<typeof AuthGuideContext>(styles)(AuthGuideContext);
