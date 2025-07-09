
import { combineReducers } from 'redux';
import tabReducer from './tab'; // ← 追加

const reducer = combineReducers({
    // 他の reducer...
    tab: tabReducer // ← 追加
});

export default reducer;
