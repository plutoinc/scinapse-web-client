import * as React from "react";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import { IAuthorsProps } from "./authors";

import Authors from "./authors";

const styles = require("./publishInfoList.scss");

export interface IPublishInfoListProps extends IAuthorsProps {
  journal: string;
  year: number;
}

const PublishInfoList = (props: IPublishInfoListProps) => {
  return (
    <div className={styles.publishInfoList}>
      <a
        onClick={() => {
          trackAndOpenLink("https://medium.com/pluto-network", "searchItemJournal");
        }}
        className={styles.underline}
      >
        {props.journal}
      </a>
      {/* <span className={styles.bold}>[IF: 5.84]</span> */}
      <div className={styles.separatorLine} />
      <span className={styles.bold}>{props.year}</span>
      <div className={styles.separatorLine} />
      <Authors authors={props.authors} />
    </div>
  );
};

export default PublishInfoList;
