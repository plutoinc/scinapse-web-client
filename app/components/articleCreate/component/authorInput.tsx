import * as React from "react";
import { IAuthor } from "../../../model/author";
import Icon from "../../../icons";
import { List } from "immutable";
import { IHasErrorCheck, AUTHOR_NAME_TYPE, AUTHOR_INSTITUTION_TYPE } from "../records";
import { InputBox } from "../../common/inputBox/inputBox";

const styles = require("./authorInput.scss");

interface IAuthorInputProps {
  authors: List<IAuthor>;
  errorCheck: IHasErrorCheck;
  plusAuthorFunc: () => void;
  minusAuthorFunc: () => void;
  handleChangeAuthorName: (index: number, name: string) => void;
  checkValidAuthorName: (index: number) => void;
  handleChangeAuthorInstitution: (index: number, institution: string) => void;
  checkValidAuthorInstitution: (index: number) => void;
}

const plusAuthorBtn = (props: IAuthorInputProps) => (
  <a onClick={props.plusAuthorFunc} className={styles.authorButtonIconWrapper}>
    <Icon icon="AUTHOR_PLUS_BUTTON" />
  </a>
);

const minusAuthorBtn = (props: IAuthorInputProps) => (
  <a onClick={props.minusAuthorFunc} className={styles.authorButtonIconWrapper}>
    <Icon icon="AUTHOR_MINUS_BUTTON" />
  </a>
);

const getButtons = (index: number, authorSize: number, props: IAuthorInputProps) => {
  if (index === authorSize - 1 && index > 0) {
    return (
      <div className={styles.authorButtonContainer}>
        {plusAuthorBtn(props)}
        {minusAuthorBtn(props)}
      </div>
    );
  } else if (index === authorSize - 1) {
    return <div>{plusAuthorBtn(props)}</div>;
  }
};

const AuthorInput = (props: IAuthorInputProps) => {
  const { authors } = props;
  const authorSize = authors.size;

  return (
    <div className={styles.authorsInputContainer}>
      {authors.map((author, index) => {
        console.log(author);
        return (
          <div key={"authorInput_" + index} className={styles.authorInputLine}>
            <div className={styles.authorIndex}>{index + 1}</div>
            <InputBox
              onChangeFunc={(name: string) => {
                props.handleChangeAuthorName(index, name);
              }}
              onBlurFunc={() => {
                props.checkValidAuthorName(index);
              }}
              type="authorName"
              hasError={props.errorCheck.authors.getIn([index, AUTHOR_NAME_TYPE])}
            />
            <InputBox
              onChangeFunc={(institution: string) => {
                props.handleChangeAuthorInstitution(index, institution);
              }}
              onBlurFunc={() => {
                props.checkValidAuthorInstitution(index);
              }}
              type="authorInstitution"
              hasError={props.errorCheck.authors.getIn([index, AUTHOR_INSTITUTION_TYPE])}
            />
            {getButtons(index, authorSize, props)}
          </div>
        );
      })}
    </div>
  );
};

export default AuthorInput;
