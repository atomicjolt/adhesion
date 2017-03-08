import React             from 'react';
import HoverButton       from '../common/hover_button';
import Defines           from '../../../defines';
import CommonSvg         from '../../../common_components/common_svg';


export default function settings(props) {
  const settingsStyle = {
    position: 'absolute',
    right: '20px',
    zIndex: '1',
    width: '200px',
    boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
    backgroundColor: 'white',
    fontSize: 'small',
  };

  const buttonStyle = {
    padding: '20px',
    width: '100%',
    backgroundColor: 'white',
    border: 'none',
    fontSize: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    verticalAlign: 'middle',
  };

  const divStyle = {
    borderBottom: `1px solid ${Defines.lightGrey}`,
  };

  const hoveredStyle = {
    backgroundColor: Defines.lightBackground,
  };

  return (
    <div style={{ ...settingsStyle }}>
      <div style={divStyle}>
        {props.assignmentButton}
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={props.handlePreview}
        >
          <CommonSvg className="c-icon" type="preview" />
          Preview Package
        </HoverButton>
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={props.handleUpdate}
        >
          {props.updateInput}
          <CommonSvg className="c-icon" type="upload" />
          Update Package
        </HoverButton>
      </div>
      <div style={divStyle}>
        <HoverButton
          style={buttonStyle}
          hoveredStyle={hoveredStyle}
          onClick={props.handleRemove}
        >
          <CommonSvg className="c-icon" type="delete" />
          Delete Package
        </HoverButton>
      </div>
    </div>
  );
}

settings.propTypes = {
  assignmentButton: React.PropTypes.shape({}),
  handlePreview: React.PropTypes.func.isRequired,
  handleUpdate: React.PropTypes.func.isRequired,
  handleRemove: React.PropTypes.func.isRequired,
  updateInput: React.PropTypes.shape({}),
};
