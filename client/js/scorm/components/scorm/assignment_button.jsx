import React     from 'react';
import SVGButton from '../../../common_components/svg_button';

export default function assignmentButton(props) {
  return (
    <a href={`https://${props.canvasUrl}/courses/${props.courseId}/assignments/${props.lms_assignment_id}`} target="_parent">
      <SVGButton type="gradedAssignment" />
    </a>
  );
}

assignmentButton.propTypes = {
  canvasUrl: React.PropTypes.string.isRequired,
  courseId: React.PropTypes.string.isRequired,
  lms_assignment_id: React.PropTypes.number.isRequired,
};
