import * as React from "react";
import { IAuthor } from "../../../model/author";
import Icon from "../../../icons";
import { List } from "immutable";
import { ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE, AUTHOR_NAME_TYPE, AUTHOR_INSTITUTION_TYPE } from "../records";

const styles = require("./authorInput.scss");

interface IAuthorInputProps {
  authors: List<IAuthor>;
  authorInputErrorIndex: number | null;
  authorInputErrorType: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE | null;
  plusAuthorFunc: () => void;
  minusAuthorFunc: () => void;
  handleChangeAuthorName: (index: number, name: string) => void;
  checkValidAuthorName: (index: number, name: string) => void;
  handleChangeAuthorInstitution: (index: number, institution: string) => void;
  checkValidAuthorInstitution: (index: number, name: string) => void;
  validateFunc: () => void;
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
        return (
          <div key={"authorInput_" + index} className={styles.authorInputLine}>
            <div className={styles.authorIndex}>{index + 1}</div>
            <div
              className={
                props.authorInputErrorIndex === index && props.authorInputErrorType === AUTHOR_NAME_TYPE ? (
                  `${styles.fullNameInputWrapper} ${styles.hasError}`
                ) : (
                  styles.fullNameInputWrapper
                )
              }
            >
              <input
                onChange={e => {
                  const authorName: string = e.currentTarget.value;

                  props.handleChangeAuthorName(index, authorName);
                  props.checkValidAuthorName(index, authorName);
                  props.validateFunc();
                }}
                placeholder="Full Name"
                className={`form-control ${styles.inputBox}`}
                value={author.name}
                type="text"
              />
            </div>
            <div
              className={
                props.authorInputErrorIndex === index && props.authorInputErrorType === AUTHOR_INSTITUTION_TYPE ? (
                  `${styles.institutionInputWrapper} ${styles.hasError}`
                ) : (
                  styles.institutionInputWrapper
                )
              }
            >
              <input
                onChange={e => {
                  const authorInstitution: string = e.currentTarget.value;

                  props.handleChangeAuthorInstitution(index, authorInstitution);
                  props.checkValidAuthorInstitution(index, authorInstitution);
                  props.validateFunc();
                }}
                value={author.organization}
                placeholder="Institution (Option)"
                className={`form-control ${styles.inputBox}`}
                type="text"
              />
            </div>
            {getButtons(index, authorSize, props)}
          </div>
        );
      })}
    </div>
  );
};

export default AuthorInput;
