import * as React from 'react';
import * as classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
const styles = require('./authGuideContext.scss');

interface AuthGuideContextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

const GuideContent: React.FunctionComponent<{
  mainText: string;
  imageUrl: string;
  webpUrl: string;
  subText: string;
  isGeneral?: boolean;
}> = React.memo(props => {
  const { mainText, imageUrl, webpUrl, subText, isGeneral } = props;

  return (
    <>
      <div className={styles.mainText}>{mainText}</div>
      {subText && <div className={styles.subText}>{subText}</div>}
      <picture>
        <source srcSet={webpUrl} type="image/webp" />
        <source srcSet={imageUrl} type="image/jpeg" />
        <img
          className={classNames({
            [styles.generalGuideImage]: isGeneral,
            [styles.guideImage]: !isGeneral,
          })}
          src={imageUrl}
          alt={mainText}
        />
      </picture>
    </>
  );
});

const GuideContentsByActionType: React.FunctionComponent<AuthGuideContextProps> = React.memo(props => {
  const { userActionType } = props;

  switch (userActionType) {
    case 'downloadPdf':
      return (
        <GuideContent
          mainText={'Free\nPDF\nDownload'}
          subText={'from Scinapse Database'}
          imageUrl={'https://assets.pluto.network/signup_modal/signup_downloadpdf.png'}
          webpUrl={'https://assets.pluto.network/signup_modal/signup_downloadpdf.webp'}
        />
      );
    case 'viewMorePDF':
      return (
        <GuideContent
          mainText={'Enjoy\nUnlimited\nFull Text'}
          subText={'from Scinapse Database'}
          imageUrl={'https://assets.pluto.network/signup_modal/signup_viewmorepdf.png'}
          webpUrl={'https://assets.pluto.network/signup_modal/signup_viewmorepdf.webp'}
        />
      );
    case 'query':
      return (
        <GuideContent
          mainText={'Smart\nResearchers\nLove Scinapse'}
          subText={''}
          imageUrl={'https://assets.pluto.network/signup_modal/signup_query.png'}
          webpUrl={'https://assets.pluto.network/signup_modal/signup_query.webp'}
        />
      );
    case 'paperShow':
      return (
        <GuideContent
          mainText={'200 Millions\nUnlimited\nPapers'}
          subText={''}
          imageUrl={'https://assets.pluto.network/signup_modal/signup_unlimited.png'}
          webpUrl={'https://assets.pluto.network/signup_modal/signup_unlimited.webp'}
        />
      );
    case 'doiSearch':
      return (
        <GuideContent
          mainText={'Search\nPaper\nby DOI'}
          subText={''}
          imageUrl={'https://assets.pluto.network/signup_modal/signup_query.png'}
          webpUrl={'https://assets.pluto.network/signup_modal/signup_query.webp'}
        />
      );
    case 'recommendEmailBanner':
      return (
        <GuideContent
          mainText={'Get\nCurated\nPapers\nFor You'}
          subText={''}
          imageUrl={'https://assets.pluto.network/signup_modal/researchers.jpg'}
          webpUrl={'https://assets.pluto.network/signup_modal/researchers.webp'}
        />
      );
    default:
      return (
        <GuideContent
          mainText={'Scinapse\nLove\nResearchers'}
          subText={''}
          imageUrl={'https://assets.pluto.network/signup_modal/researchers.jpg'}
          webpUrl={'https://assets.pluto.network/signup_modal/researchers.webp'}
          isGeneral={true}
        />
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
