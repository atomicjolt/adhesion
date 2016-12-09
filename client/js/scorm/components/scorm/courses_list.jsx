import React from 'react';
import Courses from './course';

export default function courseList(props) {
  let items;
  if (props.list) {
    items = props.list.map((item, key) => {
      const itemProps = {
        course: item,
        removePackage: props.removePackage,
        previewPackage: props.previewPackage,
        importPackage: props.importPackage,
        updateImportType: props.updateImportType,
      };

      return <Courses key={`${key}_PackageItem`} {...itemProps} />;
    });
  }

  return (
    <div>
      <ul className="c-list">
        {items}
      </ul>
    </div>
  );
}

courseList.propTypes = {
  list: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
  updateImportType: React.PropTypes.func,
};
