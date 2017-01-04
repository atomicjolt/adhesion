import React            from 'react';
import _                from 'lodash';
import { hashHistory }  from 'react-router';
import HoverButton      from '../common/hover_button';
import Defines          from '../../defines';

export default function popupMenu(props) {
  const popupStyle = {
    width: '200px',
    boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
    backgroundColor: 'white',
  };

  const buttonStyle = {
    padding: '20px',
    width: '100%',
    backgroundColor: 'white',
    border: 'none',
    fontSize: 'inherit',
    textAlign: 'left',
    cursor: 'pointer'
  };

  const divStyle = {
    borderBottom: `1px solid ${Defines.lightGrey}`
  };

  const hoveredStyle = {
    backgroundColor: Defines.lightBackground,
  };

  let actionButtons;
  if (_.includes(['assigned', 'paused'], props.status)) {
    actionButtons = (
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
        >
          Start
        </HoverButton>
      </div>
    );
  } else {
    actionButtons = [
      <div style={divStyle}>
        <HoverButton style={buttonStyle} hoveredStyle={hoveredStyle}>Pause</HoverButton>
      </div>,
      <div style={divStyle}>
        <HoverButton style={buttonStyle} hoveredStyle={hoveredStyle}>Terminate</HoverButton>
      </div>
    ];
  }
  return (
    <div style={{ ...popupStyle, ...props.style }}>
      {actionButtons}
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={() => hashHistory.push(`/print?courseId=${props.courseId}&quizId=${props.examId}`)}
        >
          Print Test
        </HoverButton>
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
        >
          Enter Answers
        </HoverButton>
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
        >
          Message Instructor
        </HoverButton>
      </div>
    </div>
  );
}

popupMenu.propTypes = {
  style: React.PropTypes.shape({}),
  status: React.PropTypes.string.isRequired,
  courseId: React.PropTypes.string.isRequired,
  examId: React.PropTypes.string.isRequired,
};
