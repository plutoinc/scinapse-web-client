import * as React from "react";
const styles = require("./roundImage.scss");

export interface IRoundImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  width: number | string;
  height: number | string;
}

const RoundImage = (props: IRoundImageProps) => {
  return (
    <div className={styles.imgWrapper}>
      <img
        style={{
          width: props.width,
          height: props.height,
        }}
        className={styles.roundImage}
      />
    </div>
  );
};

export default RoundImage;
