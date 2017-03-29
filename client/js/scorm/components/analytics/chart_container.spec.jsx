import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import _               from 'lodash';
import Stub            from '../../../../specs_support/stub';
import ChartContainer  from './chart_container';

describe('Scorm Analytics ChartContainer', () => {

  let result;
  let props;
  describe('passed charts', () => {
    beforeEach(() => {
      props = {
        selected: 'Passed',
        data: {
          passFail: [],
        },
      };

      result = TestUtils.renderIntoDocument(
        <Stub>
          <ChartContainer {...props} />
        </Stub>
      );
    });

    it('renders a single chart', () => {
      const div = TestUtils.findRenderedDOMComponentWithClass(result, 'recharts-wrapper');
      expect(_.size(div)).toBe(1);
    });
  });

  describe('completed charts', () => {
    beforeEach(() => {
      props = {
        selected: 'Completed',
        data: {
          completed: [],
        },
      };

      result = TestUtils.renderIntoDocument(
        <Stub>
          <ChartContainer {...props} />
        </Stub>
      );
    });

    it('renders a single chart', () => {
      const div = TestUtils.findRenderedDOMComponentWithClass(result, 'recharts-wrapper');
      expect(_.size(div)).toBe(1);
    });
  });

  describe('completed charts', () => {
    beforeEach(() => {
      props = {
        selected: 'Average Score',
        data: {
          scores: [
            {
              name: 'test application',
              value: '12',
            },
          ],
        },
      };

      result = TestUtils.renderIntoDocument(
        <Stub>
          <ChartContainer {...props} />
        </Stub>
      );
    });

    it('renders the scores section with the correct values', () => {
      const div = TestUtils.findRenderedDOMComponentWithClass(result, 'c-aa-label');
      expect(div.textContent).toContain(props.data.scores[0].name);
      expect(div.textContent).toContain(props.data.scores[0].value);
    });
  });
});
