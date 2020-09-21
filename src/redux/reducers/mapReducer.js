const initialState = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -32.9643724,
    longitude: 18.6221071,
    zoom: 10,
  },
};
const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_VIEWSTATE': {
      return {...state.viewport,
        viewport: {...state.viewport, ...action.payload}
      }
    }
    default: {
      return state;
    }
  }
};
export default mapReducer;
