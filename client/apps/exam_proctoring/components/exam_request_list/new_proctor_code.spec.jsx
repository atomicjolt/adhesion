import React            from 'react';
import ReactTestUtils        from 'react-dom/test-utils';
import NewProctorCode   from './new_proctor_code';

describe('new proctor code', () => {
  it('renders the proctor code', () => {
    const props = {
      code: 'america',
      hideModal: () => {}
    };
    const result = ReactTestUtils.renderIntoDocument(<NewProctorCode {...props} />);
    const element = ReactTestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('america');
  });
});
