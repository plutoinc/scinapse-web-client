import * as React from "react";
import Icon from "../../../icons";

export enum ScinapseButtonType {
  buttonWithArrow,
}

interface ButtonWithArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  isUpArrow: boolean;
  text: string;
  arrowIconClassName: string;
  textWrapperClassName: string;
  linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  hasArrow: boolean;
  dropdownBtnProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  leftIconNode?: React.ReactNode;
}

const ButtonWithArrow: React.SFC<ButtonWithArrowProps> = ({
  isUpArrow,
  text,
  arrowIconClassName,
  leftIconNode,
  textWrapperClassName,
  onClick,
  linkProps,
  dropdownBtnProps,
  hasArrow,
  ...wrapperProps
}) => {
  const linkStyle = {
    display: "flex",
    height: "100%",
    alignItems: "center",
    ...linkProps.style,
  };

  return (
    <div {...wrapperProps}>
      <a {...linkProps} style={linkStyle}>
        {leftIconNode}
        <span className={textWrapperClassName}>{text}</span>
      </a>
      {hasArrow && (
        <button {...dropdownBtnProps}>
          <span
            style={{
              width: "27px",
              borderLeft: "1px solid #dde0e7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              style={{
                transform: isUpArrow ? "rotate(180deg)" : "",
              }}
              icon="ARROW_POINT_TO_UP"
              className={arrowIconClassName}
            />
          </span>
        </button>
      )}
    </div>
  );
};

const ScinapseButtonFactory = (type: ScinapseButtonType) => {
  switch (type) {
    case ScinapseButtonType.buttonWithArrow: {
      return ButtonWithArrow;
    }

    default:
      throw new Error("Invalid type for Scinapse Button Factory");
  }
};

export default ScinapseButtonFactory;
