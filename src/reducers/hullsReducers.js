import * as actionType from '../actions/actionTypes';
import { hullDefaultState } from './defaultState';

/*
function findEntryInSelectedHull(auid, selectedHull) {
  const hull = Object.assign({}, selectedHull);
  for (let i = 0; i < hull.entries.length; i++) {
    if (hull.entries[i].auid === auid &&
        hull.entries[i].auid !== null) {
      hull.entries[i].isClicked = !hull.entries[i].isClicked;
    }
  }
  return hull;
}
*/

function hasPointBeenClicked(auid, selectedHulls) {
  for (let i = 0; i < selectedHulls.length; i++) {
    for (let j = 0; j < selectedHulls[i].entries.length; j++) {
      if (selectedHulls[i].entries[j].auid === auid && selectedHulls[i].entries[j].auid !== null) {
        return selectedHulls[i].entries[j].isClicked;
      }
    }
  }
}

function getEntryInSelectedHulls(auid, selectedHulls) {
  for (let i = 0; i < selectedHulls.length; i++) {
    for (let j = 0; j < selectedHulls[i].entries.length; j++) {
      if (selectedHulls[i].entries[j].auid === auid && selectedHulls[i].entries[j].auid !== null) {
        return selectedHulls[i].entries[j];
      }
    }
  }
}

function resizeHullAxes(selectedHulls, hullName, yMin, yMax) {
  const hullList = selectedHulls.slice(0);
  for (let i = 0; i < hullList.length; i++) {
    if (hullList[i].name === hullName) {
      hullList[i].yMin = yMin;
      hullList[i].yMax = yMax;
      break;
    }
  }
  return hullList;
}

function findEntryInSelectedHulls(auid, selectedHulls) {
  const hullList = selectedHulls.slice(0);
  for (let i = 0; i < hullList.length; i++) {
    for (let j = 0; j < hullList[i].entries.length; j++) {
      if (hullList[i].entries[j].auid === auid && hullList[i].entries[j].auid !== null) {
        hullList[i].entries[j].isClicked = !hullList[i].entries[j].isClicked;
      }
    }
  }
  return hullList;
}

function hoverVertexInSelectedHulls(auid, selectedHulls) {
  const hullList = selectedHulls.slice(0);
  for (let i = 0; i < hullList.length; i++) {
    for (let j = 0; j < hullList[i].entries.length; j++) {
      if (hullList[i].entries[j].auid === auid && hullList[i].entries[j].auid !== null) {
        hullList[i].entries[j].isHovered = !hullList[i].entries[j].isHovered;
      }
    }
  }
  return hullList;
}

function resetHulls(selectedHulls, name) {
  const hullList = selectedHulls.slice(0);
  for (let i = 0; i < hullList.length; i++) {
    if (hullList[i].name === name) {
      hullList[i].showAllPoints = true;
      hullList[i].yMax = 1000;
      hullList[i].yMin = -1000;
      hullList[i].showLabels = true;
    }
    for (let j = 0; j < hullList[i].entries.length; j++) {
      hullList[i].entries[j].isClicked = false;
    }
  }
  return hullList;
}

function toggleHullPoints(selectedHulls, selectedHull) {
  /*
  const hull = Object.assign({}, origHull);
  for (let i = 0; i < hull.entries.length; i++){
    for (let j = 0; j < hull.hullMembers.length; j++) {
      if (hull.entries[i].auid === hull.hullMembers[j].auid) {
        hull.entries[i].isClicked = !hull.entries[i].isClicked;
      }
    }
  }
  */
  const hullList = selectedHulls.slice(0);
  for (let i = 0; i < hullList.length; i++) {
    if (hullList[i].name === selectedHull.name) {
      for (let j = 0; j < hullList[i].entries.length; j++) {
        for (let k = 0; k < hullList[i].hullMembers.length; k++) {
          if (hullList[i].hullMembers[k].auid === hullList[i].entries[j].auid) {
            hullList[i].entries[j].isClicked = !hullList[i].entries[j].isClicked;
            break;
          }
        }
      }
    }
  }
  return hullList;
}

