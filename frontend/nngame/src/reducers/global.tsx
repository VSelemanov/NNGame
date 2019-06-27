const globalState = {
  appToken: 'b31b0794-d789-48db-a112-b2232932e024',
  isAdmin: false,
};


export const globalReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case 'authentication': {
      return { ...state, refreshToken: action.refreshToken, isLogin: true };
    }
    case 'getAdmins': {
      return { ...state, adminList: action.adminList };
    }
    case 'updateOneState':
      return { ...state, [action.payload_state]: action.payload };
    default: return state;
  }
}
