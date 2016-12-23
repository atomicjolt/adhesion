import React       from 'react';
import Defines     from '../../defines';
import CenterSelector from './center_selector.jsx'

export default function studentAssign(props) {
  const styles = {
    td: {
      textAlign: 'left',
      padding: '20px 20px',
      borderBottom: `1px solid ${Defines.lightGrey}`
    },
  };
console.log(props.centers)
  return (
    <select>
    {_.map(props.centers, (center) => {
       return <option key={center.id} value={center.id}>{center.name}</option>;
    })}
    </select>
  );
}

studentAssign.propTypes = {
  student: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    // id: React.PropTypes.number.isRequired,
  })
};
