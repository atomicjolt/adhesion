import React          from 'react';
import history        from '../../../history';

export default function Finish() {
  return (
    <div className="c-contain finish">
      <h1 className="c-title">Upload Complete!</h1>
      <h1 className="c-title">To view the quiz click the quizzes option in the menu to the left.</h1>
      <button
        onClick={() => history.push('/')}
        className="c-button"
      >
        <span>Upload Another Quiz</span>
      </button>
    </div>
  );
}
