import _        from 'lodash';
import React    from 'react';
import PropTypes from 'prop-types';
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
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateImportType: PropTypes.func,
  hideModal: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  canvasList: PropTypes.shape({}).isRequired,
};
