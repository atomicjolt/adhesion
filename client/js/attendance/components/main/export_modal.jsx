import React from 'react';
import _ from 'lodash';
import RangePicker from './range_picker';
import ExportButton from './export_button';

export default class ExportModal extends React.Component {

  static propTypes = {
    lmsCourseId: React.PropTypes.string.isRequired,
    downloadFile: React.PropTypes.func.isRequired,
    onOutsideClick: React.PropTypes.func.isRequired,
    onExport: React.PropTypes.func,
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
    };
  }

  constructor() {
    super();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.state = {
      startDate: today,
      endDate: today,
    };
  }

  onExport(downloadOptions = {}) {
    if (_.isFunction(this.props.onExport)) {
      this.props.onExport();
    }
    this.props.downloadFile(
      this.props.lmsCourseId,
      downloadOptions.startDate,
      downloadOptions.endDate,
    );
  }

  // That overlay is a button, for accessibility
  render() {
    const styles = ExportModal.getStyles();

    return (
      <div style={styles.container}>
        <div className="c-popup  c-popup--export  is-open">
          <div className="c-popup__left">
            <ExportButton
              text={'Export All'}
              onExport={() => this.onExport()}
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
            />
          </div>
        </div>
        <button
          className="c-popup--outside"
          onClick={() => this.props.onOutsideClick()}
          style={styles.closeModal}
        />
      </div>
    );
  }
}
