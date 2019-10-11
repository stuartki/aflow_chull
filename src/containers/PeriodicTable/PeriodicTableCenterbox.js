import React from 'react';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';

const propTypes = {
  selectedElements: PropTypes.string.isRequired,
  addElements: PropTypes.func.isRequired,
};

class Centerbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedElements: this.props.selectedElements, //pTableStore.getSelectedElements().join(''),
    };
    // this.fetchStore = this.fetchStore.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // pTableStore.on('change', this.fetchStore);
  }

  componentWillUnmount() {
    // pTableStore.removeListener('change', this.fetchStore);
  }

  onEnter(e) {
    if (e.charCode === 13 && e.target.value !== '') {
      hashHistory.push(`hull/${e.target.value}`); // change route
      e.target.value = '';
      // pTableActions.addElements([]);
      this.props.addElements([]);
    }
  }

  handleChange(event) {
    this.setState({ selectedElements: event.target.value });
    if (event.target.value.length) {
      // pTableActions.addElements(event.target.value.split(/(?=[A-Z])/));
      this.props.addElements(event.target.value.split(/(?=[A-Z])/));
    } else {
      // pTableActions.addElements([]);
      this.props.addElements([]);
    }
  }

  handleUndo() {
    if (this.props.selectedElements.length) {
      // pTableStore.addElements([]);
      this.props.addElements([]);
    }
  }

  handleSubmit() {
    if (this.props.selectedElements.length) {
      hashHistory.push(`hull/${this.props.selectedElements}`); // change route
      // pTableStore.addElements([]);
      this.props.addElements([]);
    }
  }

  render() {
    return (
      <div className="center-box">
        <input
          autoComplete="off"
          maxLength="6"
          className="center-box-input"
          placeholder="Add a Hull..."
          value={this.props.selectedElements}
          onChange={this.handleChange}
          onKeyPress={this.onEnter}
          type="text"
        />
        <div className="btn-container">
          <button
            data-toggle="tooltip"
            title="reset"
            className="btn ptable-undo-btn"
            onClick={this.handleUndo}
          >
          undo
          </button>
          <button
            data-toggle="tooltip"
            title="submit"
            className="btn ptable-submit-btn"
            onClick={this.handleSubmit}
          >
          submit
          </button>
        </div>
      </div>
    );
  }
}

Centerbox.propTypes = propTypes;

export default Centerbox;
