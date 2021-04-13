import React from 'react';
import { add } from 'myspace/add';

interface Props {
  a: number;
  b: number;
}
export const Add: React.FC<Props> = props => {
  const { a, b } = props;
  return <div>
    a + b = {a} + {b} = {add(a, b)}
  </div>;
};
