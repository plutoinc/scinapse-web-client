import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, changeLocale, getMessages, addLocaleDataSet } from "./actions";
import { IAppState } from "../../reducers";

export function localeFinder() {
  let locale = navigator.languages ? navigator.languages[0] : navigator.language || (navigator as any).userLanguage;
  locale = locale.split("-")[0];
  if (!SUPPORTED_LANGUAGES.includes(locale)) {
    locale = DEFAULT_LANGUAGE;
  }
  return locale;
}

export interface IConnectedIntlProviderProps {
  dispatch: Dispatch<any>;
  locale: string;
  messages: Object;
}

class ConnectedIntlProvider extends React.PureComponent<IConnectedIntlProviderProps, {}> {
  public constructor(props: IConnectedIntlProviderProps) {
    super(props);

    addLocaleDataSet();
  }

  public componentWillMount() {
    const { dispatch } = this.props;

    const currentLocale = localeFinder();
    const currentMessage = getMessages(currentLocale);

    dispatch(changeLocale(currentLocale, currentMessage));
  }

  public shouldComponentUpdate(nextProps: IConnectedIntlProviderProps) {
    return this.props.locale !== nextProps.locale;
  }

  public render() {
    const { locale, messages, children } = this.props;

    return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    );
  }
}

function mapStateToProps(appState: IAppState) {
  return { locale: appState.locale.lang, messages: appState.locale.messages };
}

export default connect(mapStateToProps)(ConnectedIntlProvider);
