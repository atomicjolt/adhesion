import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import Stub            from '../../../../specs_support/stub';
import NavButton       from './nav_button';

describe('Scorm Analytics NavButton', () => {

  let result;
  let active = false;
  const props = {
    label: 'test application',
    stat: '12',
    setActive: () => { active = true; },
  };

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <NavButton {...props} />
      </Stub>
    );
  });

  it('renders the nav button with the correct values', () => {
    const div = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(div.textContent).toContain(props.label);
    expect(div.textContent).toContain(props.stat);
  });

  it('calls the callback on click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(active).toBeTruthy();
  });
});
