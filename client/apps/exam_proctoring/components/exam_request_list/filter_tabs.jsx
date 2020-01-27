import React   from 'react';
import PropTypes from 'prop-types';
import Defines from '../../defines';

export default class FilterTabs extends React.Component {

  static propTypes = {
    changeTab: PropTypes.func.isRequired,
    selectedTab: PropTypes.string,
    unscheduledCount: PropTypes.number.isRequired,
  };

  getStyles() {
    return {
      container: {
        borderBottom: `2px solid ${Defines.tanishBrown}`,
      },
      slantButton: {
        position: 'relative',
        border: 'none',
        padding: '10px 35px 10px 10px',
        backgroundColor: Defines.lightBackground,
        borderRadius: '0px',
        fontSize: '1em',
        color: Defines.lightText,
        clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 100%, 0 100%)',
        outline: 'none',
        cursor: 'pointer',
      },
      selected: name => (
        name === this.props.selectedTab ? {
          backgroundColor: Defines.tanishBrown,
          color: 'white',
          zIndex: '1',
        } : {}
      ),
      shift: {
        marginLeft: '-10px',
      }
    };
  }

  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.container}>
        <button
          className="qa-unscheduled-tab"
          style={{ ...styles.slantButton, ...styles.selected('unscheduled') }}
          onClick={() => this.props.changeTab('unscheduled')}
        >
          Unscheduled ({this.props.unscheduledCount})
        </button>
        <button
          className="qa-date-tab"
          style={{ ...styles.slantButton, ...styles.selected('date'), ...styles.shift }}
          onClick={() => this.props.changeTab('date')}
        >
          Date
        </button>
        <button
          className="qa-all-tab"
          style={{ ...styles.slantButton, ...styles.selected('all'), ...styles.shift }}
          onClick={() => this.props.changeTab('all')}
        >
          All
        </button>
      </div>
    );
  }
}
