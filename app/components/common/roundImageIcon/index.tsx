import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./roundImage.scss");

export interface RoundImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  width: number | string;
  height: number | string;
}

const RoundImage = ({ width, height }: RoundImageProps) => {
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

export default withStyles<typeof RoundImage>(styles)(RoundImage);
