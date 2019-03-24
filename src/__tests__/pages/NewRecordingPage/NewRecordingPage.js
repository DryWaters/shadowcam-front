import React from "react";
import { shallow } from "enzyme";
import { NewRecordingPage } from "../../../pages/NewRecordingPage/NewRecordingPage";

describe("NewRecordingPage render", () => {
  it("Should render NewRecordingPage component without crashing", () => {
    shallow(<NewRecordingPage />);
  });

  it("Should match NewRecordingPage component snapshot", () => {
    const wrapper = shallow(<NewRecordingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});