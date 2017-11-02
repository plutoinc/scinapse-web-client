import * as React from "react";
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
      <div
        className={styles.avatarIconWrapper}
        style={{
          backgroundImage: `url(
            ${profileImage}
              )`,
          backgroundSize: width,
          width,
          height,
        }}
      />
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
        <Blockies seed={`${userId * 1000}`} size={10} scale={8} />
      </div>
    );
  }
};

export default UserProfileIcon;
