import React, { useRef, useState } from "react";
import { Tooltip } from "reactstrap";
import questionIcon from "../../../assets/images/icons/question.svg";

const FormInfoTooltip = (props) => {
  const { placement = "right", tooltipText = "" } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const refrence = useRef(null);
  return (
    <>
      <span ref={refrence} className="form-info-tooltip">
        <img src={questionIcon} alt="question" />
      </span>
      <Tooltip
        placement={placement}
        isOpen={tooltipOpen}
        target={refrence}
        toggle={toggle}
      >
        {tooltipText}
      </Tooltip>
    </>
  );
};

export default FormInfoTooltip;
