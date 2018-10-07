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

    let tweets: any[] = [];
    const res = await Axios.get(TWITTER_SERVICE_URL, {
      params: {
        q: paper.title,
      },
    });

    tweets = res.data.data;

    if (tweets.length === 0) {
      const result = await Axios.get(TWITTER_SERVICE_URL, {
        params: {
          q: paper.authors[0].name,
        },
      });

      tweets = result.data.data;
    }

    console.log(tweets);
  };
}

export default TweetList;
