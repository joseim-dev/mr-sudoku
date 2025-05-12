// utils/reward.ts

export const calculateReward = (
  difficulty: string,
  mistakeCount: number
): { exp: number; coins: number } => {
  const coinTable: Record<string, number> = {
    easy: 5,
    normal: 7,
    medium: 10,
    hard: 15,
    extreme: 20,
    master: 25,
  };

  const expTable: Record<string, number> = {
    easy: 10,
    normal: 20,
    medium: 40,
    hard: 60,
    extreme: 80,
    master: 100,
  };

  const baseCoins = coinTable[difficulty] || 5;
  const baseExp = expTable[difficulty] || 10;

  let multiplier = 1;
  if (mistakeCount === 0) multiplier = 2;
  else if (mistakeCount === 1) multiplier = 1.5;
  else if (mistakeCount === 2) multiplier = 1.2;

  return {
    coins: Math.floor(baseCoins * multiplier),
    exp: baseExp,
  };
};
