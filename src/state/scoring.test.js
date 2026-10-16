import assert from 'node:assert/strict';
import test from 'node:test';
import { MODULES } from '../data/gameData.js';
import { calculateChallengeScore } from './scoring.js';

test('distributes the mission reward according to challenge weights', () => {
    const first = calculateChallengeScore(100, 30, 140, 0, 0, 0);
    const second = calculateChallengeScore(100, 40, 140, 0, 0, 0);

    assert.equal(first.max, 100 * 30 / 140);
    assert.equal(second.max, 100 * 40 / 140);
    assert.equal(first.score + second.score, 50);
});

test('applies error, hint, and elapsed-time penalties', () => {
    const result = calculateChallengeScore(200, 50, 100, 2, 1, 61);

    assert.equal(result.score, 76);
    assert.deepEqual(result.breakdown, {
        errorPenalty: 10,
        hintPenalty: 10,
        timePenalty: 4,
    });
});

test('a perfect run earns exactly each advertised mission reward', () => {
    let allMissionXP = 0;

    for (const mission of MODULES) {
        const totalChallengeXP = mission.challenges.reduce((total, challenge) => total + challenge.xp, 0);
        const missionXP = mission.challenges.reduce((total, challenge) => (
            total + calculateChallengeScore(
                mission.rewardXP,
                challenge.xp,
                totalChallengeXP,
                0,
                0,
                0,
            ).score
        ), 0);

        assert.equal(Math.round(missionXP * 100) / 100, mission.rewardXP, mission.id);
        allMissionXP += missionXP;
    }

    assert.equal(Math.round(allMissionXP * 100) / 100, 2450);
});

test('never awards more than the allocation or less than zero', () => {
    assert.equal(calculateChallengeScore(100, 1, 10, 0, 0, 0).score, 10);
    assert.equal(calculateChallengeScore(100, 1, 10, 100, 100, 300).score, 0);
    const fractionalAllocation = calculateChallengeScore(100, 30, 140, 0, 0, 0);
    assert.ok(fractionalAllocation.score <= fractionalAllocation.max);
});

test('rejects a mission with no challenge weight', () => {
    assert.throws(
        () => calculateChallengeScore(100, 0, 0, 0, 0, 0),
        { name: 'RangeError' },
    );
});
