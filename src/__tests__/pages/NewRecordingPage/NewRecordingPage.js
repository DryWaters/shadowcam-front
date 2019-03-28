import React from "react";
import { shallow } from "enzyme";
import { NewRecordingPage } from "../../../pages/NewRecordingPage/NewRecordingPage";

describe("NewRecordingPage render", () => {
  it("Should render NewRecordingPage component without crashing", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });
    shallow(<NewRecordingPage />);
  });

  it("Should match NewRecordingPage component snapshot", () => {
    Object.defineProperty(window.navigator, "mediaDevices", {
      value: {
        getUserMedia: () => {
          return Promise.resolve();
        }
      },
      writable: true
    });

    const wrapper = shallow(<NewRecordingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
