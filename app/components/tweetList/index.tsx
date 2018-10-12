import * as React from "react";
import Axios from "axios";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
import Icon from "../../icons";
import { trackEvent } from "../../helpers/handleGA";
const styles = require("./tweetList.scss");

interface TweetListProps {
  paper: Paper;
}

interface TweetListStates {
  isLoading: boolean;
  tweets: TweetResult[];
}

interface UserMention {
  screen_name: string;
  name: string;
  id: number;
  id_str: string;
  indices: number[];
}

interface Url {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

interface Entities {
  hashtags: any[];
  symbols: any[];
  user_mentions: UserMention[];
  urls: Url[];
}

interface Metadata {
  iso_language_code: string;
  result_type: string;
}

interface Description {
  urls: any[];
}

interface Entities2 {
  description: Description;
}

interface User {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url?: any;
  entities: Entities2;
  protected: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  created_at: string;
  favourites_count: number;
  utc_offset?: any;
  time_zone?: any;
  geo_enabled: boolean;
  verified: boolean;
  statuses_count: number;
  lang: string;
  contributors_enabled: boolean;
  is_translator: boolean;
  is_translation_enabled: boolean;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following?: any;
  follow_request_sent?: any;
  notifications?: any;
  translator_type: string;
}

interface RawTweetResult {
  created_at: string;
  id: number;
  id_str: string;
  text: string;
  truncated: boolean;
  entities: Entities;
  metadata: Metadata;
  source: string;
  in_reply_to_status_id: number;
  in_reply_to_status_id_str: string;
  in_reply_to_user_id: number;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  user: User;
  geo?: any;
  coordinates?: any;
  place?: any;
  contributors?: any;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  lang: string;
}

interface TweetResult extends RawTweetResult {
  from: TwitFromType;
}

interface Tweets {
  title: RawTweetResult[];
  firstAuthor: RawTweetResult[];
  journal: RawTweetResult[];
}
interface Result {
  data: Tweets;
}

enum TwitFromType {
  titleAndJournal,
  firstAuthorAndTitle,
  journalAndFirstAuthor,
}

const TWITTER_SERVICE_URL = "https://29eszwfeci.execute-api.us-east-1.amazonaws.com/prod/getFeed";

@withStyles<typeof TweetList>(styles)
class TweetList extends React.PureComponent<TweetListProps, TweetListStates> {
  public constructor(props: TweetListProps) {
    super(props);

    this.state = {
      isLoading: false,
      tweets: [],
    };
  }

  public componentDidMount() {
    this.fetchTweets();
  }

  public render() {
    return <div className={styles.tweetListWrapper}>{this.getTweetItems()}</div>;
  }

  private getTweetItems = () => {
    const { tweets } = this.state;

    if (tweets.length === 0) {
      return null;
    }

    return tweets.map(twit => {
      let twitFrom: string;
      if (twit.from === TwitFromType.titleAndJournal) {
        twitFrom = "ABOUT PAPER & JOURNAL";
      } else if (twit.from === TwitFromType.firstAuthorAndTitle) {
        twitFrom = "ABOUT FIRST AUTHOR & PAPER";
      } else {
        twitFrom = "ABOUT JOURNAL & FIRST AUTHOR";
      }

      return (
        <div key={twit.id} className={styles.commentItemWrapper}>
          <div className={styles.authorInformationBox}>
            <span className={styles.authorName}>{twit.user.name}</span>
            <a
              href={`https://twitter.com/${twit.user.screen_name}/status/${twit.id_str}`}
              target="_blank"
              className={styles.twitterIconWrapper}
              onClick={() => {
                this.handleClickTwitBtn(twit);
              }}
            >
              <Icon className={styles.twitterIcon} icon="TWITTER_LOGO" />
            </a>
          </div>
          <div className={styles.contentBox}>
            <span className={styles.fromText}>{`${twitFrom}: `}</span>
            <span>{twit.text}</span>
          </div>
        </div>
      );
    });
  };

  private handleClickTwitBtn = (twit: TweetResult) => {
    const { paper } = this.props;

    trackEvent({
      category: "Experiment",
      action: `ClickTwitter Item / ${TwitFromType[twit.from]}`,
      label: `/papers/${paper.id}`,
    });
  };

  private fetchTweets = async () => {
    const { paper } = this.props;

    try {
      const res = await Axios.get(TWITTER_SERVICE_URL, {
        params: {
          t: paper.title,
          a: paper.authors[0].name,
          j: paper.journal ? paper.journal.fullTitle : paper.venue || "",
        },
      });

      const rawTweets: Result = res.data.data;
      let tweets: TweetResult[] = [];

      tweets = rawTweets.data.title.map(twit => ({ ...twit, from: TwitFromType.titleAndJournal }));
      tweets = [
        ...tweets,
        ...rawTweets.data.firstAuthor.map(twit => ({ ...twit, from: TwitFromType.firstAuthorAndTitle })),
      ];
      tweets = [
        ...tweets,
        ...rawTweets.data.journal.map(twit => ({ ...twit, from: TwitFromType.journalAndFirstAuthor })),
      ];

      tweets.forEach(twit => {
        trackEvent({
          category: "Experiment",
          action: `Get Twitter Item / ${TwitFromType[twit.from]}`,
          label: `/papers/${paper.id}`,
        });
      });

      this.setState(prevState => ({ ...prevState, tweets }));
    } catch (err) {
      trackEvent({
        category: "Experiment",
        action: "Failed to get Twitter Item",
        label: `/papers/${paper.id}`,
      });
    }
  };
}

export default TweetList;
