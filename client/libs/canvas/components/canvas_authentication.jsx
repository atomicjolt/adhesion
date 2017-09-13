import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const select = state => ({
  settings: state.settings
});

export class CanvasAuthentication extends React.Component {
  static defaultProps = {
    overrides  : {},
    hideButton : false,
    autoSubmit : false,
  }

  static propTypes = {
    overrides  : PropTypes.shape({}),
    hideButton : PropTypes.bool,
    autoSubmit : PropTypes.bool,
    settings   : PropTypes.shape({
      canvas_oauth_url: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    if (this.props.autoSubmit) {
      this.form.submit();
    }
  }

  getButton() {
    if (this.props.hideButton) return null;
    return <input type="submit" style={{ backgroundColor: '#007fa3', width: '15%', height: '35px', color: 'white', fontWeight: 'bold', fontSize: '15px' }} value="Authorize" />;
  }

  renderSettings() {
    const settings = { ...this.props.settings, ...this.props.overrides };
    return _.map(settings, (value, key) => (
      <input key={key} type="hidden" value={value || ''} name={key} />
    ));
  }

  render() {
    return (
      <div>
        <form
          ref={(ref) => { this.form = ref; }}
          action={this.props.settings.canvas_oauth_url}
        >
          { this.getButton() }
          { this.renderSettings() }
        </form>
      </div>
    );
  }
}

export default connect(select)(CanvasAuthentication);
