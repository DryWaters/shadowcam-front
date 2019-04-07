import React from "react";
import { shallow } from "enzyme";
import { Button, Modal } from "reactstrap";
import RestModal from "../../../components/RestModal/RestModal";

describe("RestModal render", () => {
  it("Should render RestModal component without crashing", () => {
    shallow(<RestModal />);
  });

  it("Should match RestModal component snapshot", () => {
    const wrapper = shallow(<RestModal />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("RestModal toggle triggered", () => {
  it("Should call the stop prop function on click", () => {
    let spy = jest.fn();
    const wrapper = shallow(<RestModal stopRest={spy} />);
    wrapper.find(Button).simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("RestModal should be displayed as soon as started", () => {
  it("Should be displayed as soon as it is open", () => {
    const wrapper = shallow(<RestModal />);
    expect(wrapper.find(Modal).prop("isOpen")).toBe(true);
  });
});
