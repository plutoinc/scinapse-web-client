import * as React from "react";
import axios from "axios";
import { withStyles } from "../../../helpers/withStylesHelper";
import { BlogLink } from "../../../containers/admin";
const styles = require("./plutoBlogPosting.scss");

const BLOG_SCRIBER_API_HOST = "https://7hnqfzk1r6.execute-api.us-east-1.amazonaws.com/prod/blogLinks";

interface BlogInfo extends BlogLink {}

interface PlutoBlogPostingState {
  isLoading: boolean;
  blogLink: string;
  blogLinks: BlogInfo[];
}

interface PlutoBlogPostingProps {
  paperId: number;
}

class PlutoBlogPosting extends React.PureComponent<PlutoBlogPostingProps, PlutoBlogPostingState> {
  public constructor(props: PlutoBlogPostingProps) {
    super(props);

    this.state = {
      isLoading: false,
      blogLink: "",
      blogLinks: [],
    };
  }

  public componentDidMount() {
    this.handleClickReload();
  }

  public componentWillReceiveProps(nextProps: PlutoBlogPostingProps) {
    if (this.props.paperId !== nextProps.paperId) {
      this.handleClickReload();
    }
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
          <img src="https://assets.pluto.network/scinapse/pluto-logo.png" className={styles.plutoLogo} /> Pluto's Story
        </div>
        <a href={BlogList.link} className={styles.postingTitle} target="_blank">
          <img src={BlogList.ogImageUrl} alt={BlogList.ogTitle} className={styles.postingImg} />
        </a>
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
