import * as React from "react";
import axios from "axios";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./plutoBlogPosting.scss");

const BLOG_SCRIBER_API_HOST = "https://7hnqfzk1r6.execute-api.us-east-1.amazonaws.com/prod/blogLinks";

interface BlogLink {
  id: string;
  link: string;
  active: boolean;
  startTime?: Date[];
  endTime?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
  ogImageUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

interface PlutoBlogPostingState {
  isLoading: boolean;
  blogLink: string;
  blogLinks: BlogLink[];
}

class PlutoBlogPosting extends React.PureComponent<{}, PlutoBlogPostingState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      isLoading: false,
      blogLink: "",
      blogLinks: [],
    };
  }

  public async componentDidMount() {
    this.handleClickReload();
  }
  public render() {
    const { blogLinks } = this.state;
    if (!blogLinks || blogLinks.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * blogLinks.length);

    const BlogList = blogLinks[randomIndex];

    return (
      <div className={styles.plutoBlogPosting}>
        <div className={styles.sideNavigationBlockHeader}>
          <img src="http://assets.pluto.network/scinapse/pluto-logo.png" className={styles.plutoLogo} /> Pluto's Story
        </div>
        <img src={BlogList.ogImageUrl} alt={BlogList.ogTitle} className={styles.postingImg} />
        <a href={BlogList.link} className={styles.postingTitle} target="_blank">
          {BlogList.ogTitle}
        </a>
        <div className={styles.postingDescription}>{BlogList.ogDescription}</div>
      </div>
    );
  }

  private handleClickReload = async () => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const res = await axios.get(BLOG_SCRIBER_API_HOST);
      this.setState({ blogLinks: res.data.blogList, isLoading: false });
    } catch (err) {
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };
}

export default withStyles<typeof PlutoBlogPosting>(styles)(PlutoBlogPosting);
