import * as React from "react";
import { IAuthorRecord } from "../../../model/author";
import Icon from "../../../icons";
import { List } from "immutable";
import { IArticleCreateHasErrorCheck, AUTHOR_NAME_TYPE, AUTHOR_INSTITUTION_TYPE } from "../records";
import { InputBox } from "../../common/inputBox/inputBox";

const styles = require("./authorInput.scss");

interface IAuthorInputProps {
  authors: List<IAuthorRecord>;
  errorCheck: IArticleCreateHasErrorCheck;
  plusAuthorFunc: () => void;
  minusAuthorFunc: (index: number) => void;
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

const minusAuthorBtn = (index: number, props: IAuthorInputProps) => (
  <a
    onClick={() => {
      props.minusAuthorFunc(index);
    }}
    className={styles.authorButtonIconWrapper}
  >
    <Icon icon="AUTHOR_MINUS_BUTTON" />
  </a>
);

const getButtons = (index: number, authorSize: number, props: IAuthorInputProps) => {
  if (index === authorSize - 1 && index > 0) {
    return (
      <div className={styles.authorButtonContainer}>
        {minusAuthorBtn(index, props)}
        {plusAuthorBtn(props)}
      </div>
    );
  } else if (index === authorSize - 1) {
    return <div>{plusAuthorBtn(props)}</div>;
  } else {
    return <div>{minusAuthorBtn(index, props)}</div>;
  }
};

const AuthorInput = (props: IAuthorInputProps) => {
  const { authors } = props;
  const authorSize = authors.size;
  return (
    <div className={styles.authorsInputContainer}>
      {authors.map((author, index) => {
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
              defaultValue={author.name}
              placeHolder="Full Name"
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
              defaultValue={author.institution}
              placeHolder="Institution"
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
