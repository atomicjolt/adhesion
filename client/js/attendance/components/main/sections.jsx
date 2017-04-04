import React    from 'react';
import _        from 'lodash';
import Dropdown from 'react-accessible-dropdown';

export default function sections(props) {

  let sectionList = [{ value: -1, label: 'All Sections' }];
  _.forEach(props.sections, (section) => {
    const node = { value: section.id, label: section.name };
    sectionList = _.concat(sectionList, node);
  });
  const options = _.remove(sectionList, section =>
    section.value !== props.currentSection
  );

  return (
    <button className="c-btn c-btn--sections">
      <Dropdown
        onChange={props.filterStudents}
        options={options}
        value={sectionList[0].label}
      />
    </button>
  );
}

sections.propTypes = {
  filterStudents: React.PropTypes.func.isRequired,
  currentSection: React.PropTypes.number.isRequired,
  sections: React.PropTypes.array,
};
