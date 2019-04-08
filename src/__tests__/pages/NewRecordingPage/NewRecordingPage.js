import React from "react";
import { shallow } from "enzyme";

import { load } from "@tensorflow-models/posenet";
import { NewRecordingPage } from "../../../pages/NewRecordingPage/NewRecordingPage";

jest.mock("@tensorflow-models/posenet", () => {
  return {
    load: jest.fn(() => {})
  };
});

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

    const spy = jest.spyOn(NewRecordingPage.prototype, 'componentDidMount');
    spy.mockImplementation(() => {});
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

    const spy = jest.spyOn(NewRecordingPage.prototype, 'componentDidMount');
    spy.mockImplementation(() => {});
    const wrapper = shallow(<NewRecordingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
