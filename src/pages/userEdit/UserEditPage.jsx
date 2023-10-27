import React, { useState, useEffect } from 'react';
import axios from "axios";
import ContentHeading from '../../components/ContentHeading';
import Sidebar from '../../components/sidebar/Sidebar'
import "./UserEditPage.css";
import { useNavigate } from "react-router-dom";
import Layout from '../../components/Layout';
import Dropdown from '../../components/Dropdown';

const UserEditPage = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [mail, setMail] = useState("");
    const [role, setRole] = useState("");
    //const [userId] = useState(2); // Geçici olarak konulmuştur localstorege'a eklendiğinde kendiliğinden veriyi çekecektir.
    const userId = localStorage.getItem("userId");
    const [userEmail, setUserEmail] = useState("");
    const token = localStorage.getItem("token");
    const selectedRole = localStorage.getItem("selectedRole")
    const navigate = useNavigate();    
    const options = [
        { label: "STUDENT", value: "STUDENT" },
        { label: "MASTER_TRAINER", value: "MASTER_TRAINER" },
        { label: "ASSISTANT_TRAINER", value: "ASSISTANT_TRAINER" },
    ];
    const [initialUserData, setInitialUserData] = useState({
        name: "",
        surname: "",
        mail: "",
        role: "",
    });

       

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let response;
         switch (selectedRole) {
            case "Student":
                response = await axios.get(`http://localhost:8090/api/v1/student/findUserByStudentOid/${userId}`, {
           headers: {
               Authorization: `Bearer ${token}`,
           },
       });
                break;
            case "Trainer":
                response = await axios.get(`http://localhost:8090/api/v1/trainer/findUserByTrainerOid/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
         
                break;
         
            default: response = await axios.get(`http://localhost:8090/api/v1/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
                break;
         }

            const data = response.data;

            setName(data.firstName);
            setSurname(data.lastName);
            setMail(data.email);
            setUserEmail(data.email);
            setRole(data.authorizedRole);

            setInitialUserData({
                name: data.firstName,
                surname: data.lastName,
                mail: data.email,
                role: data.authorizedRole,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            console.log(error);
        }
    };

    const handleChange = (event) => {
        const { id, value } = event.target;

        if (id === "userEmail") {
            setUserEmail(value);
        }
    };

    const handleCancel = () => {
        setName(initialUserData.name);
        setSurname(initialUserData.surname);
        setMail(initialUserData.mail);
        setRole(initialUserData.role);
       
        switch (selectedRole) {
            case "Student":
                localStorage.removeItem("selectedRole")
                navigate("/ogrencilistesi");
                break;
            case "Trainer":
                localStorage.removeItem("selectedRole")
                navigate("/egitmenlistesi");
                break;
            default:
                navigate("/kullanici")
                break;
        }
        
    };

    const namehandleChange = (event) => {
        event.preventDefault
        setName(event.target.value);
    };
    const surnamehandleChange = (event) => {
        event.preventDefault
        setSurname(event.target.value);
    };
    const mailhandleChange = (event) => {
        event.preventDefault
        setMail(event.target.value);
    };
    const rolehandleChange = (event) => {
        event.preventDefault
        setRole(event);
    };

    const handleSubmit = async () => {
        const firstName = name;
        const lastName = surname;
        const email = mail;
        const authorizedRole = role.label;
        console.log(role); 
        axios.put(
            `http://localhost:8090/api/v1/user/update/${userEmail}`,
            {
                firstName: name,
                lastName: surname,
                email: email,
                authorizedRole: authorizedRole,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((response) => {
            console.log("Update successful:", response.data)            
        })
            .catch((error) => {
                console.error("Error updating data:", error)
            })
        console.log(name);
        console.log(firstName);
        console.log(lastName);
        console.log(role.label);        
        navigate("/kullanici");
    };


    return (
        <Layout>
          <div className='user-edit-page'>
            <div className='outer-react'>
              <ContentHeading />
              <div className='inner-react'>
                <div className="inner2-react">
                  <div className="inputs">
                    <div className="input-field">
                      <label htmlFor="name">İsim</label>
                      <input type="text" id='name' value={name} onChange={namehandleChange} />
                    </div>
                    <div className="input-field">
                      <label htmlFor="surname">Soyisim</label>
                      <input type="text" id='surname' value={surname} onChange={surnamehandleChange} />
                    </div>
                    <div className="input-field">
                      <label htmlFor="mail">Email</label>
                      <input type="text" id='mail' value={mail} onChange={mailhandleChange} />
                    </div>
                    <div className="input-field">
                      <label htmlFor="role">Role</label>
                      <select id='role' value={role} onChange={rolehandleChange}>
                        <option value="admin">Admin</option>
                        <option value="manager">Yönetici</option>
                        <option value="master_trainer">Master Trainer</option>
                        <option value="assistant_trainer">Assistant Trainer</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  </div>
                  <div className='buttons'>
                    <button className='kaydet' onClick={handleSubmit}>KAYDET</button>
                    <button className='vazgec' onClick={handleCancel}>VAZGEÇ</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );      
};

export default UserEditPage;