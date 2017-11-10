import * as React from "react";
import Icon from "../../../icons";
const Blockies = require("react-blockies").default;
const styles = require("./userProfileIcon.scss");

export type userImageType = "small" | "middle";

interface ITooltipParams {
  profileImage: string;
  userId: number;
  type: userImageType;
}

const UserProfileIcon = ({ profileImage, userId, type }: ITooltipParams) => {
  let width: number, height: number;
  switch (type) {
    case "small":
      width = 34.5;
      height = 34.5;
      break;
    case "middle":
      width = 87;
      height = 87;
      break;

    default:
      break;
  }
  if (profileImage !== null && profileImage !== "") {
    return (
      <img
        className={styles.avatarIconWrapper}
        src={profileImage}
        style={{
          backgroundSize: width,
          width,
          height,
        }}
      />
    );
  } else if (userId === null) {
    return (
      <div
        className={styles.avatarIconWrapper}
        style={{
          width,
          height,
        }}
      >
        <Icon icon="AVATAR" />
      </div>
    );
  } else {
    return (
      <div
        className={styles.blockContainer}
        style={{
          width,
          height,
        }}
      >
        <Blockies seed={`${userId * 3333}`} size={10} scale={8} />
      </div>
    );
  }
};

export default UserProfileIcon;
