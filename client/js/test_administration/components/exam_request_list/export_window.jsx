import React      from 'react';
import DateFilter from './date_filter';

export default class ExportWindow extends React.Component {

  constructor() {
    super();
    this.state = {
      filterDate: new Date()
    }
  }

  getStyles() {
    return {
      container: {
        backgroundColor: '#fefefe',
        // backgroundColor: 'red',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #888',
        width: '75vh',
        top: '120px', // or 400%
        left: '25%',
        position: 'absolute',
        zIndex: 2
      }
    }
  }

  render() {
    const styles = this.getStyles();

    return (
      <div style={styles.container}>
        {/*<div></div>*/}
        <DateFilter
          onChange={ () => {} }
          date={this.state.filterDate}
        />
      </div>
    )
  }

}