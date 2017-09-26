jest.unmock("../comments");

import * as React from "react";
import { List } from "immutable";
import { shallow, ShallowWrapper } from "enzyme";
import EvaluationComments, { IEvaluationCommentsProps } from "../comments";
import { RECORD } from "../../../../../__mocks__";

describe("<EvaluationComments /> component", () => {
  let commentsWrapper: ShallowWrapper<IEvaluationCommentsProps>;
  const mockComments = List([RECORD.COMMENT, RECORD.COMMENT, RECORD.COMMENT]);

  beforeEach(() => {
    commentsWrapper = shallow(<EvaluationComments comments={mockComments} />);
  });

  it("should match snapshot", () => {
    expect(commentsWrapper.html()).toMatchSnapshot();
  });
});
