import React from 'react';
import RangePicker from './range_picker';

const ExportButton = (props) => (
  <button className="c-btn  c-btn--export" onClick={() => {
    props.onExport(props.downloadOptions);
  }}>{props.text}</button>
);

export default class ExportModal extends React.Component{

  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
    downloadFile: React.PropTypes.func.isRequired,
    onOutsideClick: React.PropTypes.func.isRequired,
    onExport: React.PropTypes.func
  }

  constructor(){
    super();
    const today = new Date();
    today.setHours(0,0,0,0);
    this.state = {
      startDate: today,
      endDate: today
    };
  }

  onExport(downloadOptions = {}){
    if(_.isFunction(this.props.onExport)){
      this.props.onExport();
    }
    this.props.downloadFile(
      this.props.lmsCourseId,
      downloadOptions.startDate,
      downloadOptions.endDate
    );
  }

  render(){
    const closeModalStyles = {
      position:'absolute',
      height: '100vh',
      width: '100vw',
      zIndex: 2,
      top:0
    };

    return (
    <div style={{position: 'absolute', top:0, width:'100%', height:'100%'}}>
      <div className="c-popup  c-popup--export  is-open">
    		<div className="c-popup__left">
          <ExportButton
            text={"Export All"}
            onExport={() => this.onExport()}/>
        </div>
    		<div className="c-popup__right">
          <RangePicker
              onStartChange={(date) => this.setState({startDate:date})}
              onEndChange={(date) => this.setState({endDate:date})}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              />
          <ExportButton
              downloadOptions={{
                startDate: this.state.startDate,
                endDate: this.state.endDate
              }}
              text={"Export Date Range"}
              onExport={(options) => this.onExport(options)}/>
    		</div>
  	  </div>
      <div
        className="c-popup--outside"
        onClick={() => this.props.onOutsideClick()}
        style={closeModalStyles}></div>
  </div>
  );
  }
};
