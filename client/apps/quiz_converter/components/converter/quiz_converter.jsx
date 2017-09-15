import React              from 'react';
import { connect }        from 'react-redux';

import FileUploadButton   from './file_upload_button';
import UploadButton       from './upload_button';
import ErrorMessage       from './error_message';
import { importQuiz }     from '../../actions/quiz_converter';

const select = state => ({
  lmsCourseId: state.settings.lms_course_id,
  conversionInProgress: state.inProgress,
  error: state.error,
});

export class QuizConverter extends React.Component {
  static propTypes = {
    lmsCourseId: React.PropTypes.string.isRequired,
    importQuiz: React.PropTypes.func.isRequired,
    conversionInProgress: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      quizText: 'CHOOSE A QUIZ',
      answerText: 'CHOOSE AN ANSWER KEY',
      quizFile: null,
      answerFile: null,
    };
  }

  doSubmit(e) {
    e.preventDefault();
    this.props.importQuiz(
      this.props.lmsCourseId,
      this.state.quizFile,
      this.state.answerFile,
    );
  }

  selectQuiz(file) {
    this.setState({
      quizFile: file,
      quizText: file.name,
    });
  }

  selectAnswerKey(file) {
    this.setState({
      answerFile: file,
      answerText: file.name,
    });
  }

  canSubmit() {
    return !!(this.state.quizFile &&
      this.state.answerFile &&
      !this.props.conversionInProgress);
  }

  render() {
    return (
      <div className="c-contain">
        <h1 className="c-title">Quiz Upload</h1>
        <form onSubmit={(e) => { this.doSubmit(e); }}>
          <FileUploadButton
            htmlId="quiz"
            text={this.state.quizText}
            selectFile={(file) => { this.selectQuiz(file); }}
          />
          <div className="c-and">--- AND ---</div>
          <FileUploadButton
            htmlId="key"
            text={this.state.answerText}
            selectFile={(file) => { this.selectAnswerKey(file); }}
          />
          <ErrorMessage error={this.props.error} />
          <UploadButton
            isConverting={this.props.conversionInProgress}
            canSubmit={this.canSubmit()}
          />
        </form>
      </div>
    );
  }
}

export default connect(select, { importQuiz })(QuizConverter);
