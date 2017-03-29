import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import Stub            from '../../../../specs_support/stub';
import Helper          from '../../../../specs_support/helper';
import Header          from './header';

describe('Scorm Analytics Header', () => {

  let result;
  let props;

  describe('Scorm Analytics Header', () => {
    beforeEach(() => {
      props = {
        title: 'test application',
        studentName: 'Student',
        view: 'course',
        switchView: () => {},
      };

      result = TestUtils.renderIntoDocument(
        <Stub>
          <Header store={Helper.makeStore()} {...props} />
        </Stub>
      );
    });

    it('renders the header with the correct values', () => {
      const div = TestUtils.findRenderedDOMComponentWithClass(result, 'c-aa-back-btn');
      expect(div.textContent).toContain('arrow_back');
    });

    it('renders the h1 with the correct values', () => {
      const h1 = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
      expect(h1.textContent).toContain(props.title);
      expect(h1.textContent).toContain(props.studentName);
    });

    it('renders the course activities button', () => {
      const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
      expect(button.textContent).toContain('View Course Activities');
    });
  });
});
