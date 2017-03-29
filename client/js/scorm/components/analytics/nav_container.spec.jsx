import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import Stub            from '../../../../specs_support/stub';
import NavContainer    from './nav_container';

describe('Scorm Analytics NavContainer', () => {

  let result;
  let switched = false;
  const props = {
    navButtons: [
      {
        name: 'test application',
        stat: '12',
      },
    ],
    switchChart: () => { switched = true; },
  };

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <NavContainer {...props} />
      </Stub>
    );
  });

  it('renders the nav container with the correct values', () => {
    const div =  TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(div.textContent).toContain(props.navButtons[0].name);
    expect(div.textContent).toContain(props.navButtons[0].stat);
  });

  it('calls the callback on click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(switched).toBeTruthy();
  });
});
