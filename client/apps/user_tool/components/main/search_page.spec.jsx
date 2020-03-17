import React from 'react';
import { shallow } from 'enzyme';

import { SearchPage } from './search_page';

describe('SearchPage', () => {
  const props = {
    searchForAccountUsers: () => {},
    matchingUsers: [
      {
        id: 1,
        sortable_name: 'Washington, George',
        email: 'countryfather@revolution.com',
        roles: ['admin', 'teacher'],
        login_id: 'countryfather@revolution.com',
        sis_user_id: 'george_123',
      },
      {
        id: 2,
        sortable_name: 'Jefferson, Thomas',
        email: 'idodeclare@revolution.com',
        roles: ['teacher'],
        login_id: 'idodeclare@revolution.com',
        sis_user_id: 'thomas_123',
      }
    ],
    lmsAccountId: '1',
    previousPage: '2',
    nextPage: '4',
  };

  it('renders the search page', () => {
    const result = shallow(<SearchPage
      matchingUsers={props.matchingUsers}
      searchForAccountUsers={props.searchForAccountUsers}
      lmsAccountId={props.lmsAccountId}
      previousPage={props.previousPage}
      nextPage={props.nextPage}
    />);

    expect(result).toMatchSnapshot();
  });

  describe('when the user submits a search', () => {
    it('submits a search request', () => {
      spyOn(props, 'searchForAccountUsers');
      const searchTerm = 'student name';
      const result = shallow(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        lmsAccountId={props.lmsAccountId}
      />);

      result.find('input').simulate('change', { target: { value: searchTerm } });
      result.find('button[type="submit"]').simulate('click');

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        props.lmsAccountId,
        searchTerm,
      );
    });

    describe('when the user submits a search with less than 3 characters', () => {
      it('does not submit the search', () => {
        spyOn(props, 'searchForAccountUsers');
        const searchTerm = 'jo';
        const result = shallow(<SearchPage
          matchingUsers={props.matchingUsers}
          searchForAccountUsers={props.searchForAccountUsers}
          lmsAccountId={props.lmsAccountId}
        />);

        result.find('input').simulate('change', { target: { value: searchTerm } });
        result.find('button[type="submit"]').simulate('click');

        expect(props.searchForAccountUsers).not.toHaveBeenCalledWith(
          props.lmsAccountId,
          searchTerm,
        );
      });
    });
  });
});
