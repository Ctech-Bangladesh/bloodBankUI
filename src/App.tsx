import React, { FC, useContext } from "react";
import appLogo from "./govtlogo.png";
import "./App.scss";
import MainLayout from "./components/layout/MainLayout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DonorMedicalAssessment from "./components/donor/DonorMedicalAssessment";
import AssessmentQuestionnaire from "./components/donor/AssessmentQuestionnaire";
import PhysicalSuitability from "./components/donor/PhysicalSuitability";
import Header from "./components/layout/Header";
import AddQuestionnaire from "./components/donor/AddQuestionnaire";
import AddDonorInfo from "./components/donor/AddDonorInfo";
import AddPhysicalSuitabilityTest from "./components/donor/AddPhysicalSuitabilityTest";
import { LangContext } from "./context/lang";
import Footer from "./components/layout/footer";
import AddBloodStock from "./components/bloodStock/AddBloodStock";
import BloodStock from "./components/bloodStock/BloodStockList";

const App: FC = () => {
  const { dispatch: { translate } } = useContext(LangContext);
  return (
    <div className="App">
      <div className="row App-header p-2">
        <div className="col-1 float-left">
          <img src={appLogo} className="App-logo" alt="logo" />
        </div>
        <div className="col-4">
          <h2 className="text-left p-0 m-0">{translate("title")}</h2>
        </div>
        <div className="col-7">
          <Header translate={translate} />
        </div>
      </div>
      <Router>
        <Switch>
          <Route exact path="/">
            <MainLayout translate={translate} />
          </Route>
          <Route exact path="/donor/list">
            <DonorMedicalAssessment translate={translate} />
          </Route>
          <Route exact path="/donor/add">
            <AddDonorInfo translate={translate} />
          </Route>
          <Route exact path="/donor/:id">
            <AddDonorInfo translate={translate} />
          </Route>

          <Route exact path="/questionnaire/add">
            <AddQuestionnaire translate={translate} />
          </Route>
          <Route exact path="/questionnaire/list">
            <AssessmentQuestionnaire translate={translate}/>
          </Route>
          <Route exact path="/questionnaire/:id">
            <AddQuestionnaire translate={translate} />
          </Route>
          <Route exact path="/donorPhysicalSuitability/test/list">
            <PhysicalSuitability translate={translate} />
          </Route>
          <Route exact path="/donorPhysicalSuitability/test/add/:donorId">
            <AddPhysicalSuitabilityTest translate={translate} />
          </Route>
          <Route exact path="/donorPhysicalSuitability/test/:donorId/:id">
            <AddPhysicalSuitabilityTest translate={translate} />
          </Route>

          <Route exact path="/blood/:donorId/stock/add">
            <AddBloodStock translate={translate} />
          </Route>
          <Route exact path="/blood/:donorId/stock/:id">
            <AddBloodStock translate={translate} />
          </Route>
          <Route exact path="/blood/stock/list">
            <BloodStock translate={translate} />
          </Route>
        </Switch>
      </Router>
      <footer>
        <Footer translate={translate} />
      </footer>
    </div>
  );
}

export default App;
