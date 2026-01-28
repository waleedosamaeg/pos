import React, { useState, useEffect } from "react";
import "@css/register.css";
import { useTranslation } from 'react-i18next';
import axios from "axios"
import variables from "@config/variables.js";

// let permissionCategories = {
//   Sales: ["Create Sale", "Edit Sale", "Delete Sale"],
//   Purchase: ["Create Purchase", "Edit Purchase", "Delete Purchase"],
//   Reports: ["View Reports", "Export Reports"],
//   HR: ["Add Employee", "Edit Employee", "Delete Employee"],
// };


let permissionCategories = {}
const RegisterTabsAnimated = () => {
    const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState("main");
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "Cashier",
    permissions: {},
  });

  useEffect(() => {
    // fetch the permessions as object from the database 
   
   
        
        const permessions = async()=>{
            try { 
                const permessions =   (await axios.get(`${variables.apiUrl}/permessions/all`)).data['data'];
                const  p = permessions.map((item)=>{return item.category}).sort()
                permissionCategories = {}
                permessions.forEach((item)=>{
                    if (!permissionCategories[item.category])  { 
                        permissionCategories[item.category] = []
                    }
                    permissionCategories[item.category].push(item.name)

                })
                console.log(permissionCategories)
              

                  
                const initialPermissions = {};
                Object.values(permissionCategories).flat().forEach((perm) => {
                initialPermissions[perm] = false;
                });
                setFormData((prev) => ({ ...prev, permissions: initialPermissions }));
            }catch (e) { 
                console.log(e)
            }
        
        }
        permessions()

  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        permissions: { ...formData.permissions, [name]: checked },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (formData.password !== formData.confirmPassword) {
    //   alert("Passwords do not match!");
    //   return;
    // }
    alert("Registration successful!");
    console.log("Form Data:", formData);
    
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>{t("register.title")}</h2>

        <div className="tabs">
          <div
            className={`tab ${activeTab === "main" ? "active" : ""}`}
            onClick={() => setActiveTab("main")}
          >
            {t("register.tabs.mainInfo.title")}
          </div>
          <div
            className={`tab ${activeTab === "permissions" ? "active" : ""}`}
            onClick={() => setActiveTab("permissions")}
          >
             {t("register.tabs.permessions.title")}
          </div>
        </div>

        <div className="tab-content">
          <div className={`tab-panel ${activeTab === "main" ? "active" : ""}`}>
            <input
              type="text"
              name="username"
              placeholder={t("register.tabs.mainInfo.fields.username")}
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={t("register.tabs.mainInfo.fields.phone")}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>{t("register.tabs.mainInfo.fields.selectRole")}</option>
              <option value="admin">{t("register.tabs.mainInfo.fields.role.admin")}</option>
              <option value="seller">{t("register.tabs.mainInfo.fields.role.seller")}</option>
              <option value="manager">{t("register.tabs.mainInfo.fields.role.manager")}</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder={t("register.tabs.mainInfo.fields.password")}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder={t("register.tabs.mainInfo.fields.confirmPassword")}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div
            className={`tab-panel ${
              activeTab === "permissions" ? "active" : ""
            }`}
          >
            <div className="permissions-categories">
              {Object.entries(permissionCategories).map(([category, perms]) => (
                <div key={category} className="permission-category">
                  <h4>{category}</h4>
                  <div className="permissions-list">
                    {perms.map((perm) => (
                      <React.Fragment key={perm}>
                        <input
                          type="checkbox"
                          id={perm}
                          name={perm}
                          checked={formData.permissions[perm] || false}
                          onChange={handleChange}
                        />
                        <label htmlFor={perm}>{perm}</label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit">{t("register.submit")}</button>
      </form>
    </div>
  );
};

export default RegisterTabsAnimated;
