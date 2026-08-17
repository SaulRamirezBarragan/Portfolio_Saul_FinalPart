import { useEffect, useState } from "react";
import { api } from "./api";

function imageSource(image) {
  if (!image) return "";
  if (image.startsWith("data:") || image.startsWith("http")) return image;
  return `data:image/jpeg;base64,${image}`;
}

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/projects")
      .then(setProjects)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section id="project">
      <div className="page-header">
        <h1>Recent Projects</h1>
      </div>

      {error && <p className="error">{error}</p>}
      {!error && projects.length === 0 && (
        <p>No project records available yet.</p>
      )}

      {projects.map((project) => (
        <article className="project-card" key={project._id}>
          <div className="project-subtitle">
            <div className="project-text">
              <h2>{project.title}</h2>
            </div>
            <div className="project-date">
              <h2>{project.completion_date}</h2>
            </div>
          </div>

          <div className="project-text mt-0">
            <h3 className="mt-0">{project.location}</h3>
          </div>

          <div className="project-body">
            <div className="project-text">
              <p>{project.description}</p>
            </div>
            {project.image && (
              <div className="project-img">
                <img
                  src={imageSource(project.image)}
                  width="360"
                  height="260"
                  alt={project.title}
                />
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
