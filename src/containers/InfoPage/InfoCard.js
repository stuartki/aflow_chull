import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
// import * as hullActions from '../../actions/hullActions.js';
// import { removeEntry, pointClickHandler } from '../../actions/hullActions.js';


const propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  removeEntry: PropTypes.func.isRequired,
};


class InfoCard extends React.Component {

  constructor(props) {
    super(props);
    this.removeOnClick = this.removeOnClick.bind(this);
  }


  removeOnClick() {
    // While the remove entry action could be called, the selected points will
    // still appear highlighted on the hulls. Therefore, the point click action
    // is called instead which will handle everything.

    // hullActions.pointClickHandler(this.props.id);
    // entryActions.removeEntry(this.props.id);
    this.props.removeEntry(this.props.id);
  }

  render() {
    /*
    const composition = this.props.data.composition.map(
      (obj) => obj.value
    );
    const stoichiometry = this.props.data.stoichiometry.map(
      (obj) => obj.val.toFixed(2)
    );
    */

    // NOTE: Catalog doesn't work in AFLUX, so I removed it from the first
    // row and moved up spacegroup. In the second row energy_atom was added.
    // When catalog works, undo this
    //{this.props.data.auid} first used to be compound...
    let message = "";
    let color = ""
    let dist;
    if(this.props.data.grstate){
      message = "Ground State";
      color = 'green';
      dist = "-";
    }
    else {
      message = "Non-Ground State";
      color = '#b30000';
      dist = this.props.data.distancetohull;
    }
    return (
      <div className="col-md-6 custom-padding">
        <a href={`#${this.props.data.auid}`} />
        <div className="info-card">
          <div className="container-fluid">

            <div className="row">
              <div className="col-md-12 info-card-title">
                {this.props.data.compound + " [" + this.props.data.auid + "]"}
              </div>
            </div>

            <div className="row">
              <div className="col-md-1">
                <div className="info-card-nested">
                  <p>{}</p>
                  <p className="info-card-data-title">
                    
                  </p>
                </div>
              </div>
              <div className="col-md-10">
                <div className="info-card-nested">
                  <p><font color = {color}>{message}</font></p>
                  <p className="info-card-data-title">
                    
                  </p>
                </div>
              </div>
              <div className="col-md-1">
                <div className="info-card-nested">
                  <p>{}</p>
                  <p className="info-card-data-title">
                    
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.prototype}</p>
                  <p className="info-card-data-title">
                    Prototype
                  </p>
                </div>
              </div>
              {/*
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.catalog}</p>
                  <p className="info-card-data-title">
                    Catalog
                  </p>
                </div>
              </div>
              */}
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.lattice}</p>
                  <p className="info-card-data-title">
                    Lattice
                  </p>
                </div>
              </div>
              <div className="row">
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.spacegroup}</p>
                  <p className="info-card-data-title">
                    Space group
                  </p>
                </div>
              </div>
            </div>
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.energy_atom.toFixed(3)}</p>
                  <p className="info-card-data-title">
                    Energy (eV/atom)
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.density.toFixed(3)}</p>
                  <p className="info-card-data-title">
                    Density (g/cm<sup>3</sup>)
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.enthalpy.toFixed(3)}</p>
                  <p className="info-card-data-title">
                    Formation Enthalpy (meV/atom)
                  </p>
                </div>
              </div>             
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{dist}</p>
                  <p className="info-card-data-title">
                    Distance To Hull (meV/atom)
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.stabilitycriterion}</p>
                  <p className="info-card-data-title">
                    Stability Criterion (meV/atom)
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card-nested">
                  <p>{this.props.data.np1enthalpygain}</p>
                  <p className="info-card-data-title">
                    <i>N</i>+1 Enthalpy Gain (meV/atom)
                  </p>
                </div>
              </div>
            </div>

            <div className="row info-card-action-row">
              <div className="col-md-12">
                <div className="info-card-action-col">
                  <a
                    href={`http://aflow.org/material.php?id=${this.props.data.auid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-card-action-link"
                  >
                    MORE INFO
                  </a>
                </div>
              </div>
            </div>

            <div className="row info-card-action-row">
              <div className="col-md-12">
                <div className="info-card-action-col">
                  <span
                    className="info-card-action-warning"
                    onClick={this.removeOnClick}
                  >
                    REMOVE
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
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
