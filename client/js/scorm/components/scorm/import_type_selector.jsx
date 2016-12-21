import React from 'react';
import CommonSvg from '../../../common_components/common_svg';

export default function importTypeSelector(props) {
  return (
    <div className="c-list-item__type">
      <div className="c-dropdown">
        <select onChange={props.handleSelectChange}>
          <option value="NOT_SELECTED">Choose import type...</option>
          <option value="GRADED">Import as graded assignment</option>
          <option value="UNGRADED">Import as ungraded assignment</option>
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
  isGoBtnActive: React.PropTypes.bool,
  handleGoClick: React.PropTypes.func.isRequired,
  handleSelectChange: React.PropTypes.func.isRequired,
};
