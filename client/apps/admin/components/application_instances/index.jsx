import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from './header';
import List from './list';
import Modal from './modal';
import Heading from '../common/heading';
import Pagination from '../common/pagination';
import * as ApplicationInstanceActions from '../../actions/application_instances';

const select = (state, props) => ({
  applicationInstances: _.filter(state.applicationInstances.applicationInstances,
    { application_id: parseInt(props.params.applicationId, 10) }),
  applications: state.applications,
  totalPages: state.applicationInstances.totalPages,
  userName: state.settings.display_name,
  settings: state.settings,
  sites: state.sites,
  canvasOauthURL: state.settings.canvas_oauth_url,
});

export class Index extends React.Component {
  static propTypes = {
    applicationInstances: PropTypes.arrayOf(PropTypes.shape({})),
    getApplicationInstances: PropTypes.func.isRequired,
    createApplicationInstance: PropTypes.func,
    deleteApplicationInstance: PropTypes.func,
    saveApplicationInstance: PropTypes.func,
    sites: PropTypes.shape({}).isRequired,
    applications: PropTypes.shape({}).isRequired,
    params: PropTypes.shape({
      applicationId: PropTypes.string.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      canvas_callback_url: PropTypes.string.isRequired,
    }).isRequired,
    canvasOauthURL: PropTypes.string.isRequired,
    disableApplicationInstance: PropTypes.func.isRequired,
    totalPages: PropTypes.number,
  };

  constructor() {
    super();
    this.state = {
      modalOpen: false,
      currentPage: null,
      sortColumn: 'created_at',
      sortDirection: 'desc',
    };
  }

  get application() {
    return this.props.applications[this.props.params.applicationId];
  }

  get newApplicationInstanceModal() {
    if (this.state.modalOpen) {
      return <Modal
        closeModal={() => this.setState({ modalOpen: false })}
        sites={this.props.sites}
        save={this.props.createApplicationInstance}
        application={this.application}
      />;
    }
    return null;
  }

  componentWillMount() {
    const {
      currentPage,
      sortColumn,
      sortDirection,
    } = this.state;

    this.props.getApplicationInstances(
      this.props.params.applicationId,
      currentPage,
      sortColumn,
      sortDirection,
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currentPage,
      sortColumn,
      sortDirection,
    } = this.state;

    const propsChanged = (
      prevState.currentPage !== currentPage ||
      prevState.sortColumn !== sortColumn ||
      prevState.sortDirection !== sortDirection
    );

    if (propsChanged) {
      this.props.getApplicationInstances(
        this.props.params.applicationId,
        currentPage,
        sortColumn,
        sortDirection,
      );
    }
  }

  setPage(change) {
    this.setState({ currentPage: change.selected + 1 });
  }

  setSort(sortColumn, sortDirection) {
    this.setState({
      sortColumn,
      sortDirection,
    });
  }

  render() {
    const { application } = this;

    const {
      sortColumn:currentSortColumn,
      sortDirection:currentSortDirection,
    } = this.state;

    return (
      <div>
        <Heading backTo="/applications" />
        <div className="o-contain o-contain--full">
          {this.newApplicationInstanceModal}
          <Header
            openSettings={() => {}}
            newApplicationInstance={() => this.setState({ modalOpen: true })}
            application={application}
          />
          <List
            applicationInstances={this.props.applicationInstances}
            settings={this.props.settings}
            sites={this.props.sites}
            application={application}
            saveApplicationInstance={this.props.saveApplicationInstance}
            deleteApplicationInstance={this.props.deleteApplicationInstance}
            disableApplicationInstance={this.props.disableApplicationInstance}
            canvasOauthURL={this.props.canvasOauthURL}
            setSort={(sortColumn, sortDirection) => this.setSort(sortColumn, sortDirection)}
            currentSortColumn={currentSortColumn}
            currentSortDirection={currentSortDirection}
          />
          <Pagination
            setPage={change => this.setPage(change)}
            pageCount={this.props.totalPages}
            currentPage={this.state.currentPage}
            disableInitialCallback
          />
        </div>
      </div>
    );
  }
}

export default connect(select, ApplicationInstanceActions)(Index);
