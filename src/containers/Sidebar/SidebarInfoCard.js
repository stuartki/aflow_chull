import React from 'react';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';
import { Link } from 'react-router';

const propTypes = {
  selectedEntriesAuids: PropTypes.array.isRequired,
  selectedEntries: PropTypes.array.isRequired,
  selectedHull: PropTypes.object.isRequired,
};

class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    this.removeOnClick = this.removeOnClick.bind(this);
    this.loading = true;
  }

  removeOnClick() {
    // While the remove entry action could be called, the selected points will
    // still appear highlighted on the hulls. Therefore, the point click action
    // is called instead which will handle everything.

    // hullActions.pointClickHandler(id);
    // entryActions.removeEntry(id);
    this.props.removeEntry(id);
  }

  render() {
    /*
    const composition = data.composition.map(
      (obj) => obj.value
    );
    const stoichiometry = data.stoichiometry.map(
      (obj) => obj.val.toFixed(2)
    );
    */

    // NOTE: Catalog doesn't work in AFLUX, so I removed it from the first
    // row and moved up spacegroup. In the second row energy_atom was added.
    // When catalog works, undo this
    // {data.auid} first used to be compound...

    // infoCard = this.props.selectedEntries.map(entry => (
    //   <InfoCard
    //     data={entry}
    //     id={entry.auid}
    //     key={entry.auid}
    //     removeEntry={this.props.removeEntry}
    //   />
    // )

    // if (!this.props.selectedEntries.length && !this.props.selectedEntriesAuids.length) {
    //   return (
    //     <div>
    //       <div className="s-info-card">
    //         <div className="s-info-card-title">
    //           {}
    //         </div>
    //         <div className="s-info-card-nested">
    //           <p>{}</p>
    //           <p className="s-info-card-data-title" />
    //         </div>
    //       </div>
    //     </div>

    //   );
    // }
    if (this.props.selectedHull.entries === undefined) {
      return null;
    }

    const noneSelected = !this.props.selectedEntriesAuids.length;
    const dataSelected = this.props.selectedEntries.length;
    const loading = this.props.selectedEntriesAuids.length !== this.props.selectedEntries.length;

    let message = '';
    let color = '';
    let dist;

    let data;
    let storedData;

    if (dataSelected) {
      data = this.props.selectedEntries[this.props.selectedEntries.length - 1];
      if (data.grstate) {
        message = 'Ground State';
        color = 'green';
        dist = '-';
      } else {
        message = 'Non-Ground State';
        color = '#b30000';
        dist = data.distancetohull;
      }
    }

    if (!noneSelected) {
      storedData = this.props.selectedHull.entries.filter(d => d.auid === this.props.selectedEntriesAuids[this.props.selectedEntriesAuids.length - 1].auid)[0];
    }

    const compound = !noneSelected ? `${storedData.compound}` : null;
    const auid = !noneSelected ? `${storedData.auid}` : null;
    return (
      <div>
        <div className="s-info-card">
          <div className="s-info-card-title">
            <Link to={`info#${auid}`}>
              <p>{compound}</p>
              <p>{auid}</p>
            </Link>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="s-info-card-nested">
                <p>{!noneSelected ? storedData.enthalpyFormationAtom.toFixed(3) : 0.000}</p>
                <p className="s-info-card-data-title">
                  Formation Enthalpy
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="s-info-card-nested">
                <p>{!noneSelected ? storedData.distanceToHull.toFixed(3) : 0.000}</p>
                <p className="s-info-card-data-title">
                  Distance To Hull
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="s-info-card-nested">
                <p>{!noneSelected && storedData.stabilityCriterion ? storedData.stabilityCriterion.toFixed(3) : 0.000}</p>
                <p className="s-info-card-data-title">
                  Stability Criterion
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="s-info-card-nested">
                {/* if it is loading, then ..., else check if data is selected and output */}
                <p>
                  {loading ? '...' :
                    (dataSelected && data.prototype) ? data.prototype : 0.000}
                </p>
                <p className="s-info-card-data-title">
                     Prototype
                   </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="s-info-card-nested">
                <p>
                  {loading ? '...' :
                    (dataSelected && data.catalog) ? data.catalog : 'None'}
                </p>
                <p className="s-info-card-data-title">
                    Catalog
                   </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="s-info-card-nested">
                <p>
                  {loading ? '...' :
                    (dataSelected && data.lattice) ? data.lattice : 'None'
                  }</p>
                <p className="s-info-card-data-title">
                    Lattice
                   </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="s-info-card-nested">
                {/* if it is loading, then ..., else check if data is selected and output */}
                <p>
                  {loading ? '...' :
                    (dataSelected && data.spacegroup) ? data.spacegroup : 0.000}
                </p>
                <p className="s-info-card-data-title">
                     Space Group
                   </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="s-info-card-nested">
                <p>
                  {loading ? '...' :
                    (dataSelected && data.energy_atom) ? data.energy_atom.toFixed(3) : 0.000}
                </p>
                <p className="s-info-card-data-title">
                    Energy (eV / atom)
                   </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="s-info-card-nested">
                <p>
                  {loading ? '...' :
                    (dataSelected && data.density) ? data.density.toFixed(3) : 0.000}
                </p>
                <p className="s-info-card-data-title">
                    Density
                   </p>
              </div>
            </div>
          </div>
          <div className="s-info-card-title">
            <Link to={`info#${auid}`}>
              <p>{compound}</p>
              <p>{auid}</p>
            </Link>
          </div>
        </div>
      </div>


      // <div className="col-md-6 custom-padding">
      //   <a href={`#${data.auid}`} />
      //   <div className="info-card">
      //     <div className="container-fluid">

      //       <div className="row">
      //         <div className="col-md-12 info-card-title">
      //           {`${data.compound} [${data.auid}]`}
      //         </div>
      //       </div>

      //       <div className="row">
      //         <div className="col-md-1">
      //           <div className="info-card-nested">
      //             <p>{}</p>
      //             <p className="info-card-data-title" />
      //           </div>
      //         </div>
      //         <div className="col-md-10">
      //           <div className="info-card-nested">
      //             <p><font color={color}>{message}</font></p>
      //             <p className="info-card-data-title" />
      //           </div>
      //         </div>
      //         <div className="col-md-1">
      //           <div className="info-card-nested">
      //             <p>{}</p>
      //             <p className="info-card-data-title" />
      //           </div>
      //         </div>
      //       </div>

      //       <div className="row">
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.prototype}</p>
      //             <p className="info-card-data-title">
      //               Prototype
      //             </p>
      //           </div>
      //         </div>
      //         {/*
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.catalog}</p>
      //             <p className="info-card-data-title">
      //               Catalog
      //             </p>
      //           </div>
      //         </div>
      //         */}
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.lattice}</p>
      //             <p className="info-card-data-title">
      //               Lattice
      //             </p>
      //           </div>
      //         </div>
              // <div className="row">
              //   <div className="col-md-4">
              //     <div className="info-card-nested">
              //       <p>{data.spacegroup}</p>
              //       <p className="info-card-data-title">
              //       Space group
              //     </p>
              //     </div>
              //   </div>
              // </div>
              // <div className="col-md-4">
              //   <div className="info-card-nested">
              //     <p>{data.energy_atom.toFixed(3)}</p>
              //     <p className="info-card-data-title">
              //       Energy (eV/atom)
              //     </p>
              //   </div>
              // </div>
              // <div className="col-md-4">
              //   <div className="info-card-nested">
              //     <p>{data.density.toFixed(3)}</p>
              //     <p className="info-card-data-title">
              //       Density (g/cm<sup>3</sup>)
              //     </p>
              //   </div>
              // </div>
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.enthalpy.toFixed(3)}</p>
      //             <p className="info-card-data-title">
      //               Formation Enthalpy (meV/atom)
      //             </p>
      //           </div>
      //         </div>
      //       </div>
      //       <div className="row">
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{dist}</p>
      //             <p className="info-card-data-title">
      //               Distance To Hull (meV/atom)
      //             </p>
      //           </div>
      //         </div>
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.stabilitycriterion}</p>
      //             <p className="info-card-data-title">
      //               Stability Criterion (meV/atom)
      //             </p>
      //           </div>
      //         </div>
      //         <div className="col-md-4">
      //           <div className="info-card-nested">
      //             <p>{data.np1enthalpygain}</p>
      //             <p className="info-card-data-title">
      //               <i>N</i>+1 Enthalpy Gain (meV/atom)
      //             </p>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="row info-card-action-row">
      //         <div className="col-md-12">
      //           <div className="info-card-action-col">
      //             <a
      //               href={`http://aflow.org/material/?id=${data.auid}`}
      //               target="_blank"
      //               rel="noopener noreferrer"
      //               className="info-card-action-link"
      //             >
      //               MORE INFO
      //             </a>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="row info-card-action-row">
      //         <div className="col-md-12">
      //           <div className="info-card-action-col">
      //             <span
      //               className="info-card-action-warning"
      //               onClick={this.removeOnClick}
      //             >
      //               REMOVE
      //             </span>
      //           </div>
      //         </div>
      //       </div>

      //     </div>
      //   </div>
      // </div>
    );
  }
}

InfoCard.propTypes = propTypes;

/*
function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeEntry: (auid) => {
      dispatch(removeEntry(auid));
      // dispatch(pointClickHandler(auid));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
*/
export default InfoCard;
