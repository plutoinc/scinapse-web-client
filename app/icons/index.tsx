import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: string;
  onClick?: (param: any) => void;
}

export const ICONS: { [key: string]: any } = {
  CITATION: require('./citation.svg'),
  EMAIL: require('./email.svg'),
  EMAIL_VERIFICATION_COMPLETE: require('./email-verification-complete.svg'),
  EMAIL_VERIFICATION_FAIL: require('./email-verification-fail.svg'),
  EMAIL_VERIFICATION_NEEDED: require('./email-verification-needed.svg'),
  GOOGLE_LOGO: require('./google.svg'),
  FACEBOOK_LOGO: require('./facebook.svg'),
  ORCID_LOGO: require('./orcid.svg'),
  TWITTER_LOGO: require('./twitter-logo.svg'),
  FULL_NAME_ICON: require('./author-filled.svg'),
  SCINAPSE_LOGO: require('./scinapse-logo.svg'),
  SCINAPSE_LOGO_SMALL: require('./scinapse-logo-small.svg'),
  PASSWORD: require('./password.svg'),
  SEARCH: require('./search.svg'),
  VERIFICATION_EMAIL_ICON: require('./verification-email-icon.svg'),
  ELLIPSIS: require('./ellipsis.svg'),
  PLUS: require('./plus.svg'),
  MINUS: require('./minus.svg'),
  ARROW_UP: require('./arrow-up.svg'),
  ARROW_DOWN: require('./arrow-down.svg'),
  ARROW_LEFT: require('./arrow-left.svg'),
  ARROW_RIGHT: require('./arrow-right.svg'),
  ARROW_RIGHT_DOUBLE: require('./arrow-right-double.svg'),
  BOOKMARK: require('./bookmark.svg'),
  EXTERNAL_SOURCE: require('./external-source.svg'),
  DOWNLOAD: require('./download.svg'),
  X_BUTTON: require('./x-button.svg'),
  JOURNAL: require('./journal.svg'),
  AUTHOR: require('./author.svg'),
  COPY: require('./copy.svg'),
  COLLECTION: require('./collection.svg'),
  UFO: require('./ufo.svg'),
  PEN: require('./pen-only.svg'),
  TRASH_CAN: require('./trash-can.svg'),
  COLLECITON_LIST: require('./list.svg'),
  AUTHOR_MORE_ICON: require('./author-more-item.svg'),
  COPY_DOI: require('./copy.svg'),
  CHECK: require('./check.svg'),
  ADD_NOTE: require('./add-note.svg'),
  NOTED: require('./noted.svg'),
  OCCUPIED: require('./occupied.svg'),
  CAMERA: require('./camera.svg'),
  DEFAULT_PROFILE_IMAGE: require('./defaultProfileImage.svg'),
  NO_AUTHOR_RESULT: require('./no-author-result.svg'),
  NO_PAPER_RESULT: require('./no-result-paper.svg'),
  COMPLETE: require('./complete.svg'),
  IMPACT_FACTOR: require('./impact-factor.svg'),
  HISTORY: require('./history.svg'),
  SEND: require('./send.svg'),
  NEW_TAB: require('./new-tab.svg'),
  PDF_PAPER: require('./pdf-paper.svg'),
  BACK: require('./back.svg'),
  MATCHED_PAPER: require('./matched-paper.svg'),
  RELOAD: require('./reload.svg'),
  SCINAPSE_HOME_LOGO: require('./scinapse-home-logo.svg'),
  SCINAPSE_IMPROVEMENT_LOGO: require('./scinapse-improvement-logo.svg'),
  SOURCE: require('./source.svg'),
  SHARE: require('./share.svg'),
  BADGE: require('./badge.svg'),
  FEEDBACK: require('./feedback.svg'),
  ERROR: require('./error.svg'),
  ALERT: require('./alert.svg'),
  ALERT_LINE: require('./alert-line.svg'),
};

const Icon: React.FC<IconProps> = ({ className, icon, onClick, style }) => {
  const symbol = ICONS[icon];

  if (!symbol) {
    return null;
  }

  if (typeof symbol === 'string' /* INFO: this is needed for jest-test */) {
    return <i className={className}>{icon}</i>;
  }

  const svg = `<svg viewBox="${symbol.viewBox}"><use xlink:href="#${symbol.id}" /></svg>`;
  return <i onClick={onClick} style={style} className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Icon;
