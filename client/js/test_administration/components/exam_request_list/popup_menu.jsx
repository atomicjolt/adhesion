import React             from 'react';
import _                 from 'lodash';
import hashHistory       from '../../../history';
import HoverButton       from '../common/hover_button';
import Defines           from '../../defines';

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
    borderBottom: `1px solid ${Defines.lightGrey}`,
  };

  const hoveredStyle = {
    backgroundColor: Defines.lightBackground,
  };

  const disabled = props.studentHasExamStarted ? {
    cursor: 'not-allowed',
    color: Defines.lightGrey,
    backgroundColor: 'white',
    outline: 'none'
  } : {};

  let enterAnswerButton;
  let actionButton;
  if (_.includes(['scheduled', 'paused', 'requested', 'entering answers'], props.status)) {
    enterAnswerButton = (
      <HoverButton
        style={buttonStyle}
        hoveredStyle={hoveredStyle}
        onClick={props.openExamModal}
      >
        Enter Answers
      </HoverButton>
    );
  }
  if (_.includes(['scheduled', 'paused', 'requested'], props.status)) {
    actionButton = (
      <div style={divStyle}>
        <HoverButton
          style={{ ...buttonStyle, ...disabled }}
          hoveredStyle={{ ...hoveredStyle, ...disabled }}
          onClick={props.studentHasExamStarted ? () => {} : props.startExam}
        >
          Start
        </HoverButton>
      </div>
    );
  } else if (props.status !== 'finished') {
    actionButton = (
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={props.finishExam}
        >
            Finish
          </HoverButton>
      </div>
    );
  }
  return (
    <div style={{ ...popupStyle, ...props.style }}>
      {actionButton}
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
        {enterAnswerButton}
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={() => props.openMessageModal()}
        >
          Message Student
        </HoverButton>
      </div>
    </div>
  );
}

popupMenu.propTypes = {
  style: React.PropTypes.shape({}),
  status: React.PropTypes.string.isRequired,
  openMessageModal: React.PropTypes.func.isRequired,
  startExam: React.PropTypes.func.isRequired,
  finishExam: React.PropTypes.func.isRequired,
  openExamModal: React.PropTypes.func.isRequired,
  studentHasExamStarted: React.PropTypes.bool.isRequired
};
