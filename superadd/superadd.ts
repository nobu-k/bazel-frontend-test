import { add } from 'myspace/add';
import { hello } from 'myspace/lib/hello';

export const superadd = (a: number, b: number) => [add(a, b), hello()];
