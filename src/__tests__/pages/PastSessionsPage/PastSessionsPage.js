import React from "react";
import { shallow } from "enzyme";
import { PastSessionPage } from "../../../pages/PastSessionPage/PastSessionPage";

describe("PastSessionPage render", () => {
  it("Should render PastSessionPage component without crashing", () => {
    shallow(<PastSessionPage />);
  });

  it("Should match PastSessionPage component snapshot", () => {
    const wrapper = shallow(<PastSessionPage />);
    expect(wrapper).toMatchSnapshot();
  });
});