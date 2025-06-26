// Safe evaluation function for mathematical expressions
export const evaluate = (expression: string): number => {
  // Replace display operators with JavaScript operators
  const jsExpression = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');
  
  try {
    // Use Function constructor for safer evaluation than eval
    const result = new Function('return ' + jsExpression)();
    
    if (!isFinite(result)) {
      throw new Error('Invalid calculation');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
};

// Format numbers for display
export const formatNumber = (num: number): string => {
  if (!isFinite(num)) {
    return 'Error';
  }
  
  // Handle very large or very small numbers
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  
  // Remove trailing zeros and unnecessary decimal points
  const formatted = parseFloat(num.toPrecision(12)).toString();
  
  // Add thousands separators for large numbers
  if (Math.abs(num) >= 1000 && !formatted.includes('e')) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
  return formatted;
};

// Degree to radian conversion
export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Radian to degree conversion
export const radToDeg = (radians: number): number => {
  return radians * (180 / Math.PI);
};

// Calculate factorial
export const factorial = (n: number): number => {
  if (n < 0) throw new Error('Factorial of negative number');
  if (n === 0 || n === 1) return 1;
  if (n > 170) throw new Error('Number too large for factorial');
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Calculate combinations
export const combination = (n: number, r: number): number => {
  if (r > n || r < 0) throw new Error('Invalid combination parameters');
  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Calculate permutations
export const permutation = (n: number, r: number): number => {
  if (r > n || r < 0) throw new Error('Invalid permutation parameters');
  return factorial(n) / factorial(n - r);
};

// Calculate greatest common divisor
export const gcd = (a: number, b: number): number => {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
};

// Calculate least common multiple
export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

// Check if number is prime
export const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
};

// Convert number to different bases
export const convertBase = (num: number, fromBase: number, toBase: number): string => {
  if (fromBase === 10) {
    return num.toString(toBase).toUpperCase();
  } else {
    const decimal = parseInt(num.toString(), fromBase);
    return decimal.toString(toBase).toUpperCase();
  }
};