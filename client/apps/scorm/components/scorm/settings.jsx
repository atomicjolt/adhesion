import React             from 'react';
import PropTypes from 'prop-types';
import HoverButton       from '../common/hover_button';
import Defines           from '../../../../libs/defines';
import CommonSvg         from '../../../../libs/components/common_svg';
import ConfirmDelete from '../../../../libs/components/confirm_delete';


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

  function analytics(useBtn, handleFunc) {
    if (useBtn) {
      return (
        <div style={divStyle}>
          <HoverButton
            style={buttonStyle}
            hoveredStyle={hoveredStyle}
            onClick={handleFunc}
          >
            <CommonSvg className="c-icon" type="stats" />
            Go to Analytics
          </HoverButton>
        </div>
      );
    }
    return (<div />);
  }

  function handleRemove() {
    props.hideModal();
    props.handleRemove();
  }

  function toggleRemove() {
    props.showModal(
      <ConfirmDelete
        handleRemove={handleRemove}
        closeModal={props.hideModal}
      />
    );
  }

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
      {analytics(props.analyticsButton, props.handleAnalytics)}
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
          onClick={toggleRemove}
        >
          <CommonSvg className="c-icon" type="delete" />
          Delete Package
        </HoverButton>
      </div>
    </div>
  );
}

settings.propTypes = {
  assignmentButton: PropTypes.shape({}),
  analyticsButton: PropTypes.bool.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAnalytics: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  updateInput: PropTypes.shape({}),
  hideModal: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
};
