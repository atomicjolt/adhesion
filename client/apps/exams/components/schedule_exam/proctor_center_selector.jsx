import React        from 'react';
import PropTypes from 'prop-types';
import SelectSearch from 'react-select-search';
import _            from 'lodash';

export default class ProctorCenterSelector extends React.Component {
  static propTypes = {
    testingCenterList: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedCenterId: null,
    };
  }

  getOptions() {
    return _.map(this.props.testingCenterList, center => ({
      name: center.name,
      value: _.toString(center.id),
    }));
  }

  render() {
    let selectSearch;
    if (!_.isEmpty(this.props.testingCenterList)) {
      const selectSearchProps = {
        options: this.getOptions(),
        onChange: this.props.onChange,
        placeholder: 'Select a testing center',
        value: this.state.selectedCenterId,
      };

      selectSearch = (
        <SelectSearch {...selectSearchProps} />
      );
    }

    return (
      <div>
        {selectSearch}
      </div>
    );
  }
}
