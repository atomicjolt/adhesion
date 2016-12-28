import React       from 'react';
import HoverButton from '../common/hover_button';
import Defines     from '../../defines';

export default function examListItem(props) {
  const styles = {
    button: {
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
    }
  };

  return (
    <li>
      <HoverButton
        style={styles.button}
        hoveredStyle={styles.hoveredStyle}
        onClick={() => props.goToExam(props.exam.id)}
      >
        <h2>{props.exam.title}</h2>
      </HoverButton>
    </li>
  );
}

examListItem.propTypes = {
  exam: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
  }),
  goToExam: React.PropTypes.func.isRequired,
};
