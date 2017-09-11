import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import AnalyticRow from './analytic_row';

describe('Scorm Analytics AnalyticRow', () => {

  let result;
  let props;
  describe('first example', () => {
    beforeEach(() => {
      props = {
        id: 1,
        name: 'test application',
        passed: 'Passed',
        score: 0.12,
        time: 59,
        isParent: true,
        show: true,
        depth: 2,
        tableRowClicked: () => {},
      };

      result = shallow(<AnalyticRow {...props} />);
    });

    it('renders', () => {
      expect(result).toMatchSnapshot();
    });

    it('renders the analytic row with the correct values', () => {
      const tr = result.find('.c-aa-row');
      expect(tr).toBeDefined();
      expect(tr.text()).toContain(props.name);
      expect(tr.text()).toContain(props.passed);
      expect(tr.text()).toContain(props.score * 100);
      expect(tr.text()).toContain(`${props.time}s`);
    });

    it('renders the correct amount of table rows', () => {
      const tr = result.find('tr');
      expect(tr.hasClass('c-aa-row c-aa-accordion is-open')).toBeTruthy();
    });
  });

  describe('second example', () => {
    beforeEach(() => {
      props = {
        id: 1,
        name: 'test application',
        passed: 'Failed',
        score: null,
        time: 112,
        isParent: false,
        show: false,
        depth: 3,
        tableRowClicked: () => {},
      };

      result = shallow(<AnalyticRow {...props} />);
    });

    it('renders the table row with the correct values', () => {
      const tr = result.find('tr');
      expect(tr.text()).toContain('N/A');
      expect(tr.text()).toContain(`${_.ceil(props.time / 60)}m`);
    });

    it('renders the table row with the correct amount of rows', () => {
      const tr = result.find('tr');
      expect(tr.hasClass('c-aa-row')).toBeTruthy();
      expect(tr.hasClass('c-aa-row c-aa-accordion is-open')).toBeFalsy();
    });

    it('renders the icon with no values', () => {
      const icons = result.find('i');
      expect(icons.length).toBe(0);
    });
  });
});
