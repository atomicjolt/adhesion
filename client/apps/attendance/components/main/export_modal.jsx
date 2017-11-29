import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RangePicker from './range_picker';
import ExportButton from './export_button';

export default class ExportModal extends React.Component {

  static propTypes = {
    lmsCourseId: PropTypes.string.isRequired,
    downloadFile: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    closeReportModal: PropTypes.func.isRequired,
    isLargeDownload: PropTypes.bool
  };

  static getStyles() {
    return {
      closeModal: {
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        zIndex: 2,
        top: '0px',
        opacity: '0',
      },
      container: {
        position: 'absolute',
        top: '0px',
        width: '100%',
        height: '100%',
      },
      msgModal: {
        marginLeft: '5rem'
      }
    };
  }

  constructor() {
    super();
    const today = moment().startOf('day').toDate();
    this.state = {
      startDate: today,
      endDate: today,
    };
  }

  onExport(downloadOptions = {}) {
    this.props.downloadFile(
      this.props.lmsCourseId,
      downloadOptions.startDate,
      downloadOptions.endDate,
    );
  }

  closeMsgModal() {
    this.props.closeReportModal();
    this.props.closeModal();
  }

  // That overlay is a button, for accessibility
  render() {
    const styles = ExportModal.getStyles();
    if (this.props.isLargeDownload) {
      return (
        <div style={styles.container}>
          <div className="c-popup is-open">
            <div className="c-popup c-popup--export is-open">
              <button
                className="c-btn c-btn--cancel"
                onClick={() => this.closeMsgModal()}
              >
                <i className="material-icons">clear</i>
              </button>
              <p className="c-popup__message" style={styles.msgModal}>It will take some time to create this report. It will be placed in an Attendance folder in your Course.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div className="c-popup c-popup--export is-open" role="radioGroup">
          <button
            className="c-btn c-btn--cancel"
            onClick={() => this.props.closeModal()}
          >
            <i className="material-icons">clear</i>
          </button>
          <div className="c-popup__left">
            <ExportButton
              text={'Export All'}
              onExport={() => this.onExport()}
              ariaPosinset={1}
            />
          </div>
          <div className="c-popup__right">
            <RangePicker
              onStartChange={date => this.setState({ startDate: date })}
              onEndChange={date => this.setState({ endDate: date })}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
            <ExportButton
              downloadOptions={{
                startDate: this.state.startDate,
                endDate: this.state.endDate,
              }}
              text={'Export Date Range'}
              onExport={options => this.onExport(options)}
              ariaPosinset={2}
            />
          </div>
        </div>
        <button
          className="c-popup--outside"
          onClick={() => this.props.closeModal()}
          style={styles.closeModal}
        />
      </div>
    );
  }
}
