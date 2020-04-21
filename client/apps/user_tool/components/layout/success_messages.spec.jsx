import React from 'react';
import { shallow } from 'enzyme';

import { SuccessMessages } from './success_messages';

describe('SuccessMessages', () => {
  const props = {
    messages: ['User updated successfully.'],
  };

  it('renders the messages', () => {
    const successMessages = shallow(<SuccessMessages
      messages={props.messages}
    />);

    expect(successMessages).toMatchSnapshot();
  });

  describe('when there are no messages', () => {
    it('renders nothing', () => {
      const successMessages = shallow(<SuccessMessages
        messages={[]}
      />);

      expect(successMessages.html()).toEqual(null);
    });
  });
});