export function hulls(state = hullDefaultState, action) {
  switch (action.type) {
    case actionType.ADD_HULL:
      return Object.assign({}, state, {
        selectedHulls: state.selectedHulls.concat(action.hull),
        selectedHull: action.hull,
        lastSelected: action.hull.name,
      });
    case actionType.SET_SELECTED_HULL:
      return Object.assign({}, state, {
        selectedHull: action.hull,
        lastSelected: action.hull.name,
      });
    case actionType.REMOVE_HULL: {
      const selectedHulls = state.selectedHulls.slice(0);
      let lastSelected = state.lastSelected.slice(0);
      for (let i = 0; i < selectedHulls.length; i++) {
        if (selectedHulls[i].name === action.name) {
          selectedHulls.splice(i, 1);
          if (lastSelected === action.name && selectedHulls.length) {
            lastSelected = state.selectedHulls[state.selectedHulls.length - 1].name;
          } else {
            lastSelected = 'noSelection';
          }
          return Object.assign({}, state, {
            selectedHulls,
            lastSelected,
          });
        }
      }
      return state;
    }
    case actionType.CLEAR_SELECTED_HULLS:
      return Object.assign({}, state, {
        selectedElements: state.selectedElements.concat(action.name),
      });
    case actionType.RESIZE_HULL_AXES:
      return Object.assign({}, state, {
        selectedHulls: resizeHullAxes(state.selectedHulls, action.name, action.yMin, action.yMax),
      });
    case actionType.POINT_CLICK_HANDLER: {
      const selectedHulls = findEntryInSelectedHulls(action.auid, state.selectedHulls);
      let auids = state.selectedEntriesAuids.slice(0);
      const entry = getEntryInSelectedHulls(action.auid, selectedHulls);
      if (hasPointBeenClicked(action.auid, selectedHulls)) {
        auids.push({ auid: entry.auid, compound: entry.compound });
      } else {
        auids = auids.filter(d => d.auid !== action.auid);
      }
      return Object.assign({}, state, {
        selectedHulls,
        selectedEntriesAuids: auids,
      });
    }
    case actionType.HIGHLIGHT_POINT: {
      console.log("HOVER");
      // const selectedHulls = hoverVertexInSelectedHulls(action.auid, state.selectedHulls);
      // return Object.assign({}, state, {
      //   selectedHulls,
      // });
    }
    case actionType.SET_POINTS_VISIBLITY:
      return Object.assign({}, state, {
        selectedElements: state.selectedElements.concat(action.name),
      });
    case actionType.SET_HULL_POINTS_VISIBLITY: {
      const selectedHulls = toggleHullPoints(state.selectedHulls, state.selectedHull);
      /*
      const hullPointsAuids = state.selectedHull.hullMembers
        .map(d => d.auid)
        .filter(d => d.indexOf('aflow_hull_endpoint') === -1);
      const auids = state.selectedEntriesAuids.slice(0);
      for (let i = 0; i < hullPointsAuids.length; i++) {
        if (auids.indexOf(hullPointsAuids[i]) === -1) {
          auids.push(hullPointsAuids[i]);
        }
      }*/
      const hullPointsAuids = state.selectedHull.hullMembers
        .map(d => ({ compound: d.compound, auid: d.auid }))
        .filter(d => d.auid.indexOf('aflow_hull_endpoint') === -1);
      let auids = state.selectedEntriesAuids.slice(0);
      for (let i = 0; i < hullPointsAuids.length; i++) {
        if (auids.filter(d => d.auid === hullPointsAuids[i].auid).length === 0) {
          auids.push(hullPointsAuids[i]);
        } else {
          auids = auids.filter(d => d.auid !== hullPointsAuids[i].auid);
        }
      }
      return Object.assign({}, state, {
        selectedHulls,
        selectedEntriesAuids: auids,
      });
    }
    case actionType.ADD_ENTRIES:
      return Object.assign({}, state, {
        selectedEntries: action.entries,
      });
    case actionType.REMOVE_ENTRY: {
      const selectedHulls = findEntryInSelectedHulls(action.auid, state.selectedHulls);
      const entries = state.selectedEntries.slice(0);
      const auids = state.selectedEntriesAuids.filter(d => d.auid !== action.auid);
      for (let i = 0; i < entries.length; i++) {
        if (action.auid === entries[i].auid) {
          entries.splice(i, 1);
          break;
        }
      }
      /*
      const idx = auids.indexOf(action.auid);
      if (idx > -1) {
        auids.splice(idx, 1);
      }
      */
      return Object.assign({}, state, {
        selectedHulls,
        selectedEntries: entries,
        selectedEntriesAuids: auids,
      });
    }
    case actionType.SHOW_ALL_POINTS: {
      /*
      const selectedHull = Object.assign({}, state.selectedHull);
      selectedHull.showAllPoints = !selectedHull.showAllPoints;
      return Object.assign({}, state, {
        selectedHull,
      });
      */
      const selectedHulls = state.selectedHulls.map((d) => {
        if (d.name === action.name) {
          d.showAllPoints = !d.showAllPoints;
        }
        return d;
      });
      return Object.assign({}, state, {
        selectedHulls,
      });
    }
    case actionType.TOGGLE_LABELS: {
      /*
      const selectedHull = Object.assign({}, state.selectedHull);
      selectedHull.showAllPoints = !selectedHull.showAllPoints;
      return Object.assign({}, state, {
        selectedHull,
      });
      */
      const selectedHulls = state.selectedHulls.map((d) => {
        if (d.name === action.name) {
          d.showLabels = !d.showLabels;
        }
        return d;
      });
      return Object.assign({}, state, {
        selectedHulls,
      });
    }
    case actionType.RESET_HULL: {
      const selectedHulls = resetHulls(state.selectedHulls, action.name);
      return Object.assign({}, state, {
        selectedHulls,
        selectedEntries: [],
        selectedEntriesAuids: [],
      });
    }
    default:
      return state;
  }
}
