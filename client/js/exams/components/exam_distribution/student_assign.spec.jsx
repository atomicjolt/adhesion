import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import StudentAssign    from './student_assign';

describe('Exam list', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      canvasRequest: () => {},
      lmsCourseId: '1',
      assignedExam: {
        id: 1,
        updated_at: new Date('10/10/10'),
        testing_center_id: 1,
        status: 'assigned'
      },
      student: {
        id: 1,
        name: 'Joseph'
      },
      assignExam: () => {},
      reassignExam: () => {},
    };
  });

  it('renders the student assign with the date if there is an assignment', () => {
    result = TestUtils.renderIntoDocument(<StudentAssign {...props} />);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    expect(element.textContent).toContain('OCT');
  });

  it('renders the student assign with a button if no assignment and a center is selected', () => {
    props.assignedExam = null;
    result = TestUtils.renderIntoDocument(<StudentAssign {...props} />);
    result.setState({ selectedCenterId: '1' });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(element.textContent).toContain('Assign');
  });

  it('does not render the button if a center is not selected', () => {
    props.assignedExam = null;
    result = TestUtils.renderIntoDocument(<StudentAssign {...props} />);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    expect(element.textContent).not.toContain('Assign');
  });

  it('renders the reassign button if a different center is selected then what what before', () => {
    result = TestUtils.renderIntoDocument(<StudentAssign {...props} />);
    result.setState({ selectedCenterId: '2' });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    expect(element.textContent).toContain('Reassign');
  });
});
