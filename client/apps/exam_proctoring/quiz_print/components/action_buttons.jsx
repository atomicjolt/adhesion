import React            from 'react';
import { hashHistory }  from 'react-router3';

export default function actionButtons() {
  const styles = {
    printButton: {
      float: 'right',
    }
  };

  return (
    <div className="no-print">
      <button
        className="pure-button"
        onClick={() => hashHistory.push('/')}
      >
        Back
      </button>
      <button
        className="pure-button button-primary"
        style={styles.printButton}
        onClick={() => window.print()}
      >
        Print
      </button>
    </div>
  );
}
