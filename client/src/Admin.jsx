import { useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./auth";

const configs = {
  projects: {
    label: "Projects",
    addLabel: "Add Project",
    fields: ["title", "completion_date", "location", "description", "image"],
  },
  educations: {
    label: "Education",
    addLabel: "Add Education",
    fields: ["education", "completion_date", "location", "courses"],
  },
  contacts: {
    label: "Contacts",
    addLabel: "Add Contact",
    fields: ["firstname", "lastname", "email", "message", "status"],
  },
};

const emptyRecord = (fields) =>
  Object.fromEntries(fields.map((field) => [field, ""]));

const formValue = (type, value) => {
  if (type !== "educations" || !value) return value;

  return {
    ...value,
    courses: (value.courses || [])
      .map((course) => course.name || course)
      .join(", "),
  };
};

function RecordForm({ type, value, onSave, onCancel }) {
  const [form, setForm] = useState(
    formValue(type, value) || emptyRecord(configs[type].fields),
  );

  const updateField = (field, nextValue) => {
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <form className="record-form" onSubmit={submit}>
      {configs[type].fields.map((field) => {
        const isLongText = ["description", "message", "courses"].includes(field);
        const isEmail = field === "email";
        const isDate = field === "completion";
        const isImage = field === "image";
        const isStatus = field === "status";

        return (
          <label key={field}>
            {field}
            {isStatus ? (
              <input
                type="checkbox"
                checked={Boolean(form[field])}
                onChange={(event) => updateField(field, event.target.checked)}
              />
            ) : isImage ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  required={!form[field]}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => updateField(field, reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
                {form[field] && <small>Image selected</small>}
              </>
            ) : isLongText ? (
              <textarea
                required={field !== "courses"}
                value={form[field] || ""}
                onChange={(event) => updateField(field, event.target.value)}
              />
            ) : (
              <input
                required={field !== "completion"}
                type={isEmail ? "email" : isDate ? "date" : "text"}
                value={
                  form[field]
                    ? isDate
                      ? String(form[field]).slice(0, 10)
                      : form[field]
                    : ""
                }
                onChange={(event) => updateField(field, event.target.value)}
              />
            )}
          </label>
        );
      })}

      <button>{value ? "Save changes" : configs[type].addLabel}</button>
      {value && (
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [active, setActive] = useState("projects");
  const [records, setRecords] = useState({
    projects: [],
    educations: [],
    contacts: [],
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const loadRecords = async () => {
    try {
      const entries = await Promise.all(
        Object.keys(configs).map(async (type) => [
          type,
          await api(`/api/${type}`),
        ]),
      );

      setRecords(Object.fromEntries(entries));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadRecords, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveRecord = async (data) => {
    try {
      const path = `/api/${active}${editing ? `/${editing._id}` : ""}`;
      const method = editing ? "PUT" : "POST";

      await api(path, {
        method,
        body: JSON.stringify(data),
      });

      setEditing(null);
      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await api(`/api/${active}/${id}`, { method: "DELETE" });
      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <section className="auth-card">
        <h1>Admin area</h1>
        <p>Please sign in first.</p>
      </section>
    );
  }

  if (user.role !== "admin") {
    return (
      <section className="auth-card">
        <h1>Access denied</h1>
        <p>Only administrators can access the dashboard.</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Signed in as {user.role}</p>
          <h1>Portfolio dashboard</h1>
        </div>
      </div>

      <div className="tabs">
        {Object.entries(configs).map(([type, config]) => (
          <button
            key={type}
            className={active === type ? "active" : "secondary"}
            onClick={() => {
              setActive(type);
              setEditing(null);
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {user.role === "admin" && (
        <RecordForm
          key={`${active}-${editing?._id || "new"}`}
          type={active}
          value={editing}
          onSave={saveRecord}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="records">
        {records[active].map((record) => (
          <article className="record" key={record._id}>
            <h3>
              {record.education ||
                record.title ||
                `${record.firstname} ${record.lastname}`}
            </h3>
            <p>
              {record.location || record.description || record.message || record.email}
            </p>

            {active === "contacts" && (
              <p className={record.status ? "success" : "error"}>
                {record.status ? "Seen" : "Not seen"}
              </p>
            )}

            {user.role === "admin" && (
              <div>
                <button onClick={() => setEditing(record)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => removeRecord(record._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
