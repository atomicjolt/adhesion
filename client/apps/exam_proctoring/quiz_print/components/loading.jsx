import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../../../libs/components/loader';

export default function loading(props) {
  const styles = {
    loading: {
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.loading}>
      <Loader />
      <h3>Loading {props.loadingQuiz ? 'Quiz' : 'Questions'}</h3>
    </div>
  );
}

loading.propTypes = {
  loadingQuiz: PropTypes.bool.isRequired
};
