import _        from 'lodash';
import React    from 'react';
import Course from './course';

export default function courseList(props) {
  return (
    <div>
      <ul className="c-list">
        {
          _.map(props.list, (item, key) => (
            <Course
              key={`${key}_PackageItem`}
              course={item}
              canvasUrl={props.canvasUrl}
              courseId={props.courseId}
              removePackage={props.removePackage}
              previewPackage={props.previewPackage}
              replacePackage={props.replacePackage}
              importPackage={props.importPackage}
              updateImportType={props.updateImportType}
              showModal={props.showModal}
              hideModal={props.hideModal}
              canvasAssignment={props.canvasList[item.lms_assignment_id]}
              publishPackage={props.publishPackage}
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
  hideModal: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired,
  canvasList: React.PropTypes.shape({}).isRequired,
};
