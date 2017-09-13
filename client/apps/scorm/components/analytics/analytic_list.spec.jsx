import React from 'react';
import { shallow } from 'enzyme';
import { AnalyticList } from './analytic_list';

describe('Scorm Analytics AnalyticList', () => {

  let result;
  let props;

  describe('Scorm Analytics AnalyticList', () => {
    beforeEach(() => {
      props = {
        tableData: [],
        view: 'course',
        switchView: () => {},
      };
      result = shallow(<AnalyticList {...props} />);
    });

    it('renders', () => {
      expect(result).toMatchSnapshot();
    });

    it('renders the analytics list with the correct header value', () => {
      const table = result.find('.c-aa-table th').first();
      expect(table.text()).toContain('Student');
    });

    it('renders the analytics list with the correct header value', () => {
      props.view = '';
      result = shallow(<AnalyticList {...props} />);
      const table = result.find('.c-aa-table th').first();
      expect(table.text()).toContain('Activity');
    });

    it('renders the table rows with the correct amount of rows', () => {
      const trs = result.find('.c-aa-table tr');
      expect(trs.length).toBe(1);
    });
  });
});
