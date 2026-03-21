// ============================================================
//  Gitopia — Game State (useReducer)
// ============================================================
export const initialState = {
    view: 'dashboard',        // 'dashboard' | 'mission' | 'profile' | 'reference'
    activeMissionId: null,
    missionPhase: 'briefing', // 'briefing' | 'challenge' | 'reward'
    activeChallengeIndex: 0,
    player: {
        username: 'Hacker',
        avatar: '👾',
        xp: 0,
        streak: 3,
        completedMissions: [],
        badges: [],
        email: '',
        gitProfile: '',
        totalCommandsRun: 0,
        hintsUsed: 0,
    },
    currentMissionXP: 0,      // XP accumulated in current mission run
    earnedBadge: null,        // badge just unlocked (for animation)
    lastXPGain: 0,
};

export function gameReducer(state, action) {
    switch (action.type) {

        case 'START_MISSION':
            return {
                ...state,
                view: 'mission',
                activeMissionId: action.payload,
                missionPhase: 'briefing',
                activeChallengeIndex: 0,
                currentMissionXP: 0,
                earnedBadge: null,
                lastXPGain: 0,
            };

        case 'BEGIN_CHALLENGES':
            return { ...state, missionPhase: 'challenge' };

        case 'CHALLENGE_COMPLETE': {
            const gained = action.payload;  // XP for this challenge
            return {
                ...state,
                currentMissionXP: state.currentMissionXP + gained,
                lastXPGain: gained,
                player: {
                    ...state.player,
                    totalCommandsRun: state.player.totalCommandsRun + 1,
                },
            };
        }

        case 'NEXT_CHALLENGE':
            return {
                ...state,
                activeChallengeIndex: state.activeChallengeIndex + 1,
                lastXPGain: 0,
            };

        case 'FINISH_MISSION': {
            const { module, bonusXP } = action.payload;
            const isReplay = state.player.completedMissions.includes(module.id);
            
            // Only add XP if it's the first time completing this mission
            const totalXP = state.currentMissionXP + bonusXP;
            const newXP = isReplay ? state.player.xp : state.player.xp + totalXP;

            const newCompleted = isReplay
                ? state.player.completedMissions
                : [...state.player.completedMissions, module.id];

            const isNewBadge = module.badgeId && !state.player.badges.includes(module.badgeId);
            const newBadges = isNewBadge
                ? [...state.player.badges, module.badgeId]
                : state.player.badges;

            const earnedBadge = isNewBadge ? module.badgeId : null;

            return {
                ...state,
                missionPhase: 'reward',
                earnedBadge,
                lastXPGain: isReplay ? 0 : totalXP, // Show 0 in reward screen for replay
                player: {
                    ...state.player,
                    xp: newXP,
                    completedMissions: newCompleted,
                    badges: newBadges,
                },
            };
        }

        case 'USE_HINT':
            return {
                ...state,
                player: { ...state.player, hintsUsed: state.player.hintsUsed + 1 },
            };

        case 'RETURN_TO_DASHBOARD':
            return { ...state, view: 'dashboard', activeMissionId: null, missionPhase: 'briefing' };

        case 'SET_VIEW':
            return { ...state, view: action.payload };

        case 'UPDATE_PLAYER_NAME':
            return { ...state, player: { ...state.player, username: action.payload } };

        case 'UPDATE_AVATAR':
            return { ...state, player: { ...state.player, avatar: action.payload } };

        case 'UPDATE_PLAYER_INFO':
            return {
                ...state,
                player: {
                    ...state.player,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}
