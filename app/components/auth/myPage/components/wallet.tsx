import * as React from "react";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./wallet.scss");

export interface IAbstractProps {
  walletAddress: string;
  tokenBalance: number;
  transactions?: { id: number; name: string }[];
}

function copyWalletAddress(walletAddress: string) {
  const textField = document.createElement("textarea");
  textField.innerText = walletAddress;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
  alertToast({
    type: "success",
    message: "Copied!",
  });
}

const Abstract = (props: IAbstractProps) => {
  return (
    <div>
      <div className={styles.walletInformationTitle}>Wallet Information</div>
      <div className={styles.walletInformation}>
        <Icon className={styles.bitmapIconWrapper} icon="ADDRESS_QR_CODE" />
        <div className={styles.addressAndBalance}>
          <div className={styles.walletAddressTitle}>wallet address</div>
          <div className={styles.walletAddressContent}>{props.walletAddress}</div>
          <div className={styles.tokenBalanceTitle}>token Balance</div>
          <div className={styles.tokenBalanceContent}>{`${props.tokenBalance} PLT`}</div>
        </div>
        <div
          className={styles.copyBtn}
          onClick={() => {
            copyWalletAddress(props.walletAddress);
          }}
        >
          Copy
        </div>
      </div>
    </div>
  );
};

export default Abstract;
