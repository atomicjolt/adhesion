import React from 'react';
import PropTypes from 'prop-types';
import CommonSvg from '../../../../libs/components/common_svg';

export default function importTypeSelector(props) {
  return (
    <div className="c-list-item__type">
      <div className="c-dropdown">
        <select onChange={props.handleSelectChange}>
          <option value="NOT_SELECTED">Choose import type...</option>
          <option value="GRADED">Import as graded assignment</option>
          <option value="UNGRADED">Import as ungraded assignment</option>
          <option value="pass_fail">Import as pass/fail assignment</option>
        </select>
        <CommonSvg className="c-icon-drop" type="drop" />
      </div>
      <button
        className={`c-btn c-btn--go is-${props.isGoBtnActive ? 'active' : 'inactive'}`}
        onClick={props.handleGoClick}
      >
        Go
      </button>
    </div>
  );
}

importTypeSelector.propTypes = {
  isGoBtnActive: PropTypes.bool,
  handleGoClick: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};
