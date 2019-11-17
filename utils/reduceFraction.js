const reduceFraction = (numerator, denominator) => {
  let gcd = function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  };
  gcd = gcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
};
module.exports = reduceFraction;
