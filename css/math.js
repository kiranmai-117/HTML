const True = x => y => x;
const False = x => y => y;

const not = x => x(false)(true);
const and = x => y => x(y)(x);
const or = x => y => x(x)(y);

const zero = f => x => x;
const one = f => x => f(x);
const two = f => x => f(f(x));
const three = f => x => f(f(f(x)));

const toInt = n => n(k => k + 1)(0);

// const inc = n => n(k => k + 1)(1);
const inc = n => f => x => f(n(f)(x));

const add = n => m => f => x => m(f)(n(f)(x));

const mul = n => m => f => x => n(f)(x);