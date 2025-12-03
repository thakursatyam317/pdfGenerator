import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState({
    patient: { name: "", age: "", gender: "", id: "" },
    doctor: { name: "", department: "", id: "", registration: "" },
    diagnosis: [],
    medicines: [],
    checkups: [],
    notes: ""
  });

  const [diagInput, setDiagInput] = useState({ name: "", icd: "", note: "" });
  const [medInput, setMedInput] = useState({ name: "", dosage: "", meal: "", days: "" });
  const [checkInput, setCheckInput] = useState({ name: "", urgent: false, note: "" });

  const addDiagnosis = () => {
    setData({ ...data, diagnosis: [...data.diagnosis, diagInput] });
    setDiagInput({ name: "", icd: "", note: "" });
  };

  const addMedicine = () => {
    setData({ ...data, medicines: [...data.medicines, medInput] });
    setMedInput({ name: "", dosage: "", meal: "", days: "" });
  };

  const addCheckup = () => {
    setData({ ...data, checkups: [...data.checkups, checkInput] });
    setCheckInput({ name: "", urgent: false, note: "" });
  };

  const submitPrescription = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4500/api/prescription/createPDF",
        data
      );

      alert("Prescription PDF Generated!");
      console.log("PDF:", response.data.pdfUrl);
      console.log("Full Response:", response);

    } catch (error) {
      console.log(error);
      alert("Error creating PDF");
    }
  };

  return (
    <div>
      <h2>Prescription Form</h2>

      {/* PATIENT */}
      <input placeholder="Patient Name" onChange={(e) =>
        setData({ ...data, patient: { ...data.patient, name: e.target.value } })
      } />

      <input placeholder="Patient Age" onChange={(e) =>
        setData({ ...data, patient: { ...data.patient, age: e.target.value } })
      } />

      <input placeholder="Gender" onChange={(e) =>
        setData({ ...data, patient: { ...data.patient, gender: e.target.value } })
      } />

      <input placeholder="Patient ID" onChange={(e) =>
        setData({ ...data, patient: { ...data.patient, id: e.target.value } })
      } />

      {/* DOCTOR */}
      <input placeholder="Doctor Name" onChange={(e) =>
        setData({ ...data, doctor: { ...data.doctor, name: e.target.value } })
      } />

      <input placeholder="Department" onChange={(e) =>
        setData({ ...data, doctor: { ...data.doctor, department: e.target.value } })
      } />

      <input placeholder="Doctor ID" onChange={(e) =>
        setData({ ...data, doctor: { ...data.doctor, id: e.target.value } })
      } />

      <input placeholder="Registration No" onChange={(e) =>
        setData({ ...data, doctor: { ...data.doctor, registration: e.target.value } })
      } />

      {/* DIAGNOSIS */}
      <h3>Add Diagnosis</h3>
      <input placeholder="Name" value={diagInput.name}
        onChange={(e) => setDiagInput({ ...diagInput, name: e.target.value })} />

      <input placeholder="ICD" value={diagInput.icd}
        onChange={(e) => setDiagInput({ ...diagInput, icd: e.target.value })} />

      <input placeholder="Note" value={diagInput.note}
        onChange={(e) => setDiagInput({ ...diagInput, note: e.target.value })} />

      <button onClick={addDiagnosis}>Add Diagnosis</button>

      {/* MEDICINES */}
      <h3>Add Medicine</h3>
      <input placeholder="Medicine" value={medInput.name}
        onChange={(e) => setMedInput({ ...medInput, name: e.target.value })} />

      <input placeholder="Dosage" value={medInput.dosage}
        onChange={(e) => setMedInput({ ...medInput, dosage: e.target.value })} />

      <input placeholder="Meal" value={medInput.meal}
        onChange={(e) => setMedInput({ ...medInput, meal: e.target.value })} />

      <input placeholder="Days" value={medInput.days}
        onChange={(e) => setMedInput({ ...medInput, days: e.target.value })} />

      <button onClick={addMedicine}>Add Medicine</button>

      {/* CHECKUPS */}
      <h3>Add Checkup</h3>
      <input placeholder="Test Name" value={checkInput.name}
        onChange={(e) => setCheckInput({ ...checkInput, name: e.target.value })} />

      <input placeholder="Note" value={checkInput.note}
        onChange={(e) => setCheckInput({ ...checkInput, note: e.target.value })} />

      <label>
        Urgent:
        <input type="checkbox" checked={checkInput.urgent}
          onChange={(e) => setCheckInput({ ...checkInput, urgent: e.target.checked })} />
      </label>

      <button onClick={addCheckup}>Add Checkup</button>

      {/* NOTES */}
      <textarea placeholder="Doctor Notes"
        onChange={(e) => setData({ ...data, notes: e.target.value })}></textarea>

      {/* SUBMIT */}
      <button onClick={submitPrescription}>Submit Prescription</button>
    </div>
  );
};

export default App;
