import React from "react";
import { withRouter } from "react-router-dom";
import DonorService from "../../services/DonorService";

class AddPhysicalSuitabilityTest extends React.Component<any, any> {
  dataConfig: any = {};
  changeHandler = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };

  submitHandler = (event: any) => {
    event.preventDefault();
    this.dataConfig = {
      bloodDonorId: this.state.bloodDonorId,
      donorHemoglobin: this.state.donorHemoglobin,
      donorWeight: this.state.donorWeight,
      donorBloodPressure: this.state.donorBloodPressure,
      donorPulseRate: this.state.donorPulseRate,
      donorTemperature: this.state.donorTemperature,
      donorBloodGroup: this.state.donorBloodGroup,
      donorBloodGroupRhesus: this.state.donorBloodGroupRhesus,
      donorSelection: this.state.donorSelection,
    };
    console.log(this.dataConfig);
    this.submitPhysicalTestInfo(this.dataConfig);
  };
  constructor(props: any) {
    super(props);
    this.state = {
      bloodDonorId: "",
      donorHemoglobin: "",
      donorWeight: "",
      donorBloodPressure: "",
      donorPulseRate: "",
      donorTemperature: "",
      donorBloodGroup: "",
      donorBloodGroupRhesus: "",
      donorSelection: "",
      error: null,
      notification: "",
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submitPhysicalTestInfo = this.submitPhysicalTestInfo.bind(this);
  }

  componentDidMount() {
    console.log(this.props.match.params.donorId);
    this.setState({
      bloodDonorId: this.props.match.params.donorId,
    });
  }

  submitPhysicalTestInfo(dataConfig: any) {
    DonorService.savePhysicalSuitability(dataConfig).then((res) => {
      console.log(res);
      if (res.status === 201) {
        this.setState({
          notification: "Physical Suitability Test is added successfully",
        });
        this.props.history.push("/donorPhysicalSuitability/test/list");
      }
      this.setState({
        notification: "Please add valid and non duplicate values",
      });
    });
  }

  render() {
    const { notification, bloodDonorId } = this.state;
    return (
      <div className="container-fluid m-1 p-1">
        <h2 className="text-info text-center">Physical Suitability Test</h2>
        <div className="container p-1 m-1">
          <form className="form" onSubmit={this.submitHandler}>
            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="bloodDonorId">Donor ID</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="number"
                  name="bloodDonorId"
                  id="bloodDonorId"
                  defaultValue={bloodDonorId}
                  readOnly
                  onChange={this.changeHandler}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorHemoglobin">Hemoglobin (g/dl)</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="number"
                  name="donorHemoglobin"
                  id="donorHemoglobin"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorWeight">Weight (kg)</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="number"
                  name="donorWeight"
                  id="donorWeight"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorBloodPressure">
                  Blood Pressure (low/high mmHg)
                </label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  name="donorBloodPressure"
                  id="donorBloodPressure"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorPulseRate">Pulse Rate (b/m)</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="number"
                  name="donorPulseRate"
                  id="donorPulseRate"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorTemperature">
                  Temperature (<sup>o</sup>C)
                </label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="number"
                  name="donorTemperature"
                  id="donorTemperature"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorBloodGroup">Blood Group</label>
              </div>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  name="donorBloodGroup"
                  id="donorBloodGroup"
                  required
                  onChange={this.changeHandler}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorBloodGroupRhesus">
                  Blood Group Rhesus
                </label>
              </div>
              <div className="col-8">
                <select
                  className="form-control"
                  name="donorBloodGroupRhesus"
                  id="donorBloodGroupRhesus"
                  required
                  onChange={this.changeHandler}
                >
                  <option value="">Select</option>
                  <option value="Rh-Positive">Rh-Positive</option>
                  <option value="Rh-Negative">Rh-Negative</option>
                </select>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4 text-right">
                <label htmlFor="donorSelection">Permission</label>
              </div>
              <div className="col-8">
                <select
                  className="form-control"
                  name="donorSelection"
                  id="donorSelection"
                  required
                  onChange={this.changeHandler}
                >
                  <option value="">Select</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-4"></div>
              <div className="col-3 m-1 p-1 float-right text-right">
                <input
                  type="submit"
                  className="form-control btn btn-success m-1 p-1"
                  value="Save"
                />
              </div>
              <div className="col-3 m-1 p-1 float-right text-right">
                <input
                  type="reset"
                  className="form-control btn btn-danger m-1 p-1"
                  value="Reset"
                />
              </div>
            </div>
          </form>
          <div className="text-danger m-1 p-1">
            <p className="text-center bg-info font-weight-bold">
              {notification}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AddPhysicalSuitabilityTest);
