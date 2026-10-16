import assert from 'node:assert/strict';
import test from 'node:test';
import { gameReducer, initialState } from './gameState.js';

test('challenge scores are accumulated to cents and hint usage is recorded', () => {
    const next = gameReducer(initialState, {
        type: 'CHALLENGE_COMPLETE',
        payload: { score: 12.345, hintsUsed: 2 },
    });

    assert.equal(next.currentMissionXP, 12.35);
    assert.equal(next.lastXPGain, 12.35);
    assert.equal(next.player.hintsUsed, 2);
});

test('replaying a completed mission does not award its score twice', () => {
    const completed = {
        ...initialState,
        currentMissionXP: 100,
        player: {
            ...initialState.player,
            xp: 100,
            completedMissions: ['mission-1'],
        },
    };
    const replay = gameReducer(completed, {
        type: 'FINISH_MISSION',
        payload: { module: { id: 'mission-1', badgeId: null }, bonusXP: 0 },
    });

    assert.equal(replay.player.xp, 100);
    assert.equal(replay.lastXPGain, 0);
});
