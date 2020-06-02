import axios from 'axios';
import * as actionType from './actionTypes';
import store from '../store/store';

// **************************************
//     Periodic table action creators
// **************************************

const URL_ROOT = 'http://aflowlib.duke.edu/API/chull'; // 'http://127.0.0.1:5000';
// const URL_ROOT = 'http://127.0.0.1:80';

export function addElement(name) {
  return {
    type: actionType.ADD_ELEMENT,
    name,
  };
}

export function addElements(elements) {
  return {
    type: actionType.ADD_ELEMENTS,
    elements,
  };
}

export function removeElement(name) {
  return {
    type: actionType.REMOVE_ELEMENT,
    name,
  };
}

export function reset() {
  return {
    type: actionType.RESET_PTABLE,
  };
}

export function updateAvailableElements(availableElements) {
  return {
    type: actionType.UPDATE_AVAILABLE_ELEMENTS,
    availableElements,
  };
}

export function getAvailableElements() {
  return {
    type: actionType.GET_AVAILABLE_ELEMENTS,
  };
}

export function getSelectedElements() {
  return {
    type: actionType.GET_SELECTED_ELEMENTS,
  };
}

/*
function convertAvailableToObj(data) {
  return data.reduce((o, i) => {
    o[i] = true;
    return o;
  }, {});
}
*/

// **************************************
//              Thunks
// **************************************

export function fetchAvailableElements() {
  return (dispatch) => {
    // let url = `${URL_ROOT}/api/v2/availability/`;
    let url = `${URL_ROOT}/availability/`; // AFLOW direct
    if (store.getState().periodicTable.selectedElements.length === 3) {
      // url = `${URL_ROOT}/api/v2/availability/unavailable`;
      url = `${URL_ROOT}/availability/?q=unavailable`; // AFLOW direct
    } else if (store.getState().periodicTable.selectedElements.length <= 2 && store.getState().periodicTable.selectedElements.length > 0) {
      /*
      url = `${URL_ROOT}/api/v2/availability/${store
        .getState()
        .periodicTable.selectedElements.join('')}`;
      */

      url = `${URL_ROOT}/availability/?q=${store
      .getState()
      .periodicTable.selectedElements.join('')}`; // AFLOW direct
    }
    return axios.get(url).then((res) => {
      dispatch(
        updateAvailableElements(
          res.data,
          // convertAvailableToObj(res.data)
        ),
      );
    });
  };
}
