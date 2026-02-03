import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const res = await fetch("http://localhost:4000/jobs");
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const submitJob = async () => {
    if (!title || !description) return;

    await fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    loadJobs();
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>OpsPilot — Internal Operations Dashboard</h2>

      <input
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <br /><br />

      <textarea
        placeholder="Job description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: 8, height: 100 }}
      />

      <br /><br />

      <button onClick={submitJob}>Create Job</button>

      <hr />

      {jobs.map((j) => (
        <div key={j.id} style={{ marginBottom: 20 }}>
          <strong>{j.title}</strong>
          <p>{j.description}</p>
          <em>{j.ai_summary}</em>
        </div>
      ))}
    </div>
  );
}

export default App;
