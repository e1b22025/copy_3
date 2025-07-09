
const initialState = {
    hintsTabVisible: false
};

const tabReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ACTIVATE_HINTS_TAB':
            return {
                ...state,
                hintsTabVisible: true
            };
        default:
            return state;
    }
};
export const ACTIVATE_HINTS_TAB = 'ACTIVATE_HINTS_TAB';

export const onActivateHintsTab = () => ({
    type:ACTIVATE_HINTS_TAB
});
export default tabReducer;
