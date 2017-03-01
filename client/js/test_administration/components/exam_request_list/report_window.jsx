import React        from 'react';
import DateSelector from '../common/date_selector';

export default class ReportWindow extends React.Component {

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
        padding: '20px',
        boxShadow: "0 0 25px #999999",
        width: '80vh',
        top: '120px', // or 400%
        left: '25%',
        position: 'absolute',
        zIndex: 2
      }, cancelButton: {
        color: '#777777', // text color
        border: '1px solid #EEEEEE',
        backgroundColor: '#EEEEEE',
        padding: '8px 20px 8px 20px',
        fontSize: '12px',
        fontFamily: 'sans-serif',

      }, leftDateSelector: {
        float: 'left',
        marginLeft: '10px',
      }, rightDateSelector: {
        float: 'right',
        // float: 'left',
        marginRight: '10px',
      }, title: {
        color: '#555555',
        fontFamily: 'verdana',
        fontSize: '10px',
        marginLeft: '10px',
      }, to: {
        fontFamily: 'sans-serif',
        textAlign: 'center',
        fontSize: '5px',
        margin: 'auto',
        color: '#777777',
        height: '35px',
        lineHeight: '35px',
      }, dateRange: {
        color: '#777777',
        fontSize: '6px',
        fontFamily: 'sans-serif',
        marginLeft: '10px',
      }, downloadButton: {
        color: '#FFFFFF', // text color
        border: '1px solid rgb(193, 161, 122)',
        backgroundColor: 'rgb(193, 161, 122)',
        padding: '8px 20px 8px 20px',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        marginLeft: '5px',
      }, buttonsSection: {
        margin: '30px 10px 10px 20px',
        float: 'right',
      }
    }
  }

  render() {
    const styles = this.getStyles();

    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <h1>Exam Report</h1>
        </div>
        <div style={styles.dateRange}>
          <h1>DATE RANGE</h1>
        </div>

        <div style={styles.leftDateSelector}>
          <DateSelector
            onChange={() => {}}
            date={this.state.filterDate}
            format="MMM Do"
          />
        </div>
        <div style={styles.rightDateSelector}>
          <DateSelector
            onChange={() => {}}
            date={this.state.filterDate}
            format="MMM Do"
          />
        </div>
        <div style={styles.to}>
          <h1>TO</h1>
        </div>
        <div style={styles.buttonsSection}>
          <button style={styles.cancelButton}>CANCEL</button>
          <button style={styles.downloadButton}>DOWNLOAD</button>
        </div>
      </div>
    )
  }
}