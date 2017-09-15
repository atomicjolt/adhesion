import React             from 'react';
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
  exam: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
  }),
  examRequest: React.PropTypes.shape({
    status: React.PropTypes.string,
    scheduled_date: React.PropTypes.string,
    scheduled_time: React.PropTypes.string,
    testing_center_name: React.PropTypes.string,
  }),
  goToExam: React.PropTypes.func.isRequired,
};
