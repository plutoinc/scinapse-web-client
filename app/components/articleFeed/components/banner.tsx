import * as React from "react";
import { trackAndOpenLink } from "../../../helpers/handleGA";
const styles = require("./banner.scss");

const ArticleFeedBanner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.title}>PLUTO`s Proof of Concept Product is Launched now!</div>
        <div className={styles.content}>
          {`Welcome to PLUTO’s Proof-of-Concept prototype!\nCryptocurrency and blockchain related article can be shared and reviewed here.\nPlease read our user guide and join us!`}
        </div>
        <a
          onClick={() => {
            trackAndOpenLink("https://medium.com/pluto-network", "articleFeedBanner");
          }}
          className={styles.tourBtn}
        >
          Get a Tour
        </a>
      </div>
    </div>
  );
};

export default ArticleFeedBanner;
