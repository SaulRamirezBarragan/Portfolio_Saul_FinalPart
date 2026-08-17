import { useEffect, useState } from "react";
import { api } from "./api";

export default function Education() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/api/educations").then(setEntries).catch(err => setError(err.message));
  }, []);

  return <section id="education">
    <div className="page-header"><h1>Educational Background</h1></div>
    {error && <p className="error">{error}</p>}
    {!error && entries.length === 0 && <p>No education records available yet.</p>}
    {entries.map(entry => <article className="education-entry" key={entry._id}>
      <div className="education-subtitle"><div className="education-text"><h2>{entry.education}</h2></div><div className="education-date"><h2>{entry.completion_date}</h2></div></div>
      <div className="education-subtitle mt-0"><div className="education-text"><h3 className="mt-0">{entry.location}</h3></div></div>
      {entry.courses?.length > 0 && <div className="education-courses"><span className="bold">Relevant Courses:</span><table><tbody><tr>{entry.courses.map(course => <td key={course._id}>{course.name}</td>)}</tr></tbody></table></div>}
    </article>)}
  </section>;
}
