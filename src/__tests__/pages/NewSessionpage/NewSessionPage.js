import React from "react";
import { shallow } from "enzyme";
import { NewSessionPage } from "../../../pages/NewSessionPage/NewSessionPage";

describe("NewSessionPage render", () => {
  it("Should render NewSessionPage component without crashing", () => {
    shallow(<NewSessionPage />);
  });

  it("Should match NewSessionPage component snapshot", () => {
    const wrapper = shallow(<NewSessionPage />);
    expect(wrapper).toMatchSnapshot();
  });
});