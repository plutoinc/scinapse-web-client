import * as React from "react";
// components
import AnswerSection from "./components/answerSection";
import BottomSection from "./components/bottomSection";
import TopSection from "./components/topSection/index";

const FAQContainer = () => {
  return (
    <section>
      <TopSection />
      <AnswerSection />
      <BottomSection />
    </section>
  );
};

export default FAQContainer;
