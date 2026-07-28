import http from "./http";
import { handleResponse } from "../components/helper/handleResponse";

class BloodStockService {
  //Blood Stock
  saveBloodStock(data: Object) {
    return http.post("bloodStockTracing/add", data)
      .then((response) => handleResponse(response));
  }
  getBloodStockList() {
    return http.get("bloodStockTracing/list")
      .then((response) => handleResponse(response));
  }
  getApprovedBloodList() {
    return http.get("bloodStockTracing/approvedList")
      .then((response) => handleResponse(response));
  }
  getBloodStockById(id: number) {
    return http.get("bloodStockTracing/" + id)
      .then((response) => handleResponse(response));
  }
  getNextBloodBagId(bloodsource: any) {
    return http.get("bloodStockTracing/nextBloodBagId/" + bloodsource)
      .then((response) => handleResponse(response));
  }
  deleteBloodStock(id: number, user: any) {
    return http.put("bloodStockTracing/delete/" + id + "/by/" + user)
      .then((response) => handleResponse(response));
  }

  //Report
  saveReport(data: Object) {
    return http.post("bloodSerologyTest/add", data)
      .then((response) => handleResponse(response));
  }
  getReportById(id: number) {
    return http.get("bloodSerologyTest/" + id)
      .then((response) => handleResponse(response));
  }
  getReportList() {
    return http.get("bloodSerologyTest/list")
      .then((response) => handleResponse(response));
  }
  deleteReport(id: number, user: string) {
    return http.put("bloodSerologyTest/delete/" + id + "/by/" + user)
      .then((response) => handleResponse(response));
  }

  //CompatibilityTest
  getPatientBloodGroupById(id: number) {
    return http.get("bloodSerologyTestByPatientId/" + id)
      .then((response) => handleResponse(response));
  }
  saveCompatibilityTest(data: Object) {
    return http.post("bloodCompatibilityTest/add", data)
      .then((response) => handleResponse(response));
  }
  getCompatibilityTestList() {
    return http.get("bloodCompatibilityTest/list")
      .then((response) => handleResponse(response));
  }
  getCompatibilityTestById(id: number) {
    return http.get("bloodCompatibilityTest/" + id)
      .then((response) => handleResponse(response));
  }
  deleteCompatibilityTest(id: number, user: string) {
    return http.put("bloodCompatibilityTest/delete/" + id + "/by/" + user)
      .then((response) => handleResponse(response));
  }
  updateStockStatus(bloodBagId: string, user: string) {
    return http.put("bloodStockTracing/updateStatus/" + bloodBagId + "/by/" + user)
      .then((response) => handleResponse(response));
  }
  getStockByBloodBagId(bloodBagId: string) {
    return http.get("bloodStockTracing/bloodBag/" + bloodBagId)
      .then((response) => handleResponse(response));
  }
}

export default new BloodStockService();
