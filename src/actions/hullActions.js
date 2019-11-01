import axios from 'axios';
import * as actionType from './actionTypes';
import { IntType } from 'three';
// import store from '../store/store';

const URL_ROOT = 'http://aflowlib.duke.edu/API/chull'; // 'http://127.0.0.1:5000';
// const URL_ROOT = 'http://127.0.0.1:80';

export function addHull(hull) {
  // name, species, dim, entries, vertices, hullMembers, faces
  return {
    type: actionType.ADD_HULL,
    hull,
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



export function setHullPointsVisibility() {
  return {
    type: actionType.SET_HULL_POINTS_VISIBLITY,
  };
}

export function pointClickHandler(auid) {
  return {
    type: actionType.POINT_CLICK_HANDLER,
    auid,
  };
}

export function setSelectedHull(hull) {
  return {
    type: actionType.SET_SELECTED_HULL,
    hull,
  };
}

export function removeHull(name) {
  return {
    type: actionType.REMOVE_HULL,
    name,
  };
}

export function showAllPoints(name) {
  return {
    type: actionType.SHOW_ALL_POINTS,
    name,
  };
}

export function toggleLabels(name) {
  return {
    type: actionType.TOGGLE_LABELS,
    name,
  };
}

export function resetHull(name) {
  return {
    type: actionType.RESET_HULL,
    name,
  };
}

export function clearSelectedHulls() {
  return {
    type: actionType.CLEAR_SELECTED_HULLS,
  };
}

export function addEntries(entries) {
  return {
    type: actionType.ADD_ENTRIES,
    entries,
  };
}

export function removeEntry(auid) {
  return {
    type: actionType.REMOVE_ENTRY,
    auid,
  };
}

// **************************************
//              Thunks
// **************************************

export function getSelectedEntries(auids) {
  return (dispatch) => {
    const getEntry = url => axios.get(url);
    const requests = [];
    for (let i = 0; i < auids.length; i++) {
      // const url = `http://aflowhull.materials.duke.edu/entries/${auids[i]}/?format=json`;
      // const url = `${URL_ROOT}/api/v2/entry/${auids[i]}`;
      const url = `http://aflowlib.duke.edu/search/API/?auid(%27${auids[i]}%27),compound,composition,enthalpy_formation_atom,species,stoichiometry,lattice_system_relax,density,spacegroup_relax,energy_atom,prototype`;
      requests.push(getEntry(url));
    }
    return axios.all(requests).then((results) => {
      // const temp = results.map(r => r.data);
      const temp = results.map(r => r.data[0]);
      const entries = [];


      //wws16 start
      let comps = [];
      //get list of all compositions within the selected points
      for (let i = 0; i < temp.length; i++){
        let cur = temp[i].species.split(',');
        cur.sort();
        if (!(comps.includes(cur))){
          comps.push(cur);
        }
      }
      //determine which comps are contained within other comps (e.g FeMn in FeMnRh, only need to calculate larger hull)
      let redindices = [];
      for (let i = 0; i < comps.length; i++){
        for (let j = 0; j < comps.length; j++){
          if(i !== j && comps[i].length < comps[j].length){
            let redundant = true;
            for(let k = 0; k < comps[i].length; k++){
              if(!(comps[j].includes(comps[i][k]))) redundant = false;
            }
            if(redundant){
              redindices.push(i);
            }
          }
        }
      }
      //keep only the comps which are not contained within another
      let hulls = [];
      for(let i = 0; i < comps.length; i++){
        if(!(redindices.includes(i))) hulls.push(comps[i]); //useful now contains lists of elements in each hull...
      }
      
      //wws16 test start
      

      let hreqs = [];
      const gEntry = hurl => axios.get(hurl);


      return axios.get('http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?cache=any').then((cres) => {
      let available = [];
      let sources = [];
      let response = cres.data;
      
      for(let i = 0; i < hulls.length; i++){ //determine if a web.json file is available containing the points in each hull, prefers an exact match
        let source;
        let sfound = false;
        for(let j = 0; j < response.filenames.length; j++){
          let name = response.filenames[j];
          let len = name.length;
          if(len < 10){
            continue; //this filename is not long enough
          }
          if(!(name.substring(len-5) === ".json")){ //change to len-8, "web.json" when cpp goes live
            continue; //this is not the web.json file needed
          }
          let hname = name.substring(6,len-10); //change to len-14 when cpp goes live
          let elems = hname.split(/(?=[A-Z])/);
          let contained = true;
          for(let k = 0; k < hulls[i].length; k++){
            if(!(elems.includes((hulls[i])[k]))){
              contained = false;
              break;
            }
          }
          if(contained === false){
            continue; //this file doesnt have the needed elements
          }
          if(!(available.includes(hulls[i].join("")))){
            available.push(hulls[i].join("")); //add this hull into available if it passes all checks...
          }
          if((!(sfound)) || hname === hulls[i].join("")){
            source=hname;
            sfound=true;
          }         
        }
        if(sfound){
          sources.push(source);
        }
      }
      

      for(let i = 0; i < sources.length; i++){
        hreqs.push(gEntry(`http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?web=${sources[i]}`));
      }

      for (let i = 0; i < hulls.length; i++){ //in this function check if the hull is available, if not then add a request to recalculate
        let hullstring = hulls[i].join("");
        let hullurl = "unneeded";
        if(!(available.includes(hullstring))){
          hullurl = `http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?hull=${hullstring}`;
        }
        if(!(hullurl === "unneeded")) {
          hreqs.push(gEntry(hullurl));
        }
      }

      //hreqs.push(gEntry("http://localhost:8081/aflow_FeMnPdRh_hull_web.json"));                                                                             
      let hdata;

      return axios.all(hreqs).then((hress) => {
        hdata = hress.map(r => r.data);
      //wws16 end, now hdata should have the hull data

      for (let i = 0; i < temp.length; i++) {
        /* // Original endpoint
        const entry = {
          auid: temp[i].auid,
          aurl: temp[i].aurl.replace('aflowlib.duke.edu:', 'http://aflowlib.duke.edu/'),
          catalog: temp[i].catalog,
          compound: temp[i].compound,
          composition: temp[i].composition,
          enthalpy: temp[i].enthalpy_formation_atom * 1000,
          species: temp[i].species,
          stoichiometry: temp[i].stoichiometry,
          spacegroup: temp[i].spacegroup_relax,
          lattice: temp[i].lattice_system_relax,
          density: temp[i].density,
        };
        */
       //wws16 locate the desired auid within the hull data
        let tauid = temp[i].auid;
        let tindex = 0;
        let tindex2 = 0;
        let found = false;
        for(let j = 0; j < hdata.length; j++){
          let exit = false;
          for(let k = 0; k < hdata[j].points.length; k++){
            if(hdata[j].points[k].auid === tauid){
              tindex = j;
              tindex2 = k;
              exit = true;
              found = true;
              break;
            }
          }
          if(exit) break;
        }
        
        let np1;
        let sc;
        let gstate;
        if(hdata[tindex].points[tindex2].nPlus1EnthalpyGain === null){ //wws16
          np1 = "-";
          sc = "-";
        }
        else{
          np1 = Number(hdata[tindex].points[tindex2].nPlus1EnthalpyGain).toFixed(3);
          sc = Number(hdata[tindex].points[tindex2].stabilityCriterion).toFixed(3);
        }


        if(Number(hdata[tindex].points[tindex2].distanceToHull) === 0){
          gstate = true;
        }
        else{
          gstate = false;
        }
        //wws16 end

        const entry = { //data section in InfoCard.js
          auid: temp[i].auid,
          aurl: temp[i].aurl.replace('aflowlib.duke.edu:', 'http://aflowlib.duke.edu/'),
          // catalog: temp[i].catalog,
          energy_atom: Number(temp[i].energy_atom),
          compound: temp[i].compound,
          composition: temp[i].composition.split(',').map(d => Number(d)),
          enthalpy: Number(temp[i].enthalpy_formation_atom) * 1000,
          species: temp[i].species.split(','),
          stoichiometry: temp[i].stoichiometry.split(',').map(d => Number(d)),
          spacegroup: Number(temp[i].spacegroup_relax),
          lattice: temp[i].lattice_system_relax,
          density: Number(temp[i].density),
          prototype: temp[i].prototype,
          np1enthalpygain: np1, // wws16
          stabilitycriterion: sc,
          distancetohull: Number(hdata[tindex].points[tindex2].distanceToHull).toFixed(3),
          grstate: gstate,
        };
        entries.push(entry);
      }
      dispatch(addEntries(entries));
    });

  });
  });
  };
}

export function fetchHull(name, selectedHulls) {
  return (dispatch) => {
    let selection = name.split(/(?=[A-Z])/);
    selection = selection.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    if (selection[0] === '') selection.shift();
    const selectedHull = selection.join('');

    for (let i = 0; i < selectedHulls.length; i++) {
      if (selectedHulls[i].name === selectedHull) {
        return dispatch(setSelectedHull(selectedHulls[i]));
      }
    }

    const dim = selection.length;

    // const url = `${URL_ROOT}/api/v2/hulls/${selectedHull}`;
    // const url = `http://aflowlib.duke.edu/users/egossett/ahull-cmds/api/hulls/?hull=${selectedHull}`; // AFLOW direct
    const url = `http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?hull=${selectedHull}`; // AFLOW direct
    return axios.get(url).then((res) => {
      const meV = 1000; // scales from eV to meV
      const entries = [];
      const hullMembers = [];
      const vertices = [];
      // const faces = [];
      const d = res.data;
      for (let i = 0; i < d.points.length; i++) {
        const entry = d.points[i];
        if (dim === 2) {
          entry.enthalpyFormationAtom *= meV;
        }
        entry.isClicked = false;
        entries.push(entry);
      }

      for (let i = 0; i < d.groundStates.length; i++) {
        const entry = d.groundStates[i];
        if (dim === 2) {
          entry.enthalpyFormationAtom *= meV;
        }
        entry.isClicked = false;
        hullMembers.push(entry);
      }

      if (dim === 3 || dim === 4) {
        for (let i = 0; i < d.vertices.length; i++) {
          const vertex = d.vertices[i];
          vertices.push(vertex);
        }
      }

      if (dim === 2) {
        for (let i = 0; i < d.vertices.length; i++) {
          const vertex = d.vertices[i];
          const datum = {};
          datum.auid = vertex.auid;
          datum.x = vertex.composition[1];
          datum.y = vertex.enthalpyFormationAtom * meV;
          // datum.isClicked = hullStore.hasPointBeenClicked(vertex.auid);
          datum.isClicked = false;
          vertices.push(datum);
        }
        vertices.push({ auid: null, x: 0, y: 0, isClicked: false });
        vertices.sort((a, b) => a.x - b.x);
      }

      let hull = {
        name: selectedHull,
        species: d.species,
        dim,
        entries,
        vertices,
        hullMembers,
        faces: d.faces,
        color: '#FFB260',
        yMin: -1000.0,
        yMax: 1000.0,
        showAllPoints: true,
        showHullPoints: false,
        showLabels: true,
      };

      if (dim > 4) {
        hull = {
          name: selectedHull,
          species: selection,
          dim,
          entries: [],
          vertices: [],
          hullMembers: [],
          faces: [],
          color: '#FFB260',
          yMin: -1000.0,
          yMax: 1000.0,
          showAllPoints: true,
          showHullPoints: false,
          showLabels: true,
        };
      }

      dispatch(addHull(hull));
    });
  };
}
