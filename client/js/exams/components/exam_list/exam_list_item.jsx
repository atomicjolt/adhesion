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
  if (!props.examRequest) {
    status = '-';
  } else if (_.includes(['scheduled', 'requested'], props.examRequest.status)) {
    status = props.examRequest.status;
  } else if (props.examRequest.status === 'assigned') {
    // do some more complex things here.
  }

  return (
    <ClickableTableRow
      style={styles.tr}
      hoveredStyle={styles.hoveredStyle}
      onClick={() => props.goToExam(props.exam.id)}
    >
      <td style={{ ...styles.td, ...styles.title }}>{props.exam.title}</td>
      <td style={{ ...styles.td, ...styles.status }}>{_.capitalize(status)}</td>
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
    testing_center_name: React.PropTypes.string,
    // scheduled_for: React.PropTypes.string,
  }),
  goToExam: React.PropTypes.func.isRequired,
};
