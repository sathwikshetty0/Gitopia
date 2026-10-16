export function calculateChallengeScore(missionXP, challengeXP, totalChallengeXP, errors, hints, timeSeconds) {
    if (missionXP < 0 || challengeXP < 0 || totalChallengeXP <= 0) {
        throw new RangeError('Mission and challenge XP values must be non-negative, with a positive total.');
    }

    const max = missionXP * challengeXP / totalChallengeXP;
    const errorPenalty = errors * 5;
    const hintPenalty = hints * 10;
    const timePenalty = Math.floor(timeSeconds / 30) * 2;
    const score = Math.max(0, Math.min(max, max - errorPenalty - hintPenalty - timePenalty));

    return {
        score,
        max,
        breakdown: { errorPenalty, hintPenalty, timePenalty },
    };
}
