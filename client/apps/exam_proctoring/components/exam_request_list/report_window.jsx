import React                    from 'react';
import PropTypes from 'prop-types';
import moment                   from 'moment';
import Defines                  from '../../defines';
import DateSelector             from '../common/date_selector';

export default class ReportWindow extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired
  };

  static getStyles() {
    return {
      popupStyle: {
        boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
        backgroundColor: 'white',
        padding: '25px',
        position: 'fixed',
        width: '400px',
        top: '5vh',
        left: '25vw',
        right: '25vw',
        zIndex: '2',
        color: Defines.darkGrey,
      },
      buttonStyle: {
        backgroundColor: Defines.tanishBrown,
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        float: 'right',
      },
      cancelButton: {
        backgroundColor: Defines.lightBackground,
        color: Defines.darkGrey,
        border: '1px solid #EEEEEE',
        padding: '8px 20px 8px 20px',

      },
      leftDateSelector: {
        display: 'flex',
        float: 'left',
        marginLeft: '10px',
      },
      rightDateSelector: {
        display: 'flex',
        float: 'right',
        marginRight: '10px',
      },
      title: {
        color: '#555555',
        fontFamily: 'verdana',
        fontSize: '10px',
        marginLeft: '10px',
      },
      to: {
        fontFamily: 'sans-serif',
        textAlign: 'center',
        fontSize: '5px',
        color: '#777777',
        height: '35px',
        lineHeight: '35px',
      },
      dateRange: {
        color: '#777777',
        fontSize: '6px',
        fontFamily: 'sans-serif',
        marginLeft: '10px',
      },
      downloadButton: {
        color: '#FFFFFF',
        border: '1px solid rgb(193, 161, 122)',
        backgroundColor: 'rgb(193, 161, 122)',
        padding: '8px 20px 8px 20px',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        marginLeft: '5px',
      },
      buttonsSection: {
        margin: '30px 10px 10px 20px',
        float: 'right',
      }
    };
  }

  constructor() {
    super();
    this.state = {
      startDate: moment(),
      endDate: moment(),
    };
  }

  render() {
    const styles = ReportWindow.getStyles();
    return (
      <div style={styles.popupStyle}>
        <h2>Exam Report</h2>
        <div style={styles.dateRange}><h1>DATE RANGE</h1></div>
        <div style={styles.leftDateSelector}>
          <DateSelector
            onChange={startDate => this.setState({ startDate })}
            date={this.state.startDate}
            format="MMM Do"
          />
        </div>
        <div style={styles.rightDateSelector}>
          <DateSelector
            onChange={endDate => this.setState({ endDate })}
            date={this.state.endDate}
            format="MMM Do"
          />
        </div>
        <div style={styles.to}>
          <h1>TO</h1>
        </div>
        <div style={styles.buttonsSection}>
          <button
            className="qa-cancel-report-btn"
            style={styles.cancelButton}
            onClick={this.props.onCancel}
          >CANCEL</button>
          <button
            className="qa-download-report-btn"
            style={styles.downloadButton}
            onClick={() => this.props.onDownload(
              this.state.startDate.toDate(),
              this.state.endDate.toDate())}
          >
            DOWNLOAD
          </button>
        </div>
      </div>
    );
  }
}
