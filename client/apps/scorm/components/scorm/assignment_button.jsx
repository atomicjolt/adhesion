import React        from 'react';
import PropTypes from 'prop-types';
import HoverButton  from '../common/hover_button';
import Defines      from '../../../../libs/defines';
import CommonSvg    from '../../../../libs/components/common_svg';

export default function assignmentButton(props) {

  const hoveredStyle = {
    backgroundColor: Defines.lightBackground,
  };

  const buttonStyle = {
    padding: '20px',
    width: '100%',
    backgroundColor: 'white',
    border: 'none',
    fontSize: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    verticalAlign: 'middle',
  };

  return (
    <a href={`https://${props.canvasUrl}/courses/${props.courseId}/assignments/${props.lms_assignment_id}`} target="_parent">
      <HoverButton
        style={buttonStyle}
        hoveredStyle={hoveredStyle}
      >
        <CommonSvg className="c-icon" type="gradedAssignment" />
        Go to Assignment
      </HoverButton>
    </a>
  );
}

assignmentButton.propTypes = {
  canvasUrl: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  lms_assignment_id: PropTypes.number.isRequired,
};
