export const mathHelpers = {

  digits,
  
  primeFactors,
  greatestCommonFactor,
  leastCommonMultiple,

} as const;

//return number of digits in an integer
// fails for a float
function digits(int: number) {
  if (isNaN(int)) { return 0; }
  else if (int < 0) {
    return digits(Math.abs(int));
  }
  //else
  return int.toString().length;

  //alt (maybe faster) 
  // https://stackoverflow.com/a/14879700
  // return Math.log(int) * Math.LOG10E + 1 | 0; 
}

function primeFactors(n: number) {
  //require integer
  if (!Number.isInteger(n)) { throw new Error(`Error calculating prime factors of ${n} - not an integer`); }
  const original = n; //save

  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
      if (!Number.isInteger(n)) { throw new Error(`Error calculating prime factors of ${original} - ${n} is not an integer`); }
    } else {
      divisor++;
    }
  }
  return factors;
}

function greatestCommonFactor(...values: number[]): number {
  if (values.length === 0) { throw new Error(`Unable to calculate the GCF of no numbers}`); }
  if (values.length === 1) { throw new Error(`Unable to calculate the GCF of a single number: ${values[0]}`); }
  else if (values.length === 2) {
    const [a,b] = values;
    return a ? greatestCommonFactor(b % a, a) : b;
  }
  //else
  const first = values.shift();
  return greatestCommonFactor(first, greatestCommonFactor(...values));
}

function leastCommonMultiple(...values: number[]): number {
  if (values.length === 0) { throw new Error(`Unable to calculate the LCM of no numbers}`); }
  if (values.length === 1) { throw new Error(`Shouldn't need to calculate the LCM of a single number: ${values[0]}`); }
  else if (values.length === 2) {
    const [a,b] = values;
    return a * b / greatestCommonFactor(a, b);
  }
  //else
  return values.reduce((a, b) => leastCommonMultiple(a,b), 1);
}
