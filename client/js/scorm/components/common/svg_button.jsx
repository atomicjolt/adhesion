"use strict";

import React from 'react';
import CommonSvg from './common_svg';

export default (props) => {
  return (
    <button className="c-icon-btn" onClick={props.handleClick}>
      <CommonSvg type={props.type} />
    </button>
  );
};
