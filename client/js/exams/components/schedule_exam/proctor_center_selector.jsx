import React        from 'react';
import SelectSearch from 'react-select-search';
import _            from 'lodash';

export default class ProctorCenterSelector extends React.Component {
  constructor(props) {
    super(props);
    const { assignedExam } = props;
    const selectedCenterId = assignedExam ? _.toString(assignedExam.testing_center_id) : null;
    this.state = {
      selectedCenterId,
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.assignedExam && nextProps.assignedExam) {
      this.setState({ selectedCenterId: _.toString(nextProps.assignedExam.testing_center_id) });
    }
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
