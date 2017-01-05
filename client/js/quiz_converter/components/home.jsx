import React from 'react';

export default () => (
  <form action="api/quiz_conversions" method="post" encType="multipart/form-data">
    <input type="hidden" name="oauth_consumer_key" value="quiz-converter" />
    <input type="hidden" name="lms_course_id" value="1" />
    <label htmlFor="quiz_doc">
      <span>Quiz Doc</span>
      <input type="file" name="quiz_doc" />
    </label>
    <label htmlFor="answer_key">
      <span>Answer Key</span>
      <input type="file" name="answer_key" />
    </label>
    <button type="submit">Submit</button>
  </form>
);
