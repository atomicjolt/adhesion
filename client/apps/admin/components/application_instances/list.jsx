import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListRow from './list_row';
import Sortable from '../common/sortable';

export default function List(props) {
  const {
    application,
    settings,
    sites,
    saveApplicationInstance,
    deleteApplicationInstance,
    canvasOauthURL,
    disableApplicationInstance,
    setSort,
    currentSortColumn,
    currentSortDirection,
  } = props;

  return (
    <table className="c-table c-table--instances">
      <thead>
        <tr>
          <Sortable
            title="LTI KEY"
            column="lti_key"
            currentColumn={currentSortColumn}
            currentDirection={currentSortDirection}
            setSort={setSort}
          />
          <th><span>SETTINGS</span></th>
          <th><span>CONFIG XML</span></th>
          <th><span>ENABLED</span></th>
          <th><span>AUTHS</span></th>
          <Sortable
            title="CREATED"
            column="created_at"
            currentColumn={currentSortColumn}
            currentDirection={currentSortDirection}
            setSort={setSort}
          />
          <th>________</th>
          <th><span>REQUESTS</span></th>
          <th><span>LTI LAUNCHES</span></th>
          <th><span>USERS</span></th>
          <th><span>ERRORS</span></th>
          <th />
        </tr>
      </thead>
      <tbody>
        {
          _.map(props.applicationInstances, (instance, key) => (
            <ListRow
              key={`instance_${key}`}
              application={application}
              applicationInstance={instance}
              settings={settings}
              sites={sites}
              save={saveApplicationInstance}
              delete={deleteApplicationInstance}
              canvasOauthURL={canvasOauthURL}
              disable={
                () => {
                  const disabledAt = instance.disabled_at ? null : new Date(Date.now());
                  disableApplicationInstance(instance.application_id, instance.id, disabledAt);
                }
              }
            />
          ))
        }
      </tbody>
    </table>
  );
}

List.propTypes = {
  applicationInstances: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  settings: PropTypes.shape({}).isRequired,
  sites: PropTypes.shape({}).isRequired,
  application: PropTypes.shape({}),
  saveApplicationInstance: PropTypes.func.isRequired,
  deleteApplicationInstance: PropTypes.func.isRequired,
  canvasOauthURL: PropTypes.string.isRequired,
  disableApplicationInstance: PropTypes.func.isRequired,
  currentSortColumn: PropTypes.string.isRequired,
  currentSortDirection: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};
