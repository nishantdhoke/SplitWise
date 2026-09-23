/**
 * Split Calculation Service
 * 
 * Provides robust mathematical algorithms for expense splitting.
 * To eliminate floating-point currency discrepancies (e.g. ₹100 split 3 ways becoming ₹99.99),
 * all financial calculations are performed in integer paise (1 INR = 100 Paise).
 */

/**
 * Converts INR rupees to integer paise
 * @param {number|string} rupees 
 * @returns {number}
 */
const toPaise = (rupees) => {
  return Math.round(parseFloat(rupees) * 100);
};

/**
 * Converts integer paise back to INR rupees with 2 decimal places
 * @param {number} paise 
 * @returns {number}
 */
const toRupees = (paise) => {
  return parseFloat((paise / 100).toFixed(2));
};

/**
 * Calculates Equal Split among participants.
 * Handles remainder paise by distributing leftover 1-paise units among participants
 * so that the sum of shares STRICTLY equals the total amount.
 * 
 * Example: ₹100.00 split among 3 people:
 * Base share = 3333 paise (₹33.33)
 * Remainder = 1 paise
 * Participant 1 gets ₹33.34, Participants 2 & 3 get ₹33.33 each.
 * Sum = ₹33.34 + ₹33.33 + ₹33.33 = ₹100.00
 * 
 * @param {number} totalAmountRupees 
 * @param {Array<number>} participantUserIds 
 * @returns {Array<{ userId: number, shareAmount: number, sharePercentage: number }>}
 */
const calculateEqualSplit = (totalAmountRupees, participantUserIds) => {
  if (!participantUserIds || participantUserIds.length === 0) {
    throw new Error('At least one participant is required for equal split');
  }

  const totalPaise = toPaise(totalAmountRupees);
  const count = participantUserIds.length;

  const baseSharePaise = Math.floor(totalPaise / count);
  let remainderPaise = totalPaise % count;

  const basePercentage = parseFloat((100 / count).toFixed(2));

  return participantUserIds.map((userId, index) => {
    // Distribute 1 extra paise to early participants until remainder is exhausted
    const extraPaise = index < remainderPaise ? 1 : 0;
    const sharePaise = baseSharePaise + extraPaise;

    return {
      userId,
      shareAmount: toRupees(sharePaise),
      sharePercentage: basePercentage,
    };
  });
};

/**
 * Validates and formats Custom Amount Split.
 * Ensures the sum of custom amounts equals the total expense amount.
 * 
 * @param {number} totalAmountRupees 
 * @param {Array<{ userId: number, amount: number }>} shares 
 * @returns {Array<{ userId: number, shareAmount: number, sharePercentage: number|null }>}
 */
const calculateCustomSplit = (totalAmountRupees, shares) => {
  if (!shares || shares.length === 0) {
    throw new Error('Custom split requires amounts for each participant');
  }

  const totalPaise = toPaise(totalAmountRupees);
  let sumSharesPaise = 0;

  const results = shares.map((item) => {
    const amountNum = parseFloat(item.amount);
    if (isNaN(amountNum) || amountNum < 0) {
      throw new Error(`Invalid amount provided for participant ID ${item.userId}`);
    }

    const sharePaise = toPaise(amountNum);
    sumSharesPaise += sharePaise;

    const percentage = totalPaise > 0
      ? parseFloat(((sharePaise / totalPaise) * 100).toFixed(2))
      : 0;

    return {
      userId: item.userId,
      shareAmount: toRupees(sharePaise),
      sharePercentage: percentage,
    };
  });

  // Verify exact match in paise
  if (sumSharesPaise !== totalPaise) {
    const diff = toRupees(Math.abs(totalPaise - sumSharesPaise));
    const direction = sumSharesPaise > totalPaise ? 'exceeds' : 'is less than';
    throw new Error(
      `Sum of custom shares (₹${toRupees(sumSharesPaise)}) ${direction} the total expense (₹${totalAmountRupees}) by ₹${diff}`
    );
  }

  return results;
};

/**
 * Calculates Percentage Split.
 * Validates that percentages sum to exactly 100%.
 * Converts to paise and distributes any fractional rounding remainder.
 * 
 * @param {number} totalAmountRupees 
 * @param {Array<{ userId: number, percentage: number }>} percentages 
 * @returns {Array<{ userId: number, shareAmount: number, sharePercentage: number }>}
 */
const calculatePercentageSplit = (totalAmountRupees, percentages) => {
  if (!percentages || percentages.length === 0) {
    throw new Error('Percentage split requires percentage values for each participant');
  }

  // Validate percentages sum to 100
  const totalPercent = percentages.reduce((acc, curr) => acc + parseFloat(curr.percentage || 0), 0);
  if (Math.abs(totalPercent - 100) > 0.01) {
    throw new Error(`Total percentage must equal exactly 100% (currently ${totalPercent.toFixed(2)}%)`);
  }

  const totalPaise = toPaise(totalAmountRupees);
  let allocatedPaise = 0;

  const rawShares = percentages.map((item) => {
    const pct = parseFloat(item.percentage);
    const calculatedPaise = Math.floor((totalPaise * pct) / 100);
    allocatedPaise += calculatedPaise;
    return {
      userId: item.userId,
      sharePaise: calculatedPaise,
      percentage: pct,
    };
  });

  // Distribute remaining rounding paise (if any)
  let remainderPaise = totalPaise - allocatedPaise;
  for (let i = 0; i < rawShares.length && remainderPaise > 0; i++) {
    rawShares[i].sharePaise += 1;
    remainderPaise -= 1;
  }

  return rawShares.map((item) => ({
    userId: item.userId,
    shareAmount: toRupees(item.sharePaise),
    sharePercentage: item.percentage,
  }));
};

module.exports = {
  toPaise,
  toRupees,
  calculateEqualSplit,
  calculateCustomSplit,
  calculatePercentageSplit,
};
