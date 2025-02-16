export function calculateChiSquare(simData, lambda) {
    const frequencies = simData.reduce((acc, patient) => {
      const arrivals = Math.floor(patient.arrival_time);
      acc[arrivals] = (acc[arrivals] || 0) + 1;
      return acc;
    }, {});
    const totalObservations = simData.length;
    const chiSquareValues = Object.keys(frequencies).map((key) => {
      const observed = frequencies[key];
      const expected = (Math.pow(lambda, key) * Math.exp(-lambda)) / factorial(key) * totalObservations;
      const chiSquare = Math.pow(observed - expected, 2) / expected;
      return { key, observed, expected, chiSquare };
    });
    return chiSquareValues;
  }
 
  function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
  }
 