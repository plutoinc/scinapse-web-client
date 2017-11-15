import * as React from "react";
// styles
const styles = require("./answerItem.scss");

interface IAnswerItemProps {
  isOpen: boolean;
  selectAnswerItem: (idx: number) => void;
  index: number;
  question: string;
  answer: string;
}

const AnswerItem = ({ isOpen, selectAnswerItem, index, question, answer }: IAnswerItemProps) => {
  return (
    <div className={`${styles.answerItem} ${isOpen ? styles.open : ""}`}>
      <div className={styles.itemContainer}>
        <div className={styles.itemTitle} onClick={() => selectAnswerItem(index)}>
          {question}
        </div>
        <div className={styles.itemContent}>{answer}</div>
      </div>
    </div>
  );
};

export default AnswerItem;
