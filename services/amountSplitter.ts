
const MAX_SPLIT_VALUE = 99999;

export function splitAmount(totalAmount: number): number[] {
  if (totalAmount <= 0) {
    return [];
  }
  
  // Format to 2 decimal places to handle floating point inputs correctly
  const formattedTotal = parseFloat(totalAmount.toFixed(2));

  if (formattedTotal <= MAX_SPLIT_VALUE) {
    return [formattedTotal];
  }

  const numParts = Math.ceil(formattedTotal / MAX_SPLIT_VALUE);
  const amounts: number[] = [];

  // Use cents to avoid floating point inaccuracies during calculation
  const totalInCents = Math.round(formattedTotal * 100);
  const baseAmountInCents = Math.floor(totalInCents / numParts);
  let remainderInCents = totalInCents % numParts;

  for (let i = 0; i < numParts; i++) {
    let partInCents = baseAmountInCents;
    if (remainderInCents > 0) {
      partInCents++;
      remainderInCents--;
    }
    amounts.push(partInCents);
  }

  // Make parts unequal by shifting value between pairs
  if (numParts > 1) {
    for (let i = 0; i < Math.floor(numParts / 2); i++) {
      const partnerIndex = numParts - 1 - i;
      
      // Shift up to 15% of the part's value, with a minimum of 1000 cents (BRL 10)
      const maxShift = Math.floor(amounts[i] * 0.15);
      const minShift = 1000;
      let shiftInCents = Math.floor(Math.random() * (maxShift - minShift + 1)) + minShift;
      
      // Ensure the shift doesn't make a value too small or negative
      if (amounts[i] > shiftInCents) {
          amounts[i] -= shiftInCents;
          amounts[partnerIndex] += shiftInCents;
      }
    }
  }

  // Convert back to BRL from cents
  const finalAmounts = amounts.map(cents => parseFloat((cents / 100).toFixed(2)));

  // Shuffle the array to make the order less predictable
  for (let i = finalAmounts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalAmounts[i], finalAmounts[j]] = [finalAmounts[j], finalAmounts[i]];
  }

  return finalAmounts;
}
