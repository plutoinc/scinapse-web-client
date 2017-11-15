import * as React from "react";
// components
import AnswerItem from "./answerItem";
import faqContent from "./faqContent";
// styles
const styles = require("./answerSection.scss");

interface IAnswerSectionProps {}
interface IAnswerSectionStates {
  selected: number;
}

class AnswerSection extends React.PureComponent<IAnswerSectionProps, IAnswerSectionStates> {
  public constructor(props: IAnswerSectionProps) {
    super(props);

    this.state = {
      selected: 0,
    };
  }

  private selectAnswerItem = (idx: number) => {
    this.setState({ selected: idx });
  };

  public render() {
    return (
      <section className={styles.answerSectionContainer}>
        <div className={styles.innerContainer}>
          {faqContent.map((item, idx) => {
            return (
              <AnswerItem
                key={idx.toString()}
                index={idx}
                isOpen={idx === this.state.selected}
                question={item.question}
                answer={item.answer}
                selectAnswerItem={this.selectAnswerItem}
              />
            );
          })}
        </div>
      </section>
    );
  }
}

export default AnswerSection;
