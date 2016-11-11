"use strict";

import React     from 'react';
import CommonSvg from '../common/common_svg';

export default (props)=>{
  return (
    <div className="c-list-item__type">
      <div className="c-dropdown">
        <select onChange={props.handleSelectChange}>
          <option value="0">Choose import type...</option>
          <option value="Graded Assignment">Import as graded assignment</option>
          <option value="Ungraded Assignment">Import as ungraded assignment</option>
        </select>
        <CommonSvg className="c-icon-drop" type="drop" />
      </div>
      <button
        className={`c-btn c-btn--go is-${props.isGoBtnActive ? "active" : "inactive"}`}
        onClick={props.handleGoClick}
      >
        Go
      </button>
    </div>
  );
};
