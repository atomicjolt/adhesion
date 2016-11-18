"use strict";

import React from 'react';
import CommonSvg from './common_svg';

export default (props) => {
  return (
    <button className={props.className || "c-icon-btn"} onClick={props.handleClick}>
      {props.children}
      <CommonSvg type={props.type} />
    </button>
  );
};
