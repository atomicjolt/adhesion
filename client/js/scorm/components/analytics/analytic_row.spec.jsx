import React from 'react';
import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';
import Stub from '../../../../specs_support/stub';
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

      result = TestUtils.renderIntoDocument(
        <Stub>
          <AnalyticRow {...props} />
        </Stub>
      );
    });

    it('renders the analytic row with the correct values', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.textContent).toContain(props.name);
      expect(tr.textContent).toContain(props.passed);
      expect(tr.textContent).toContain(props.score * 100);
      expect(tr.textContent).toContain(`${props.time}s`);
    });

    it('renders the correct amount of table rows', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.classList.length).toEqual(3);
    });

    it('renders the table row with the correct cursor', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.style.cursor).toEqual('pointer');
    });

    it('renders the table column with the correct padding left value', () => {
      const tds =  TestUtils.scryRenderedDOMComponentsWithTag(result, 'td');
      const totalDepth = 2 * props.depth;
      expect(tds[0].style.paddingLeft).toEqual(`${totalDepth + 4}rem`);
    });

    it('renders the icon with the correct style values', () => {
      const icon =  TestUtils.findRenderedDOMComponentWithTag(result, 'i');
      const totalDepth = 2 * props.depth;
      expect(icon.textContent).toContain('arrow_drop_down');
      expect(icon.style.left).toEqual(`${totalDepth + 1.3}rem`);
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

      result = TestUtils.renderIntoDocument(
        <Stub>
          <AnalyticRow {...props} />
        </Stub>
      );
    });

    it('renders the table row with the correct values', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.textContent).toContain('N/A');
      expect(tr.textContent).toContain(`${_.ceil(props.time / 60)}m`);
    });

    it('renders the table row with the correct amount of rows', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.classList.length).toEqual(1);
    });

    it('renders the table row with the correct display values', () => {
      const tr =  TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
      expect(tr.style.display).toEqual('none');
    });

    it('renders the table column with the correct style values', () => {
      const tds =  TestUtils.scryRenderedDOMComponentsWithTag(result, 'td');
      const totalDepth = 2 * props.depth;
      expect(tds[0].style.paddingLeft).toEqual(`${totalDepth + 4}rem`);
    });

    it('renders the icon with no values', () => {
      const icons =  TestUtils.scryRenderedDOMComponentsWithTag(result, 'i');
      expect(icons.length).toBe(0);
    });
  });
});
