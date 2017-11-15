const faqContent = [
  {
    question: "On what criteria is the evaluation done??",
    answer:
      "Articles are evaluated on a scale of 10 points for each of four criteria(Originality, Significance, Validity, Organization).",
  },
  {
    question: "How is total evaluation score calculated?",
    answer:
      "The total score of the article is the weighted average of the reviewers' reputation score for each evaluation score.",
  },
  {
    question: "How can I sign up?",
    answer: "Anyone can sign up by email. Please enter your institution e-mail address.",
  },
  {
    question: "How is reputation score calculated?",
    answer:
      "The reputation score is calculated by the number of articles published(+10), the number of reviews (+5) and the total number of upvote received for each reviews(+1). This simple reputation model is implemented only for the PoC prototype.",
  },
  {
    question: "Is PoC prototype implemented in the ethereum main-net?",
    answer: "Currently, our prototype is implemented in test-net with issues such as stability and gas fee.",
  },
  {
    question: "Which features are implemented in PoC prototype?",
    answer:
      "The PoC product is not a full product that we will actually serve, but a prototype that implements the key features of PLUTO.  Anyone can read and upload articles in our PoC prototype and see reviews of them. Moreover, all users can review and share opinions on shared articles. Users can earn reputation score as a reward for active platform activity, and they can also view other user's' reputation scores. When a user sign up, a wallet that can hold PLT tokens will be automatically created.",
  },
  {
    question: "What articles can I post?",
    answer:
      "Cryptocurrency and blockchain related research articles, whitepapers, and technical blogs can be shared and evaluated in our PoC prototype.",
  },
  {
    question: "Can I share articles that I have not written?",
    answer:
      "Sure. You can share any article relevant to cryptocurrency and blockchain if there is not any issue with copyright.",
  },
  {
    question: "Why are some evaluation scores displayed in blue?",
    answer: "If the article has been reviewed by more than four people, the evaluation score is displayed in blue.",
  },
  ,
];

export default faqContent;
