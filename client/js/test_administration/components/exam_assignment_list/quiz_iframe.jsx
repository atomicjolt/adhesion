import React from 'react';

export default class QuizIframe extends React.Component {
  componentDidMount(){
    window.open(`https://c7dc4b62.ngrok.io/pt_login?user_id=${this.props.params.userId}&course_id=${this.props.params.courseId}&quiz_id=${this.props.params.quizId}`)
  }
  render() {
    return <div>Are you done yet</div>;
  }
}
