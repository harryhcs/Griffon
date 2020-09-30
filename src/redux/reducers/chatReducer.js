const initialState = {
  showConversations: false,
  showConversation: false,
  conversationId: null,
};
const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_CONVERSATIONS": {
      return {
        ...state,
        showConversations: !state.showConversations,
      };
    }
    case "TOGGLE_CONVERSATION": {
      return {
        ...state,
        showConversation: !state.showConversation,
      };
    }
    case "SET_CONVERSATION": {
      return {
        ...state,
        conversationId: action.payload.id,
      };
    }
    default: {
      return state;
    }
  }
};
export default mapReducer;
