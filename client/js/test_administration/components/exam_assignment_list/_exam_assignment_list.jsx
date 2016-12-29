import React          from 'react';
import { connect }    from 'react-redux';

const select = () => ({});

export class BaseExamAssignmentList extends React.Component {
  render() {
    return <h1>testing center tool</h1>
  }
}

export default connect(select, {})(BaseExamAssignmentList);
