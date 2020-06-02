import * as actionType from '../actions/actionTypes';
import { pTableDefaultState } from './defaultState';

export function periodicTable(state = pTableDefaultState, action) {
  switch (action.type) {
    case actionType.ADD_ELEMENT:
      return Object.assign({}, state, {
        selectedElements: state.selectedElements.concat(action.name),
      });
    case actionType.ADD_ELEMENTS:
      return Object.assign({}, state, {
        selectedElements: action.elements,
      });
    case actionType.REMOVE_ELEMENT:
      return Object.assign({}, state, {
        //
      });
    case actionType.RESET_PTABLE:
      return Object.assign({}, state, {
        //
      });
    case actionType.UPDATE_AVAILABLE_ELEMENTS:
      if (action.availableElements === null) {
        return state;
      }
      return Object.assign({}, state, {
        availableElements: action.availableElements,
      });
    case actionType.GET_AVAILABLE_ELEMENTS:
      return Object.assign({}, state, {
        //
      });
    case actionType.GET_SELECTED_ELEMENTS:
      return Object.assign({}, state, {
        //
      });
    default:
      return state;
  }
}
