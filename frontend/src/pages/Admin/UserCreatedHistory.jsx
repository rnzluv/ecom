// src/pages/UserCreatedHistory.js
import React, { useEffect, useState } from "react";
import API from "../../api.js";
import Navbar from "../../components/Navbar";
import { useToast } from "../../components/ToastProvider";



export default function UserCreatedHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => loadLogs(), []);

  async function loadLogs() {
    try {
      const res = await API.get("/user-created-history");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      toast.show("Failed to load user creation logs", { type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return React.createElement(
      "section",
      { className: "card panel" },
      React.createElement("h2", null, "User Created History"),
      React.createElement("p", null, "Loading...")
    );
  }

  if (logs.length === 0) {
    return React.createElement(
      "section",
      { className: "card panel" },
      React.createElement("h2", null, "User Created History"),
      React.createElement("p", null, "No user creation logs found.")
    );
  }

  return React.createElement(
    "section",
    { className: "card panel" },
    React.createElement("h2", null, "User Created History"),

    React.createElement(
      "table",
      { className: "history-table" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement("th", null, "User Email"),
          React.createElement("th", null, "Name"),
          React.createElement("th", null, "Date Created")
        )
      ),

      React.createElement(
        "tbody",
        null,
        logs.map((log) =>
          React.createElement(
            "tr",
            { key: log._id },
            React.createElement("td", null, log.email),
            React.createElement("td", null, log.name || "—"),
            React.createElement(
              "td",
              null,
              new Date(log.createdAt).toLocaleString()
            )
          )
        )
      )
    )
  );
}
