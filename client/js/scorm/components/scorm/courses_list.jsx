import _        from 'lodash';
import React    from 'react';
import Courses  from './course';

export default function courseList(props) {
  return (
    <div>
      <ul className="c-list">
        {
          _.map(props.list, (item, key) => (
            <Courses
              key={`${key}_PackageItem`}
              course={item}
              canvasUrl={props.canvasUrl}
              courseId={props.courseId}
              removePackage={props.removePackage}
              previewPackage={props.previewPackage}
              replacePackage={props.replacePackage}
              importPackage={props.importPackage}
              updateImportType={props.updateImportType}
            />
          ))
        }
      </ul>
    </div>
  );
}

courseList.propTypes = {
  list: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
  updateImportType: React.PropTypes.func,
};
