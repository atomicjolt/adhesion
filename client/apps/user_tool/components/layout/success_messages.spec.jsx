import React from 'react';
import { shallow } from 'enzyme';

import { SuccessMessages } from './success_messages';

describe('SuccessMessages', () => {
  const props = {
    clearSuccessMessages: () => {},
    messages: ['User updated successfully.'],
  };

  it('renders the messages', () => {
    const successMessages = shallow(<SuccessMessages
      clearSuccessMessages={props.clearSuccessMessages}
      messages={props.messages}
    />);

    expect(successMessages).toMatchSnapshot();
  });

  describe('when there are no messages', () => {
    it('only renders the outer div', () => {
      const successMessages = shallow(<SuccessMessages
        clearSuccessMessages={props.clearSuccessMessages}
        messages={[]}
      />);

      expect(successMessages).toMatchSnapshot();
    });
  });
});
