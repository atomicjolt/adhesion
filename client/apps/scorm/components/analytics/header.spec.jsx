import React from 'react';
import { shallow } from 'enzyme';
import { Header } from './header';

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

      result = shallow(<Header {...props} />);
    });

    it('renders', () => {
      expect(result).toMatchSnapshot();
    });

    it('renders the header with the correct values', () => {
      const div = result.find('.c-aa-back-btn i');
      expect(div.text()).toContain('arrow_back');
    });

    it('renders the h1 with the correct values', () => {
      const h1 = result.find('h1');
      expect(h1.text()).toContain(props.title);
      expect(h1.text()).toContain(props.studentName);
    });

    it('renders the course activities button', () => {
      const button = result.find('button');
      expect(button.text()).toContain('View Course Activities');
    });
  });
});
