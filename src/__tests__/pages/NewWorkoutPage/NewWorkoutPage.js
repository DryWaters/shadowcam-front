import React from "react";
import { shallow } from "enzyme";
import { Input } from "reactstrap";
import { NewWorkoutPage } from "../../../pages/NewWorkoutPage/NewWorkoutPage";

describe("NewWorkoutPage render", () => {
  it("Should render NewWorkoutPage component without crashing", () => {
    shallow(<NewWorkoutPage />);
  });

  it("Should match NewWorkoutPage component snapshot", () => {
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("NewWorkoutPage Input Testing", () => {
  it("Should update rest time in minutes with valid input change", () => {
    const event = { target: { id: "restTimeMin", value: 2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update rest time in seconds with valid input change", () => {
    const event = { target: { id: "restTimeSec", value: 58 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update interval time in minutes with valid input change", () => {
    const event = { target: { id: "intervalTimeMin", value: 10 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update interval time in seconds with valid input change", () => {
    const event = { target: { id: "intervalTimeSec", value: 50 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(3)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update number of intervals with valid input change", () => {
    const event = { target: { id: "numberInterval", value: 2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(1);
    wrapper
      .find(Input)
      .at(4)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should not update rest time in minutes with invalid input change", () => {
    const event = { target: { id: "restTimeMin", value: -25 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update rest time in seconds with invalid input change", () => {
    const event = { target: { id: "restTimeSec", value: -10 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update interval time in minutes with invalid input change", () => {
    const event = { target: { id: "intervalTimeMin", value: -1 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update interval time in seconds with invalid input change", () => {
    const event = { target: { id: "intervalTimeSec", value: 80 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(3)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update number of intervals with invalid input change", () => {
    const event = { target: { id: "numberInterval", value: -2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(1);
    wrapper
      .find(Input)
      .at(4)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(1);
  });
});

describe("Should return the correct total time", () => {
  it("Should have 0 total time at start", () => {
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state("totalTime")).toEqual(0);
  });

  it("Should display correct total time on update", async () => {
    const event = { target: { id: "intervalTimeMin", value: 5 } };
    const wrapper = shallow(<NewWorkoutPage />);

    await wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);

    expect(wrapper.state("totalTime")).toEqual(300);
  });
});
