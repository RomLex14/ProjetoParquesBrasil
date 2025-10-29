// lib/gamification.ts

export const MAX_LEVEL = 10;
export const XP_PER_PLANNED_ROUTE = 1;
export const XP_PER_RECORDED_ROUTE = 1.5;

export const levelThresholds: number[] = [
    0,    // Nível 1
    5,    // Nível 2
    15,   // Nível 3
    30,   // Nível 4
    50,   // Nível 5
    75,   // Nível 6
    105,  // Nível 7
    140,  // Nível 8
    180,  // Nível 9
    225   // Nível 10 
];

export function calculateLevel(xp: number): number {
    for (let level = MAX_LEVEL; level >= 1; level--) {
        
        if (xp >= levelThresholds[level - 1]) {
            return level;
        }
    }
    return 1;
}

export function getXpForLevel(level: number): number {
    const clampedLevel = Math.max(1, Math.min(level, MAX_LEVEL));
    return levelThresholds[clampedLevel - 1];
}

export function getXpForNextLevel(currentLevel: number): number {
    if (currentLevel >= MAX_LEVEL) {
       
        return levelThresholds[MAX_LEVEL - 1];
    }
    
    return levelThresholds[currentLevel];
}

export function calculateProgressPercentage(currentXp: number, currentLevel: number): number {
    if (currentLevel >= MAX_LEVEL) {
        return 100;
    }
    const xpForCurrent = getXpForLevel(currentLevel); 
    const xpForNext = getXpForNextLevel(currentLevel); 
    const xpNeededForLevel = xpForNext - xpForCurrent; 

   
    if (xpNeededForLevel <= 0) {
        return (currentXp >= xpForNext) ? 100 : 0;
    }

    const xpGainedInLevel = currentXp - xpForCurrent; // XP ganho dentro do nível atual
    const percentage = (xpGainedInLevel / xpNeededForLevel) * 100;

    return Math.max(0, Math.min(percentage, 100)); 
}