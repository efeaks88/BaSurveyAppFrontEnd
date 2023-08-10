import axios from "axios";

const UPDATE_TYPE = "http://localhost:8090/api/v1/questiontypes/update-question-type-by-type-string";
const CREATE_TYPE = "http://localhost:8090/api/v1/questiontypes/create-question-type";
const GET_ALL_TYPE = "http://localhost:8090/api/v1/questiontypes/get-all-question-type";
const DELETE = `http://localhost:8090/api/v1/questiontypes/delete/`;

class QuestionTypeService {
  async updateType(updateType) {
    return await axios.put(UPDATE_TYPE, updateType, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  async createType(createType) {
    return await axios.post(CREATE_TYPE, createType, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  async getAllType() {
    return await axios.get(GET_ALL_TYPE, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  async delete(id) {
    const config = {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };
    return await axios.delete(DELETE + id, config);
    }
}

export default new QuestionTypeService();
