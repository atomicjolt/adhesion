import React from 'react';
import { render } from 'enzyme';
import PdfDisplay from './pdf_display';

describe('applications form', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      pdfDownloadUrl: null,
    };

    result = render(<PdfDisplay {...props} />);
  });

  it('renders', () => {
    expect(result).toBeDefined();
  });

  it('renders the loading screen', () => {
    expect(result.text()).toContain('Loading');
  });
});
