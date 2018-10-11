import * as React from "react";
import Axios from "axios";
// import { trackEvent } from "../../helpers/handleGA";
import { Paper } from "../../model/paper";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./tweetList.scss");

interface TweetListProps {
  paper: Paper;
}

interface TweetListStates {
  isLoading: boolean;
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

interface TweetResult {
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

interface Result {
  data: {
    title: TweetResult[];
    firstAuthor: TweetResult[];
    journal: TweetResult[];
  };
}

const TWITTER_SERVICE_URL = "https://29eszwfeci.execute-api.us-east-1.amazonaws.com/prod/getFeed";

@withStyles<typeof TweetList>(styles)
class TweetList extends React.PureComponent<TweetListProps, TweetListStates> {
  public constructor(props: TweetListProps) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  public componentDidMount() {
    this.fetchTweets();
  }

  public render() {
    return (
      <div className={styles.tweetListWrapper}>
        <div className={styles.header}>Recent 30 days Tweets related with this paper</div>
        <div className={styles.contentWrapper} />
      </div>
    );
  }

  private fetchTweets = async () => {
    const { paper } = this.props;

    const res = await Axios.get(TWITTER_SERVICE_URL, {
      params: {
        t: paper.title,
        a: paper.authors[0].name,
        j: paper.journal ? paper.journal.fullTitle : paper.venue || "",
      },
    });

    const tweets: Result = res.data.data;

    console.log(tweets.data);
  };
}

export default TweetList;
