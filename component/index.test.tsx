import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Add } from 'myspace/component';

test("add", () => {
  const { getByText } = render(<Add a={1} b={2} />);
  expect(getByText('a + b = 1 + 2 = 3')).not.toBeNull();
});
