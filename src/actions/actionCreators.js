import * as actionType from './actionTypes';

// **************************************
//      Entry table action creators
// **************************************
export function addEntry(auid) {
  return {
    type: actionType.ADD_ENTRY,
    auid,
  };
}

export function addEntries(auids) {
  return {
    type: actionType.ADD_ENTRIES,
    auids,
  };
}

export function removeEntry(auid) {
  return {
    type: actionType.REMOVE_ENTRY,
    auid,
  };
}

// **************************************
//      Hull table action creators
// **************************************
export function addHull(name) {
  return {
    type: actionType.ADD_HULL,
    name,
  };
}
export function resizeHullAxes(name, yMin, yMax) {
  return {
    type: actionType.RESIZE_HULL_AXES,
    name,
    yMin,
    yMax,
  };
}

export function setPointsVisibility(name, isVisible) {
  return {
    type: actionType.SET_POINTS_VISIBLITY,
    name,
    isVisible,
  };
}

export function setHUllPointsVisibility(name, isVisible) {
  return {
    type: actionType.SET_HULL_POINTS_VISIBLITY,
    name,
    isVisible,
  };
}

export function pointClickHandler(auid) {
  return {
    type: actionType.POINT_CLICK_HANDLER,
    auid,
  };
}

export function setLastSelectedHull(name) {
  return {
    type: actionType.SET_LAST_SELECTED_HULL,
    name,
  };
}

export function removeHull(name) {
  return {
    type: actionType.REMOVE_HULL,
    name,
  };
}

export function clearSelectedHulls() {
  return {
    type: actionType.CLEAR_SELECTED_HULLS,
  };
}
