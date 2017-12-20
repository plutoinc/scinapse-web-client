import * as React from "react";
// import { trackAndOpenLink } from "../../../../helpers/handleGA";
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
      {props.journal ? (
        <a
          // onClick={() => {
          //   trackAndOpenLink("https://medium.com/pluto-network", "searchItemJournal");
          // }}
          className={styles.underline}
        >
          {props.journal}
        </a>
      ) : null}
      {/* <span className={styles.bold}>[IF: 5.84]</span> */}
      {props.journal ? <div className={styles.separatorLine} /> : null}
      {props.year ? <span className={styles.bold}>{props.year}</span> : null}
      {props.year ? <div className={styles.separatorLine} /> : null}
      <Authors authors={props.authors} />
    </div>
  );
};

export default PublishInfoList;
