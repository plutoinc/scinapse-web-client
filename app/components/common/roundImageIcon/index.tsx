import * as React from "react";
const styles = require("./roundImage.scss");

export interface IRoundImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  width: number | string;
  height: number | string;
}

const RoundImage = ({ width, height }: IRoundImageProps) => {
  return (
    <div className={styles.imgWrapper}>
      <img
        style={{
          width,
          height,
        }}
        className={styles.roundImage}
      />
    </div>
  );
};

export default RoundImage;
