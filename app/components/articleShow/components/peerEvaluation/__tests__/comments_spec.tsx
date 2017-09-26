jest.unmock("../comments");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import EvaluationComments, { IEvaluationCommentsProps } from "../comments";
import { RECORD } from "../../../../../__mocks__";
import { CURRENT_USER_INITIAL_STATE } from "../../../../../model/currentUser";

describe("<EvaluationComments /> component", () => {
  let commentsWrapper: ShallowWrapper<IEvaluationCommentsProps>;

  beforeEach(() => {
    commentsWrapper = shallow(
      <EvaluationComments
        currentUser={CURRENT_USER_INITIAL_STATE}
        handlePeerEvaluationCommentSubmit={() => {}}
        evaluation={RECORD.EVALUATION}
      />,
    );
  });

  it("should match snapshot", () => {
    expect(commentsWrapper.html()).toMatchSnapshot();
  });
});
