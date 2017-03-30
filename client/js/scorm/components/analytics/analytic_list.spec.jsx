import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Stub from '../../../../specs_support/stub';
import Helper from '../../../../specs_support/helper';
import AnalyticList from './analytic_list';

describe('Scorm Analytics AnalyticList', () => {

  let result;
  let props;

  describe('Scorm Analytics AnalyticList', () => {
    beforeEach(() => {
      props = {
        tableData: [],
        switchView: () => {},
      };
      result = TestUtils.renderIntoDocument(
        <Stub>
          <AnalyticList store={Helper.makeStore()} {...props} />
        </Stub>
      );
    });

    it('renders the analytics list with the correct header value', () => {
      const table =  TestUtils.findRenderedDOMComponentWithClass(result, 'c-aa-table');
      expect(table.textContent).toContain('Student');
    });

    it('renders the table rows with the correct amount of rows', () => {
      const trs =  TestUtils.scryRenderedDOMComponentsWithTag(result, 'tr');
      expect(trs.length).toBe(1);
    });
  });

  describe('Scorm Analytics AnalyticList', () => {
    beforeEach(() => {
      props = {
        tableData: [
          {
            id: 1,
            name: 'test activity',
            passed: 'Passed',
            score: 0.12,
            time: 122,
            show: true,
            isParent: true,
            depth: 4,
          },
          {
            id: 2,
            name: 'test activity 2',
            passed: 'Passed',
            score: 0.52,
            time: 59,
            show: false,
            isParent: false,
            depth: 2,
          },
        ],
        switchView: () => {},
      };
      result = TestUtils.renderIntoDocument(
        <Stub>
          <AnalyticList store={Helper.makeStore()} {...props} />
        </Stub>
      );
    });

    it('renders the table rows with the correct amount of rows', () => {
      const trs =  TestUtils.scryRenderedDOMComponentsWithTag(result, 'tr');
      expect(trs.length).toBe(3);
    });
  });
});
