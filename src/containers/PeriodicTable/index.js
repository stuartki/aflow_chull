import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addElement, addElements, fetchAvailableElements } from '../../actions/periodicTableActions';
// import { fetchAvailableElements } from '../actions/periodicTableActions';
import Centerbox from './PeriodicTableCenterbox';
import Element from './PeriodicTableElement';
import './periodicTable.css';

const propTypes = {
  init: PropTypes.func.isRequired,
  availableElements: PropTypes.object.isRequired,
  selectedElements: PropTypes.array.isRequired,
  addElement: PropTypes.func.isRequired,
  addElements: PropTypes.func.isRequired,
};

class PeriodicTable extends React.Component {

  componentWillMount() {
    this.props.init();
    // pTableStore.on('change', this.fetchStore);
  }

  componentWillUnmount() {
    // pTableStore.removeListener('change', this.fetchStore);
  }

  render() {
    return (
      <div className="periodic-table-container">
        <section className="periodic-table">
          <div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">1</div>
              <div className="periodic-table-label">2</div>
              <div className="periodic-table-label">3</div>
              <div className="periodic-table-label">4</div>
              <div className="periodic-table-label">5</div>
              <div className="periodic-table-label">7</div>
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">1A</div>
              <Element
                name="H"
                available={
                  'H' in this.props.availableElements
                    ? this.props.availableElements.H.availability
                    : false
                }
                reliability={
                  'H' in this.props.availableElements
                    ? this.props.availableElements.H.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Li"
                available={
                  'Li' in this.props.availableElements
                    ? this.props.availableElements.Li.availability
                    : false
                }
                reliability={
                  'Li' in this.props.availableElements
                    ? this.props.availableElements.Li.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Na"
                available={
                  'Na' in this.props.availableElements
                    ? this.props.availableElements.Na.availability
                    : false
                }
                reliability={
                  'Na' in this.props.availableElements
                    ? this.props.availableElements.Na.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="K"
                available={
                  'K' in this.props.availableElements
                    ? this.props.availableElements.K.availability
                    : false
                }
                reliability={
                  'K' in this.props.availableElements
                    ? this.props.availableElements.K.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Rb"
                available={
                  'Rb' in this.props.availableElements
                    ? this.props.availableElements.Rb.availability
                    : false
                }
                reliability={
                  'Rb' in this.props.availableElements
                    ? this.props.availableElements.Rb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Cs"
                available={
                  'Cs' in this.props.availableElements
                    ? this.props.availableElements.Cs.availability
                    : false
                }
                reliability={
                  'Cs' in this.props.availableElements
                    ? this.props.availableElements.Cs.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">2A</div>
              <Element
                name="Be"
                available={
                  'Be' in this.props.availableElements
                    ? this.props.availableElements.Be.availability
                    : false
                }
                reliability={
                  'Be' in this.props.availableElements
                    ? this.props.availableElements.Be.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Mg"
                available={
                  'Mg' in this.props.availableElements
                    ? this.props.availableElements.Mg.availability
                    : false
                }
                reliability={
                  'Mg' in this.props.availableElements
                    ? this.props.availableElements.Mg.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ca"
                available={
                  'Ca' in this.props.availableElements
                    ? this.props.availableElements.Ca.availability
                    : false
                }
                reliability={
                  'Ca' in this.props.availableElements
                    ? this.props.availableElements.Ca.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Sr"
                available={
                  'Sr' in this.props.availableElements
                    ? this.props.availableElements.Sr.availability
                    : false
                }
                reliability={
                  'Sr' in this.props.availableElements
                    ? this.props.availableElements.Sr.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ba"
                available={
                  'Ba' in this.props.availableElements
                    ? this.props.availableElements.Ba.availability
                    : false
                }
                reliability={
                  'Ba' in this.props.availableElements
                    ? this.props.availableElements.Ba.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Centerbox
                selectedElements={this.props.selectedElements.join('')}
                addElements={this.props.addElements}
              />
              <div className="periodic-table-label">3B</div>
              <Element
                name="Sc"
                available={
                  'Sc' in this.props.availableElements
                    ? this.props.availableElements.Sc.availability
                    : false
                }
                reliability={
                  'Sc' in this.props.availableElements
                    ? this.props.availableElements.Sc.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Y"
                available={
                  'Y' in this.props.availableElements
                    ? this.props.availableElements.Y.availability
                    : false
                }
                reliability={
                  'Y' in this.props.availableElements
                    ? this.props.availableElements.Y.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <div className="periodic-table-label">La-Lu</div>
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">4B</div>
              <Element
                name="Ti"
                available={
                  'Ti' in this.props.availableElements
                    ? this.props.availableElements.Ti.availability
                    : false
                }
                reliability={
                  'Ti' in this.props.availableElements
                    ? this.props.availableElements.Ti.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Zr"
                available={
                  'Zr' in this.props.availableElements
                    ? this.props.availableElements.Zr.availability
                    : false
                }
                reliability={
                  'Zr' in this.props.availableElements
                    ? this.props.availableElements.Zr.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Hf"
                available={
                  'Hf' in this.props.availableElements
                    ? this.props.availableElements.Hf.availability
                    : false
                }
                reliability={
                  'Hf' in this.props.availableElements
                    ? this.props.availableElements.Hf.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">5B</div>
              <Element
                name="V"
                available={
                  'V' in this.props.availableElements
                    ? this.props.availableElements.V.availability
                    : false
                }
                reliability={
                  'V' in this.props.availableElements
                    ? this.props.availableElements.V.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Nb"
                available={
                  'Nb' in this.props.availableElements
                    ? this.props.availableElements.Nb.availability
                    : false
                }
                reliability={
                  'Nb' in this.props.availableElements
                    ? this.props.availableElements.Nb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ta"
                available={
                  'Ta' in this.props.availableElements
                    ? this.props.availableElements.Ta.availability
                    : false
                }
                reliability={
                  'Ta' in this.props.availableElements
                    ? this.props.availableElements.Ta.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">6B</div>
              <Element
                name="Cr"
                available={
                  'Cr' in this.props.availableElements
                    ? this.props.availableElements.Cr.availability
                    : false
                }
                reliability={
                  'Cr' in this.props.availableElements
                    ? this.props.availableElements.Cr.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Mo"
                available={
                  'Mo' in this.props.availableElements
                    ? this.props.availableElements.Mo.availability
                    : false
                }
                reliability={
                  'Mo' in this.props.availableElements
                    ? this.props.availableElements.Mo.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="W"
                available={
                  'W' in this.props.availableElements
                    ? this.props.availableElements.W.availability
                    : false
                }
                reliability={
                  'W' in this.props.availableElements
                    ? this.props.availableElements.W.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">7B</div>
              <Element
                name="Mn"
                available={
                  'Mn' in this.props.availableElements
                    ? this.props.availableElements.Mn.availability
                    : false
                }
                reliability={
                  'Mn' in this.props.availableElements
                    ? this.props.availableElements.Mn.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Tc"
                available={
                  'Tc' in this.props.availableElements
                    ? this.props.availableElements.Tc.availability
                    : false
                }
                reliability={
                  'Tc' in this.props.availableElements
                    ? this.props.availableElements.Tc.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Re"
                available={
                  'Re' in this.props.availableElements
                    ? this.props.availableElements.Re.availability
                    : false
                }
                reliability={
                  'Re' in this.props.availableElements
                    ? this.props.availableElements.Re.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">
                <i className="fa fa-long-arrow-left" />
              </div>
              <Element
                name="Fe"
                available={
                  'Fe' in this.props.availableElements
                    ? this.props.availableElements.Fe.availability
                    : false
                }
                reliability={
                  'Fe' in this.props.availableElements
                    ? this.props.availableElements.Fe.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ru"
                available={
                  'Ru' in this.props.availableElements
                    ? this.props.availableElements.Ru.availability
                    : false
                }
                reliability={
                  'Ru' in this.props.availableElements
                    ? this.props.availableElements.Ru.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Os"
                available={
                  'Os' in this.props.availableElements
                    ? this.props.availableElements.Os.availability
                    : false
                }
                reliability={
                  'Os' in this.props.availableElements
                    ? this.props.availableElements.Os.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">8</div>
              <Element
                name="Co"
                available={
                  'Co' in this.props.availableElements
                    ? this.props.availableElements.Co.availability
                    : false
                }
                reliability={
                  'Co' in this.props.availableElements
                    ? this.props.availableElements.Co.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Rh"
                available={
                  'Rh' in this.props.availableElements
                    ? this.props.availableElements.Rh.availability
                    : false
                }
                reliability={
                  'Rh' in this.props.availableElements
                    ? this.props.availableElements.Rh.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ir"
                available={
                  'Ir' in this.props.availableElements
                    ? this.props.availableElements.Ir.availability
                    : false
                }
                reliability={
                  'Ir' in this.props.availableElements
                    ? this.props.availableElements.Ir.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">
                <i className="fa fa-long-arrow-right" />
              </div>
              <Element
                name="Ni"
                available={
                  'Ni' in this.props.availableElements
                    ? this.props.availableElements.Ni.availability
                    : false
                }
                reliability={
                  'Ni' in this.props.availableElements
                    ? this.props.availableElements.Ni.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Pd"
                available={
                  'Pd' in this.props.availableElements
                    ? this.props.availableElements.Pd.availability
                    : false
                }
                reliability={
                  'Pd' in this.props.availableElements
                    ? this.props.availableElements.Pd.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Pt"
                available={
                  'Pt' in this.props.availableElements
                    ? this.props.availableElements.Pt.availability
                    : false
                }
                reliability={
                  'Pt' in this.props.availableElements
                    ? this.props.availableElements.Pt.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">1B</div>
              <Element
                name="Cu"
                available={
                  'Cu' in this.props.availableElements
                    ? this.props.availableElements.Cu.availability
                    : false
                }
                reliability={
                  'Cu' in this.props.availableElements
                    ? this.props.availableElements.Cu.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ag"
                available={
                  'Ag' in this.props.availableElements
                    ? this.props.availableElements.Ag.availability
                    : false
                }
                reliability={
                  'Ag' in this.props.availableElements
                    ? this.props.availableElements.Ag.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Au"
                available={
                  'Au' in this.props.availableElements
                    ? this.props.availableElements.Au.availability
                    : false
                }
                reliability={
                  'Au' in this.props.availableElements
                    ? this.props.availableElements.Au.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">2B</div>
              <Element
                name="Zn"
                available={
                  'Zn' in this.props.availableElements
                    ? this.props.availableElements.Zn.availability
                    : false
                }
                reliability={
                  'Zn' in this.props.availableElements
                    ? this.props.availableElements.Zn.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Cd"
                available={
                  'Cd' in this.props.availableElements
                    ? this.props.availableElements.Cd.availability
                    : false
                }
                reliability={
                  'Cd' in this.props.availableElements
                    ? this.props.availableElements.Cd.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Hg"
                available={
                  'Hg' in this.props.availableElements
                    ? this.props.availableElements.Hg.availability
                    : false
                }
                reliability={
                  'Hg' in this.props.availableElements
                    ? this.props.availableElements.Hg.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">3A</div>
              <Element
                name="B"
                available={
                  'B' in this.props.availableElements
                    ? this.props.availableElements.B.availability
                    : false
                }
                reliability={
                  'B' in this.props.availableElements
                    ? this.props.availableElements.B.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Al"
                available={
                  'Al' in this.props.availableElements
                    ? this.props.availableElements.Al.availability
                    : false
                }
                reliability={
                  'Al' in this.props.availableElements
                    ? this.props.availableElements.Al.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ga"
                available={
                  'Ga' in this.props.availableElements
                    ? this.props.availableElements.Ga.availability
                    : false
                }
                reliability={
                  'Ga' in this.props.availableElements
                    ? this.props.availableElements.Ga.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="In"
                available={
                  'In' in this.props.availableElements
                    ? this.props.availableElements.In.availability
                    : false
                }
                reliability={
                  'In' in this.props.availableElements
                    ? this.props.availableElements.In.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Tl"
                available={
                  'Tl' in this.props.availableElements
                    ? this.props.availableElements.Tl.availability
                    : false
                }
                reliability={
                  'Tl' in this.props.availableElements
                    ? this.props.availableElements.Tl.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">4A</div>
              <Element
                name="C"
                available={
                  'C' in this.props.availableElements
                    ? this.props.availableElements.C.availability
                    : false
                }
                reliability={
                  'C' in this.props.availableElements
                    ? this.props.availableElements.C.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Si"
                available={
                  'Si' in this.props.availableElements
                    ? this.props.availableElements.Si.availability
                    : false
                }
                reliability={
                  'Si' in this.props.availableElements
                    ? this.props.availableElements.Si.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ge"
                available={
                  'Ge' in this.props.availableElements
                    ? this.props.availableElements.Ge.availability
                    : false
                }
                reliability={
                  'Ge' in this.props.availableElements
                    ? this.props.availableElements.Ge.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Sn"
                available={
                  'Sn' in this.props.availableElements
                    ? this.props.availableElements.Sn.availability
                    : false
                }
                reliability={
                  'Sn' in this.props.availableElements
                    ? this.props.availableElements.Sn.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Pb"
                available={
                  'Pb' in this.props.availableElements
                    ? this.props.availableElements.Pb.availability
                    : false
                }
                reliability={
                  'Pb' in this.props.availableElements
                    ? this.props.availableElements.Pb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">5A</div>
              <Element
                name="N"
                available={
                  'N' in this.props.availableElements
                    ? this.props.availableElements.N.availability
                    : false
                }
                reliability={
                  'N' in this.props.availableElements
                    ? this.props.availableElements.N.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="P"
                available={
                  'P' in this.props.availableElements
                    ? this.props.availableElements.P.availability
                    : false
                }
                reliability={
                  'P' in this.props.availableElements
                    ? this.props.availableElements.P.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="As"
                available={
                  'As' in this.props.availableElements
                    ? this.props.availableElements.As.availability
                    : false
                }
                reliability={
                  'As' in this.props.availableElements
                    ? this.props.availableElements.As.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Sb"
                available={
                  'Sb' in this.props.availableElements
                    ? this.props.availableElements.Sb.availability
                    : false
                }
                reliability={
                  'Sb' in this.props.availableElements
                    ? this.props.availableElements.Sb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Bi"
                available={
                  'Bi' in this.props.availableElements
                    ? this.props.availableElements.Bi.availability
                    : false
                }
                reliability={
                  'Bi' in this.props.availableElements
                    ? this.props.availableElements.Bi.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">6A</div>
              <Element
                name="O"
                available={
                  'O' in this.props.availableElements
                    ? this.props.availableElements.O.availability
                    : false
                }
                reliability={
                  'O' in this.props.availableElements
                    ? this.props.availableElements.O.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="S"
                available={
                  'S' in this.props.availableElements
                    ? this.props.availableElements.S.availability
                    : false
                }
                reliability={
                  'S' in this.props.availableElements
                    ? this.props.availableElements.S.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Se"
                available={
                  'Se' in this.props.availableElements
                    ? this.props.availableElements.Se.availability
                    : false
                }
                reliability={
                  'Se' in this.props.availableElements
                    ? this.props.availableElements.Se.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Te"
                available={
                  'Te' in this.props.availableElements
                    ? this.props.availableElements.Te.availability
                    : false
                }
                reliability={
                  'Te' in this.props.availableElements
                    ? this.props.availableElements.Te.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Po"
                available={
                  'Po' in this.props.availableElements
                    ? this.props.availableElements.Po.availability
                    : false
                }
                reliability={
                  'Po' in this.props.availableElements
                    ? this.props.availableElements.Po.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">7A</div>
              <Element
                name="F"
                available={
                  'F' in this.props.availableElements
                    ? this.props.availableElements.F.availability
                    : false
                }
                reliability={
                  'F' in this.props.availableElements
                    ? this.props.availableElements.F.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Cl"
                available={
                  'Cl' in this.props.availableElements
                    ? this.props.availableElements.Cl.availability
                    : false
                }
                reliability={
                  'Cl' in this.props.availableElements
                    ? this.props.availableElements.Cl.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Br"
                available={
                  'Br' in this.props.availableElements
                    ? this.props.availableElements.Br.availability
                    : false
                }
                reliability={
                  'Br' in this.props.availableElements
                    ? this.props.availableElements.Br.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="I"
                available={
                  'I' in this.props.availableElements
                    ? this.props.availableElements.I.availability
                    : false
                }
                reliability={
                  'I' in this.props.availableElements
                    ? this.props.availableElements.I.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="At"
                available={
                  'At' in this.props.availableElements
                    ? this.props.availableElements.At.availability
                    : false
                }
                reliability={
                  'At' in this.props.availableElements
                    ? this.props.availableElements.At.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-label">NOBLE</div>
              <Element
                name="He"
                available={
                  'He' in this.props.availableElements
                    ? this.props.availableElements.He.availability
                    : false
                }
                reliability={
                  'He' in this.props.availableElements
                    ? this.props.availableElements.He.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ne"
                available={
                  'Ne' in this.props.availableElements
                    ? this.props.availableElements.Ne.availability
                    : false
                }
                reliability={
                  'Ne' in this.props.availableElements
                    ? this.props.availableElements.Ne.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Ar"
                available={
                  'Ar' in this.props.availableElements
                    ? this.props.availableElements.Ar.availability
                    : false
                }
                reliability={
                  'Ar' in this.props.availableElements
                    ? this.props.availableElements.Ar.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Kr"
                available={
                  'Kr' in this.props.availableElements
                    ? this.props.availableElements.Kr.availability
                    : false
                }
                reliability={
                  'Kr' in this.props.availableElements
                    ? this.props.availableElements.Kr.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Xe"
                available={
                  'Xe' in this.props.availableElements
                    ? this.props.availableElements.Xe.availability
                    : false
                }
                reliability={
                  'Xe' in this.props.availableElements
                    ? this.props.availableElements.Xe.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
              <Element
                name="Rn"
                available={
                  'Rn' in this.props.availableElements
                    ? this.props.availableElements.Rn.availability
                    : false
                }
                reliability={
                  'Rn' in this.props.availableElements
                    ? this.props.availableElements.Rn.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
          </div>
          <div>
            <div className="periodic-table-column">
              <div className="periodic-table-empty">&nbsp;</div>
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-empty">&nbsp;</div>
            </div>
            <div className="periodic-table-column">
              <div className="periodic-table-empty">&nbsp;</div>
            </div>
            <div className="periodic-table-column">
              <Element
                name="La"
                available={
                  'La' in this.props.availableElements
                    ? this.props.availableElements.La.availability
                    : false
                }
                reliability={
                  'La' in this.props.availableElements
                    ? this.props.availableElements.La.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Ce"
                available={
                  'Ce' in this.props.availableElements
                    ? this.props.availableElements.Ce.availability
                    : false
                }
                reliability={
                  'Ce' in this.props.availableElements
                    ? this.props.availableElements.Ce.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Pr"
                available={
                  'Pr' in this.props.availableElements
                    ? this.props.availableElements.Pr.availability
                    : false
                }
                reliability={
                  'Pr' in this.props.availableElements
                    ? this.props.availableElements.Pr.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Nd"
                available={
                  'Nd' in this.props.availableElements
                    ? this.props.availableElements.Nd.availability
                    : false
                }
                reliability={
                  'Nd' in this.props.availableElements
                    ? this.props.availableElements.Nd.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Pm"
                available={
                  'Pm' in this.props.availableElements
                    ? this.props.availableElements.Pm.availability
                    : false
                }
                reliability={
                  'Pm' in this.props.availableElements
                    ? this.props.availableElements.Pm.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Sm"
                available={
                  'Sm' in this.props.availableElements
                    ? this.props.availableElements.Sm.availability
                    : false
                }
                reliability={
                  'Sm' in this.props.availableElements
                    ? this.props.availableElements.Sm.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Eu"
                available={
                  'Eu' in this.props.availableElements
                    ? this.props.availableElements.Eu.availability
                    : false
                }
                reliability={
                  'Eu' in this.props.availableElements
                    ? this.props.availableElements.Eu.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Gd"
                available={
                  'Gd' in this.props.availableElements
                    ? this.props.availableElements.Gd.availability
                    : false
                }
                reliability={
                  'Gd' in this.props.availableElements
                    ? this.props.availableElements.Gd.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Tb"
                available={
                  'Tb' in this.props.availableElements
                    ? this.props.availableElements.Tb.availability
                    : false
                }
                reliability={
                  'Tb' in this.props.availableElements
                    ? this.props.availableElements.Tb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Dy"
                available={
                  'Dy' in this.props.availableElements
                    ? this.props.availableElements.Dy.availability
                    : false
                }
                reliability={
                  'Dy' in this.props.availableElements
                    ? this.props.availableElements.Dy.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Ho"
                available={
                  'Ho' in this.props.availableElements
                    ? this.props.availableElements.Ho.availability
                    : false
                }
                reliability={
                  'Ho' in this.props.availableElements
                    ? this.props.availableElements.Ho.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Er"
                available={
                  'Er' in this.props.availableElements
                    ? this.props.availableElements.Er.availability
                    : false
                }
                reliability={
                  'Er' in this.props.availableElements
                    ? this.props.availableElements.Er.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Tm"
                available={
                  'Tm' in this.props.availableElements
                    ? this.props.availableElements.Tm.availability
                    : false
                }
                reliability={
                  'Tm' in this.props.availableElements
                    ? this.props.availableElements.Tm.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Yb"
                available={
                  'Yb' in this.props.availableElements
                    ? this.props.availableElements.Yb.availability
                    : false
                }
                reliability={
                  'Yb' in this.props.availableElements
                    ? this.props.availableElements.Yb.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
            <div className="periodic-table-column">
              <Element
                name="Lu"
                available={
                  'Lu' in this.props.availableElements
                    ? this.props.availableElements.Lu.availability
                    : false
                }
                reliability={
                  'Lu' in this.props.availableElements
                    ? this.props.availableElements.Lu.reliability
                    : null
                }
                addElement={this.props.addElement}
              />
            </div>
          </div>
        </section>
        <div className="reliability">
          <p>reliability (p = # of points):</p>
          <span className="reliability--green">{'p >= 200'}</span>
          <span className="reliability--yellow">{'100 >= p < 200'}</span>
          <span className="reliability--red">{'p < 100'}</span>
        </div>
      </div>
    );
  }
}

PeriodicTable.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    availableElements: state.periodicTable.availableElements,
    selectedElements: state.periodicTable.selectedElements,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    init: () => {
      dispatch(fetchAvailableElements());
    },
    addElement: (name) => {
      dispatch(addElement(name));
      dispatch(fetchAvailableElements());
    },
    addElements: (elements) => {
      dispatch(addElements(elements));
      dispatch(fetchAvailableElements());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTable);
