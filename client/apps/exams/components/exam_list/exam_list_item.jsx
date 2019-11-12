import React             from 'react';
import PropTypes from 'prop-types';
import _                 from 'lodash';
import ClickableTableRow from '../common/clickable_table_row';
import Defines           from '../../defines';

export default function examListItem(props) {
  const styles = {
    tr: {
      width: '100%',
      textAlign: 'left',
      backgroundColor: 'white',
      cursor: 'pointer',
      border: 'none',
      borderBottom: `1px solid ${Defines.lightGrey}`,
      color: Defines.darkGrey,
      padding: '0px 20px',
    },
    hoveredStyle: {
      color: Defines.highlightedText,
      backgroundColor: Defines.lightBackground,
    },
    td: {
      textAlign: 'left',
      padding: '20px 20px',
      borderBottom: `1px solid ${Defines.lightGrey}`,
    },
    title: {
      fontWeight: 'bold',
    },
    status: {
      color: `${Defines.darkGrey}`
    }
  };

  let status;
  let testingCenter;
  if (!props.examRequest) {
    status = '';
    testingCenter = '';
  } else if (props.examRequest.status === 'requested') {
    status = _.capitalize(props.examRequest.status);
    testingCenter = props.examRequest.testing_center_name;
  } else if (props.examRequest.status === 'scheduled') {
    testingCenter = props.examRequest.testing_center_name;
    status = (
      <div>
        <div>
          Scheduled
        </div>
        <div>
          {props.examRequest.scheduled_date} {props.examRequest.scheduled_time}
        </div>
      </div>
    );
  }

  return (
    <ClickableTableRow
      style={styles.tr}
      hoveredStyle={styles.hoveredStyle}
      onClick={() => props.goToExam(props.exam.id)}
    >
      <td style={{ ...styles.td, ...styles.title }}>{props.exam.title}</td>
      <td style={{ ...styles.td, ...styles.status }}>{testingCenter}</td>
      <td style={{ ...styles.td, ...styles.status }}>{status}</td>
    </ClickableTableRow>
  );
}

examListItem.propTypes = {
  exam: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }),
  examRequest: PropTypes.shape({
    status: PropTypes.string,
    scheduled_date: PropTypes.string,
    scheduled_time: PropTypes.string,
    testing_center_name: PropTypes.string,
  }),
  goToExam: PropTypes.func.isRequired,
};
