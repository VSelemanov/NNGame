const globalState = {
  appToken: 'b31b0794-d789-48db-a112-b2232932e024',
  isAdmin: false,
  isLogin: false,
  available: 0,
  isTimerStarted: false,
  currentPart: 1,
  gameStatus: {
    gameMap:{},
    isActive: false,
    isStarted: false,
    part1:[],
    teams: []
  }
};


export const globalReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case 'updateOneState':
      return { ...state, [action.payload_state]: action.payload };
    default: return state;
  }
}
