import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import NewProctorCode   from './new_proctor_code';

describe('new proctor code', () => {
  it('renders the proctor code', () => {
    const props = {
      code: 'america',
      hideModal: () => {}
    };
    const result = TestUtils.renderIntoDocument(<NewProctorCode {...props} />);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('america');
  });
});
