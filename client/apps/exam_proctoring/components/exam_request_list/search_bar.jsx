import React       from 'react';
import PropTypes from 'prop-types';
import Defines     from '../../defines';

export default class SearchBar extends React.Component {
  // TODO: we need to load test this to see if automatic updates will work with
  // a bunch of items
  static propTypes = {
    searchChange: PropTypes.func.isRequired,
    style: PropTypes.shape({}),
  }

  static getStyles() {
    return {
      container: {
        display: 'flex',
        height: '35px',
      },
      input: {
        flex: 1,
        border: `2px solid ${Defines.lightGrey}`,
        fontSize: '1.2em',
        padding: '0px 5px 0px 40px',
        outline: 'none',
      },
      icon: {
        fontSize: '28px',
        position: 'absolute',
        top: '5px',
        left: '5px',
        color: Defines.darkGrey,
      }
    };
  }

  render() {
    const styles = SearchBar.getStyles();

    return (
      <div style={{ ...styles.container, ...this.props.style }}>
        <input
          className="qa-search-bar"
          style={styles.input}
          type="text"
          onChange={e => this.props.searchChange(e)}
        />
        <i style={styles.icon} className="material-icons">search</i>
      </div>
    );
  }
}
