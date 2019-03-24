import React from "react";
import { shallow } from "enzyme";
import { PastRecordingsPage } from "../../../pages/PastRecordingsPage/PastRecordingsPage";

describe("PastRecordingsPage render", () => {
  it("Should render PastRecordingsPage component without crashing", () => {
    shallow(<PastRecordingsPage />);
  });

  it("Should match PastRecordingsPage component snapshot", () => {
    const wrapper = shallow(<PastRecordingsPage />);
    expect(wrapper).toMatchSnapshot();
  });
});