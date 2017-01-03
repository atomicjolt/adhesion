import React    from 'react';

export default function shortAnswerQuestion(props) {
  const styles = {
    textbox: {
      display: 'inline-block',
      height: '20px',
      padding: '8px',
      marginBottom: '10px',
      fontSize: '.875rem',
      lineHeight: '20px',
      color: '#2D3B45',
      borderRadius: '3px',
      verticalAlign: 'middle',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.075)',
      transition: 'border linear 0.2s,box-shadow linear 0.2s',
    }
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.question_text }} />
      <input type="text" style={styles.textbox} />
    </div>
  );
}

shortAnswerQuestion.propTypes = {
  question_text: React.PropTypes.string,
};
