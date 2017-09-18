jest.unmock("../roundImage");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import RoundImage, { IRoundImageProps } from "../roundImage";

describe("<RoundImage /> Component", () => {
  let roundImageWrapper: ShallowWrapper<IRoundImageProps>;
  const mockWidth = 50;
  const mockHeight = 50;

  beforeEach(() => {
    roundImageWrapper = shallow(<RoundImage width={mockWidth} height={mockHeight} />);
  });

  it("should match snapshot", () => {
    expect(roundImageWrapper.html()).toMatchSnapshot();
  });
});
