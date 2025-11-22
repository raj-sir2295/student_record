import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚡ Supabase setup
const supabaseUrl = "https://vvyihexbcekdwdatknum.supabase.co";
const supabaseKey = "sb_publishable_cJPjYHIBq8Uup1rlQ6S0fQ_lEhHXnJ4";
const supabase = createClient(supabaseUrl, supabaseKey);

function StudentForm() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    course: "",
    fees: ""
  });

  // 1️⃣ Fetch students on page load
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.log("Error fetching students:", error.message);
    } else {
      setStudents(data);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2️⃣ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3️⃣ Handle form submit with safe Supabase insert
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.course || !formData.fees) {
      alert("Please fill all fields!");
      return;
    }

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          name: formData.name,
          mobile: formData.mobile,
          course: formData.course,
          fees: parseInt(formData.fees)
        }
      ])
      .select(); // ⚡ Important: .select() ensures 'data' is returned

    if (error) {
      console.log("Error inserting student:", error.message);
      alert("Failed to insert student: " + error.message);
    } else if (data && data.length > 0) {
      setStudents([...students, data[0]]);
      setFormData({ name: "", mobile: "", course: "", fees: "" });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>Student Name: </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile No: </label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </div>
        <div>
          <label>Course: </label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} />
        </div>
        <div>
          <label>Total Fees: </label>
          <input type="number" name="fees" value={formData.fees} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Add Student</button>
      </form>

      <h3>Student List</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile No</th>
            <th>Course</th>
            <th>Total Fees</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu.id}>
              <td>{stu.name}</td>
              <td>{stu.mobile}</td>
              <td>{stu.course}</td>
              <td>{stu.fees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentForm;
