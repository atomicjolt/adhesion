import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dropdown from 'react-accessible-dropdown';

export default function sections(props) {

  const sectionList = [{ value: -1, label: 'All Sections' }];
  _.forEach(props.sections, (section) => {
    const node = { value: section.id, label: section.name };
    sectionList.push(node);
  });
  const options = _.remove(sectionList, section =>
    section.value !== props.currentSection
  );

  return (
    <div className="c-btn c-btn--sections">
      <Dropdown
        onChange={props.filterStudents}
        options={options}
        value={sectionList[0].label}
      />
    </div>
  );
}

sections.propTypes = {
  filterStudents: PropTypes.func.isRequired,
  currentSection: PropTypes.number.isRequired,
  sections: PropTypes.array,
};
