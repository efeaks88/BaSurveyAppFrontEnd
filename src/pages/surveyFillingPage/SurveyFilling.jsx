import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SurveyService from "../../services/SurveyService.js";
import StudentService from "../../services/StudentService.js";
import TrainerTagService from "../../services/TrainerTagService.js";
import "./surveyfilling.css";
import MultipleChoiceSurvey from "./MultipleChoiceSurvey";
import MultiOptionalMultiSelectableSurvey from "./MultiOptionalMultiSelectableSurvey.jsx";
import MultiOptionalMultiSelectableAndOtherSurvey from "./MultiOptionalMultiSelectableAndOtherSurvey.jsx";
import LikertSurvey from "./LikertSurvey";
import OpenEndedSurvey from "./OpenEndedSurvey.jsx";
import MatrixSurveyPreview from "./MatrixSurvey.jsx";
import LocalStorageServiceAuth from "../../store/auth-store.js"
import LocalStorageServiceUser from "../../store/user-store.js"
import axios from "axios";
import AuthService from "../../services/AuthService.js";
function SurveyFilling() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tokenValue = searchParams.get("Value");
  const [selectedOption, setSelectedOption] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [masterTrainers, setMasterTrainers] = useState({});
  const [assistantTrainers, setAssistantTrainers] = useState({});
  const[requiredIndexes,setRequiredIndexes]=useState([]);
  useEffect(() => {
    console.log(tokenValue);

    const fetchTrainersData = async () => {
      try {
        const response = await TrainerTagService.findTrainersEmailToken(
          tokenValue
        );
        const trainersResponses = response.data;

        trainersResponses.forEach((trainerRes) => {
          if (trainerRes.authorizedRole === "MASTER_TRAINER") {
            setMasterTrainers({
              firstName: trainerRes.firstName,
              lastName: trainerRes.lastName,
              authorizedRole: trainerRes.authorizedRole,
            });
          } else if (trainerRes.authorizedRole === "ASSISTANT_TRAINER") {
            setAssistantTrainers({
              firstName: trainerRes.firstName,
              lastName: trainerRes.lastName,
              authorizedRole: trainerRes.authorizedRole,
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    const fetchStudentData = async () => {
      try {
        const response = await AuthService.findSurveyByEmail(
          tokenValue
        );
        
         LocalStorageServiceAuth.setToken(response.data.token)
         LocalStorageServiceAuth.setIsAuthenticated();
         setFirstName(response.data.firstName);
         setLastName(response.data.lastName);
        fetchTrainersData();
        fetchData();
      } catch (error) {
        console.error(error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await SurveyService.findSurveyByEmailToken(tokenValue);
        console.log(response.data.requiredQuestionIndexes);
        setRequiredIndexes(response.data.requiredQuestionIndexes);
        setQuestions(response.data.questions);
        setSurveyTitle(response.data.surveyTitle);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchStudentData();
    
  }, []);
  const [upData, setUpData] = useState([]);
  const renderComponent = (type, options, questionId, question) => {
    console.log(type);
    if (type === "Çoktan Seçmeli") {
      return (
        <MultipleChoiceSurvey
          multipleQuestionOid={questionId}
          multipleOptions={options}
          veriTasi={(veri) => {
            setUpData(veri);
          }}
        />
      );
    } else if (type === "Likert") {
      return (
        <LikertSurvey
          likertQuestionOid={questionId}
          likertOptions={options}
          veriTasi={(veri) => {
            setUpData(veri);
          }}
        />
      );
    } else if (type === "Açık Uçlu") {
      return <OpenEndedSurvey />;
    } else if (
      type === "Çok Seçenekli Çok Seçilebilir ve Seçenek Girilebilir"
    ) {
      return (
        <MultiOptionalMultiSelectableAndOtherSurvey
          multiOptionalMultiSelectableAndOtherQuestionOid={questionId}
          multiOptionalMultiSelectableAndOtherOptions={options}
        />
      );
    } else if (type === "Çok Seçenekli Çok Seçilebilir") {
      return (
        <MultiOptionalMultiSelectableSurvey
          multiOptionalMultiSelectableOid={questionId}
          multiOptionalMultiSelectableOptions={options}
        />
      );
    } else if (type === "Matriks") {  //Matrix durumu icin kontrol

      return(
        <MatrixSurveyPreview options={options} question={question}/>
      )} else {
      return null;
    }
  };
  console.log(upData);

  return (
    <div className="flex flex-col grid-flow-col  items-center bg-[#8dc2ec] min-h-screen  rounded relative">
      <div className="bg-white mt-9 rounded flex flex-col bg-[#e8f2fb] w-1/2 p-8">
        <h2 className="text-3xl font-bold text-center mb-4 pt-4 ">
          {surveyTitle}
        </h2>
        <p className="text-justify pt-2 px-4 mb-7 text-l">
          Merhaba Arkadaşlar, <br />
          Sizlere daha iyi destek olabilmek adına hazırlamış olduğumuz Boost
          Eğitim Süreci Anketini doldurmanızı rica ederiz. Teşekkürler
          <br />
          <br />
          Merhaba,{" "}
          <span className="font-bold">
            {firstName} {lastName}
          </span>{" "}
          .. Bu formu gönderdiğinizde, sahibi adınızı ve e-posta adresinizi
          görür.
          <br /> <br />
          Uzman Eğitmen:{" "}
          <span className="font-bold">
            {masterTrainers.firstName} {masterTrainers.lastName}
          </span>
          <br />
          Asistan Eğitmen:{" "}
          <span className="font-bold">
            {assistantTrainers.firstName} {assistantTrainers.lastName}
          </span>
          <br />
          <br />
          <strong className="text-red-700">Gerekli*</strong>
        </p>
        {questions.map((question, index) =>
          question.questionType !== "Matriks" ? (   //Matrix durumu icin sorular sutun olarak geldiginden matrixe ozel ternary kontrolu yapildi
            <div key={index} className="m-2 p-2">
              <p className="">
                {index + 1}. {question.questionString}
                {requiredIndexes.includes(index) && (
                  <span className="text-red-700 text-xl"> *</span>
                )}
              </p>
              <div className="flex flex-row items-center">
                {renderComponent(
                  question.questionType,
                  question.options,
                  question.oid
                )}
              </div>
            </div>
          ) : (
            <div key={index} className="m-2 p-2 flex gap-2">
              <p className="">{index + 1}.</p>
              <div className="flex flex-row">
                {renderComponent(
                  question.questionType,
                  question.options,
                  question.oid,
                  question.questionString
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SurveyFilling;
