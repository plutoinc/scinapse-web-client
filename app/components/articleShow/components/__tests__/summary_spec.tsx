jest.unmock("../summary");

import * as React from "react";
import { ShallowWrapper } from "enzyme";
import EvaluateSummary, { IEvaluateSummaryProps } from "../summary";
import { RECORD } from "../../../../__mocks__";
import { shallowWithMuiThemeContext } from "../../../../__tests__/enzymeHelper";

// TODO: Remove skip when material-ui's getMuiTheme feature is fixed. it's broken now
describe.skip("<EvaluateSummary /> component", () => {
  let articleInfoWrapper: ShallowWrapper<IEvaluateSummaryProps>;

  beforeEach(() => {
    articleInfoWrapper = shallowWithMuiThemeContext(<EvaluateSummary article={RECORD.ARTICLE} />);
  });

  it("should match snapshot", () => {
    expect(articleInfoWrapper.html()).toMatchSnapshot();
  });
});
