function convertAvailableToObj(data) {
  return data.reduce((o, i) => {
    o[i] = true;
    return o;
  }, {});
}

// const availableElements = ["Al", "Ag", "Ar", "As", "At", "Au", "B", "Ba", "Be", "Bi", "Br", "C", "Ca", "Ce", "Cl", "Co", "Cr", "Cs", "Cu", "Dy", "Er", "Eu", "F", "Fe", "Ga", "Gd", "Ge", "H", "He", "Hf", "Hg", "Ho", "I", "In", "Ir", "K", "Kr", "La", "Li", "Lu", "Mg", "Mn", "Mo", "N", "Na", "Nb", "Nd", "Ni", "O", "Os", "P", "Pb", "Pd", "Pm", "Po", "Pr", "Pt", "Rb", "Re", "Rh", "Rn", "Ru", "S", "Sb", "Sc", "Se", "Si", "Sm", "Sn", "Sr", "Ta", "Tb", "Tc", "Te", "Ti", "Tm", "V", "W", "Xe", "Y", "Yb", "Zn", "Zr", "Ne"];

const availableElements = [];

export const pTableDefaultState = {
  selectedElements: [],
  availableElements: convertAvailableToObj(availableElements),
};

export const hullDefaultState = {
  selectedHulls: [],
  selectedHull: {},
  selectedEntries: [],
  selectedEntriesAuids: [],
  lastSelected: 'noSelection',
};
