import http from "./http";
import { handleResponse } from "../components/helper/handleResponse";

class DonorService {
  //patients
  getPatientInformation(data: any) {
    return http.get(`patients?id=${data}`).then((response) => handleResponse(response));
  }
  getAllActivePatients(data: any) {
    return http.get(`patientsById?identifier=${encodeURIComponent(data)}`).then((response) => handleResponse(response));
  }
  //DonorForm
  saveDonorInfo(data: Object) {
    return http.post("donor/add", data).then((response) => handleResponse(response));
  }

  getAllBloodDonor() {
    return http.get("donor/list").then((response) => handleResponse(response));
  }

  getBloodDonorById(id: number) {
    return http.get("donor/" + id).then((response) => handleResponse(response));
  }

  deleteBloodDonor(id: number, user: any) {
    return http.put("donor/delete/" + id + "/by/" + user).then((response) => handleResponse(response));
  }
  //Questionnaire
  saveQuestionnaire(data: Object) {
    return http.post("questionnaire/add", data).then((response) => handleResponse(response));
  }

  getAllQuestionnaire() {
    return http.get("questionnaire/list").then((response) => handleResponse(response));
  }

  getQuestionnaireById(id: number) {
    return http.get("questionnaire/" + id).then((response) => handleResponse(response));
  }

  deleteQuestionnaire(id: number, user: any) {
    return http.put("questionnaire/delete/" + id + "/by/" + user).then((response) => handleResponse(response));
  }

  //Physical Suitability
  savePhysicalSuitability(data: Object) {
    return http.post("bloodDonorPhysicalSuitability/add", data).then((response) => handleResponse(response));
  }
  getPhysicalSuitabilityResults() {
    return http.get("bloodDonorPhysicalSuitability/list").then((response) => handleResponse(response));
  }
  getPhysicalTestInfoById(id: number) {
    return http.get("bloodDonorPhysicalSuitability/" + id).then((response) => handleResponse(response));
  }
  deletePhysicalTest(id: number, user: any) {
    return http.put("bloodDonorPhysicalSuitability/delete/" + id + "/by/" + user).then((response) => handleResponse(response));
  }
}

export default new DonorService();
