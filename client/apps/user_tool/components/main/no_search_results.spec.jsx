import React from 'react';
import { shallow } from 'enzyme';

import NoSearchResults from './no_search_results';

describe('NoSearchResults', () => {
  it('renders the no search results section', () => {
    const result = shallow(<NoSearchResults searchTerm="some search" />);

    expect(result).toMatchSnapshot();
  });
});
