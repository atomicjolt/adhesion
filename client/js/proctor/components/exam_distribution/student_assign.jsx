import React       from 'react';
import Defines     from '../../defines';

export default function studentAssign(props) {
  const styles = {
    td: {
      textAlign: 'left',
      padding: '20px 20px',
      borderBottom: `1px solid ${Defines.lightGrey}`
    },
  };

  return (
    <tr>
      <td style={styles.td}>{props.student.name}</td>
      <td style={styles.td}>...</td>
      <td style={styles.td}>AssignButton</td>
      <td style={styles.td}> - </td>
      <td style={styles.td}> Unchanged </td>
    </tr>
  );
}

studentAssign.propTypes = {
  student: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    // id: React.PropTypes.number.isRequired,
  })
};
