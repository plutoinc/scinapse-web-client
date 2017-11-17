import * as React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../icons";
import { trackAction } from "../../../helpers/handleGA";

const styles = require("./wallet.scss");

const Wallet = (userId: number) => (
  <div className={styles.walletContainer}>
    <div className={styles.innerContainer}>
      <Icon className={styles.walletIconWrapper} icon="WALLET_ONBORDING_IMG" />
      <div className={styles.title}>Congratulations on being a Pluto member!</div>
      <div className={styles.content}>
        We have been issuing wallets for our economic activities in<br />
        Pluto. From now on, you will be able to reward Pluto<br />
        Tokens through platform activities.
      </div>
      <Link
        to={`/users/${userId}/wallet`}
        onClick={() => trackAction(`/users/${userId}/wallet`, "WalletGoToWalletPage")}
        className={styles.walletLinkBtn}
      >
        Go to wallet page
      </Link>
      <Link to="/" onClick={() => trackAction("/", "WalletGoToHomePage")} className={styles.homeLinkBtn}>
        Go to home page
      </Link>
    </div>
  </div>
);

export default Wallet;
