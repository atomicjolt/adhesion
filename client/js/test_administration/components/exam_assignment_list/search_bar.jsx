import React       from 'react';
import HoverButton from '../common/hover_button';
import Defines     from '../../defines';

export default class SearchBar extends React.Component {
  // TODO: we need to load test this to see if automatic updates will work with
  // a bunch of items
  static propTypes = {
    searchChange: React.PropTypes.func.isRequired
  }

  static getStyles() {
    return {
      container: {
        display: 'flex',
        height: '50px',
        marginBottom: '10px',
      },
      input: {
        flex: 1,
        border: `3px solid ${Defines.tanishBrown}`,
        fontSize: '1.2em',
        padding: '0px 5px'
      },
      button: {
        border: `3px solid ${Defines.tanishBrown}`,
        backgroundColor: Defines.tanishBrown,
        color: 'white',
        padding: '10px 20px',
      },
      icon: {
        fontSize: '32px',
      }
    };
  }

  render() {
    const styles = SearchBar.getStyles();

    return (
      <div style={styles.container}>
        <input
          style={styles.input}
          type="text"
          onChange={e => this.props.searchChange(e)}
        />
        <HoverButton style={styles.button}>
          <i style={styles.icon} className="material-icons">search</i>
        </HoverButton>
      </div>
    );
  }
}
