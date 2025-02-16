import React, { useState, useEffect } from "react";

const GanttChart = ({ tasks, servers }) => {

  const [serverTasks, setServerTasks] = useState(
    Array.from({ length: servers }, () => [])
  );

  useEffect(() => {
    const tasksWithServerAssignment = [...tasks];
    const serverAvailability = Array.from({ length: servers }, () => 0); 

    tasksWithServerAssignment.forEach((task) => {
      let assignedServer = -1;
      let earliestTime = Infinity;


      for (let i = 0; i < servers; i++) {
        if (serverAvailability[i] <= task.start_time) {
          assignedServer = i;
          break;
        }
        if (serverAvailability[i] < earliestTime) {
          earliestTime = serverAvailability[i];
          assignedServer = i;
        }
      }

      if (assignedServer !== -1) {
        serverAvailability[assignedServer] = Math.max(
          serverAvailability[assignedServer], 
          task.end_time
        );
        serverTasks[assignedServer].push(task);
      }
    });

    setServerTasks([...serverTasks]);
  }, [tasks, servers]);

  return (
    <>
      {serverTasks.map((tasksForServer, serverIndex) => (
        <div
          key={serverIndex}
          className="server-gantt-chart"
          style={{
            border: "1px solid #ccc",
            margin: "20px 0",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              color: "#333",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Server {serverIndex + 1} Task Gantt Chart
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {tasksForServer.map((task, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: getPriorityColor(task.priority),
                  color: "white",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  minWidth: `50px`,
                  maxWidth: "100%",
                  minHeight: "60px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    color: "#fff",
                  }}
                >
                  Task {task.patient_id}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    color: "#fff",
                  }}
                >
                  {`Start: ${task.start_time}`}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    color: "#fff",
                  }}
                >
                  {`End: ${task.end_time}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

// Helper function to assign colors based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return "#e74c3c"; // Red
    case 2:
      return "#3498db"; // Blue
    case 3:
      return "#2ecc71"; // Green
    default:
      return "#95a5a6"; // Gray
  }
};

export default GanttChart;
