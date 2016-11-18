import React                    from 'react';
import CommonSvg                from '../common/common_svg';

export default function assignmentButton(props) {
  return(
    <a className="c-icon-btn" href={`https://${props.canvasUrl}/courses/${props.courseId}/assignments/${props.lms_assignment_id}`} target="_parent">
      <CommonSvg type="gradedAssignment" />
    </a>
  );
};
