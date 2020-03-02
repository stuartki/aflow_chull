import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import './visualization.css';

import BinaryHull from '../../components/BinaryHull';
import THREEhull from '../../components/TernaryHull';
import QuaternaryHull from '../../components/QuaternaryHull';
// import hullStore from '../../../stores/hullStore.js';
// import * as hullActions from '../../../actions/hullActions.js';
import {
  fetchHull,
  setSelectedHull,
  resizeHullAxes,
  pointClickHandler,
  pointHoverHandler,
} from '../../actions/hullActions';

const propTypes = {
  params: PropTypes.object.isRequired,
  selectedHull: PropTypes.object.isRequired,
  selectedHulls: PropTypes.array.isRequired,
  addHull: PropTypes.func.isRequired,
  setLastSelectedHull: PropTypes.func.isRequired,
  resizeHullAxes: PropTypes.func.isRequired,
  pointClickHandler: PropTypes.func.isRequired,
  sidebarIsVisible: PropTypes.bool,
};

const defaultProps = {
  sidebarIsVisible: true,
};

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    const { hullName } = this.props.params;
    const storedHull = this.props.selectedHulls.find(d => d.name === hullName);
    let loading = true;
    let fnames = [];
    if (storedHull) {
      loading = false;
    }

    this.state = {
      hullName,
      loading,
      apool: '',
      apoolLoading: true,
      downloadPDFBtnText: "      Download PDF       ",
      downloadPDFLoading: false,
      downloadTXTBtnText: "      Download TXT       ",
      downloadTXTLoading: false,
      downloadJSONBtnText: "      Download JSON       ",
      downlaodJSONLoading: false,
      fnames,
    };

    this.downloadPDF = this.downloadPDF.bind(this);
    this.downloadTXT = this.downloadTXT.bind(this);
    this.downloadJSON = this.downloadJSON.bind(this);
  }

  componentWillMount() {
    const { hullName } = this.props.params;
    if (hullName !== 'noSelection') {
      this.props.addHull(hullName, this.props.selectedHulls);
      /*
      this.setState({
        loading: true,
      });
      */
    }
  }

  componentDidMount() {
    this.getApool(this.props.params.hullName);
  }

  componentWillReceiveProps(nextProps) {
    const currentHull = this.props.params.hullName;
    const nextHull = nextProps.params.hullName;

    if (currentHull !== nextHull) {
      const storedHull = this.props.selectedHulls.find(d => d.name === nextHull);
      this.cancelReq();
      this.getApool(nextHull);
      this.setState({
        apoolLoading: true,
      });
      if (storedHull) {
        // hullActions.setLastSelectedHull(hullName);
        this.props.setLastSelectedHull(storedHull);
      } else {
        this.props.addHull(nextHull, this.props.selectedHulls);
        this.setState({
          loading: true,
        });
      }
    }
  }

  componentDidUpdate(nextProps) {
    const currentHull = this.props.selectedHull;
    const nextHull = nextProps.selectedHull;
    if (currentHull.name !== nextHull.name) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    // hullStore.removeListener('change', this.fetchStore);
    this.cancelReq();
  }

  getApool(hull) {
    this.setState({
      apoolLoading: true,
    });
    this.cancelReq = null;
    // console.log(this.props.params.hullName);
    axios
      // .get(`http://aflowlib.duke.edu/API/chull/apool/?hull=${hull}`, {
      .get(`http://aflowlib.duke.edu/search/ui/API/chull/v1.2/?pprint=${hull}`, {
        cancelToken: new axios.CancelToken((c) => {
          // An executor function receives a cancel function as a parameter
          this.cancelReq = c;
        }),
      })
      .then((res) => {
        let returnString = '';
        res.data.forEach(d => returnString += (d + '\n'));
        this.setState({
          apool: returnString,
          apoolLoading: false,
        });
      });
  }


  downloadPDF() {
    axios({
      url: `http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?pdf=${this.props.selectedHull.name}`,
      method: 'get',
      responseType: 'blob',
      headers: {'Accept':'application/pdf'},
    }).then((res) => {
      this.setState({
        downloadPDFBtnText: 'Complete! (redownload PDF)',
        downloadPDFLoading: false,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aflow_${this.props.selectedHull.name}_hull.pdf`);
      document.body.appendChild(link);
      link.click();
    });
  }

  downloadTXT() {
    axios({
      url: `http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?txt=${this.props.selectedHull.name}`,
      method: 'get',
      responseType: 'blob',
    }).then((res) => {
      this.setState({
        downloadTXTBtnText: 'Complete! (redownload TXT)',
        downloadTXTLoading: false,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aflow_${this.props.selectedHull.name}_hull.txt`);
      document.body.appendChild(link);
      link.click();
    });
  }


  downloadJSON() {
    axios({
      url: `http://aflowlib.duke.edu/search/ui/API/chull/v1.1/?json=${this.props.selectedHull.name}`,
      method: 'get',
      responseType: 'blob',
    }).then((res) => {
      this.setState({
        downloadJSONBtnText: `Complete! (redownload JSON)`,
        downloadJSONLoading: false,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aflow_${this.props.selectedHull.name}_hull.json`);
      document.body.appendChild(link);
      link.click();
    });
  }

  render() {
    if (this.state.loading && this.props.params.hullName !== 'noSelection') {
      return (
        <div className="visualization-row message-container">
          <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw message-body" />
        </div>
      );
    }


    if (this.props.selectedHull && !this.state.loading) {
      const hull = this.props.selectedHull;
      let apoolContent = null;
      if (this.state.apoolLoading) {
        apoolContent = (
          <div className="apool-spinner">
            <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
            <p className="apool__loading-text">Generating... this may take awhile</p>
          </div>
        );
      } else {
        apoolContent = this.state.apool;
      }
      if (hull.dim === 2) {
        return (
          <div>
            <h1 className="hull-title">{hull.name}</h1>
            <div className="download-pdf-container">
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadPDF}
                disabled={this.state.downloadPDFLoading}
              >
                {this.state.downloadPDFBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadTXT}
                disabled={this.state.downloadTXTLoading}
              >
                {this.state.downloadTXTBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadJSON}
                disabled={this.state.downloadJSONLoading}
              >
                {this.state.downloadJSONBtnText}
              </button>
            </div>
            <div className="binary-hull-row">
              {
                // <img src="http://aflowlib.org/images/logo.png" alt="" className="aflow-watermark aflow-watermark--two" />
                // <img src="https://www.nomad-coe.eu/uploads/nomad/images/NOMAD_Logo2.png" alt="" className="nomad-watermark nomad-watermark--two" />
              }
              <BinaryHull
                hull={hull}
                width={2400}
                height={window.innerHeight - 200}
                fullscreen
                resizeHullAxes={this.props.resizeHullAxes}
                pointClickHandler={this.props.pointClickHandler}
                pointHoverHandler={this.props.pointHoverHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </div>
            <div className="apool">
              <h1> Text Output </h1>
              <pre className="apool__output">{apoolContent}</pre>
            </div>
          </div>
        );
      }
      if (hull.dim === 3) {
        const threeContainerStyle = {
          height: window.innerHeight - 100,
          margin: '20px 40px',
          borderRadius: '3px',
          border: '1px solid #eee',
        };
        return (
          <div>
            <h1 className="hull-title">{hull.name}</h1>
            <div className="download-pdf-container">
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadPDF}
                disabled={this.state.downloadPDFLoading}
              >
                {this.state.downloadPDFBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadTXT}
                disabled={this.state.downloadTXTLoading}
              >
                {this.state.downloadTXTBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadJSON}
                disabled={this.state.downloadJSONLoading}
              >
                {this.state.downloadJSONBtnText}
              </button>
            </div>
            <div style={threeContainerStyle}>
              {
                // <img src="http://aflowlib.org/images/logo.png" alt="" className="aflow-watermark aflow-watermark--three" />
                // <img src="https://www.nomad-coe.eu/uploads/nomad/images/NOMAD_Logo2.png" alt="" className="nomad-watermark nomad-watermark--three" />
              }
              <THREEhull
                hull={hull}
                container={'threeScene'}
                plotEntries
                pointClickHandler={this.props.pointClickHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </div>
            <div className="apool">
              <h1> Text Output </h1>
              <pre className="apool__output">{apoolContent}</pre>
            </div>
          </div>
        );
      }
      if (hull.dim === 4) {
        const threeContainerStyle = {
          height: window.innerHeight - 100,
          margin: '20px 40px',
          borderRadius: '3px',
          border: '1px solid #eee',
        };
        return (
          <div>
            <h1 className="hull-title">{hull.name}</h1>
            <div className="download-pdf-container">
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadPDF}
                disabled={this.state.downloadPDFLoading}
              >
                {this.state.downloadPDFBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadTXT}
                disabled={this.state.downloadTXTLoading}
              >
                {this.state.downloadTXTBtnText}
              </button>
              <button
                className="btn btn-purp btn-lg"
                onClick={this.downloadJSON}
                disabled={this.state.downloadJSONLoading}
              >
                {this.state.downloadJSONBtnText}
              </button>
            </div>
            <div style={threeContainerStyle}>
              {
                // <img src="http://aflowlib.org/images/logo.png" alt="" className="aflow-watermark aflow-watermark--three" />
                // <img src="https://www.nomad-coe.eu/uploads/nomad/images/NOMAD_Logo2.png" alt="" className="nomad-watermark nomad-watermark--three" />
              }
              <QuaternaryHull
                hull={hull}
                container={'threeScene'}
                plotEntries
                pointClickHandler={this.props.pointClickHandler}
                sidebarIsVisible={this.props.sidebarIsVisible}
              />
            </div>
            <div className="apool">
              <h1> Text Output </h1>
              <pre className="apool__output">{apoolContent}</pre>
            </div>
          </div>
        );
      }

      if (hull.dim > 4) {
        return (
          <div>
            <h1 className="hull-title">{hull.name}</h1>
            <div className="download-pdf-container">
              <button
                className="btn btn-purp btn-block"
                onClick={this.downloadPDF}
                disabled={this.state.downloadPDFLoading}
              >
                {this.state.downloadPDFBtnText}
              </button>
            </div>
            <div className="apool">
              <h1> APOOL </h1>
              <pre className="apool__output">{apoolContent}</pre>
            </div>
          </div>
        );
      }
    }

    if (this.props.params.hullName === 'noSelection') {
      return (
        <div className="visualization-row message-container">
          <p className="message-body">You have not selected a hull</p>
        </div>
      );
    }

    return <div className="binary-hull-row" />;
  }
  // wws16 - added if dim === 4 block...
}

Visualization.propTypes = propTypes;
Visualization.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    selectedHull: state.hulls.selectedHull,
    selectedHulls: state.hulls.selectedHulls,
    lastSelected: state.hulls.lastSelected,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addHull: (hull, selectedHulls) => {
      dispatch(fetchHull(hull, selectedHulls));
    },
    setLastSelectedHull: hull => dispatch(setSelectedHull(hull)),
    pointClickHandler: auid => dispatch(pointClickHandler(auid)),
    pointHoverHandler: auid => dispatch(pointHoverHandler(auid)),
    resizeHullAxes: (name, yMin, yMax) => {
      dispatch(resizeHullAxes(name, yMin, yMax));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualization);
