import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";

const styles = require("./wallet.scss");

const Wallet = (userId: string) => (
  <div className={styles.walletContainer}>
    <div className={styles.innerContainer}>
      <Icon className={styles.walletIconWrapper} icon="WALLET_ONBORDING_IMG" />
      <div className={styles.title}>Congratulations on being a Pluto member!</div>
      <div className={styles.content}>
        We have been issuing wallets for our economic activities in<br />
        Pluto. From now on, you will be able to reward Pluto<br />
        Tokens through platform activities.
      </div>
      <Link className={styles.walletLinkBtn} to={`/users/${userId}/wallet`}>
        Go to wallet page
      </Link>
      <Link className={styles.homeLinkBtn} to="/">
        I want to home
      </Link>
    </div>
  </div>
);

export default Wallet;
