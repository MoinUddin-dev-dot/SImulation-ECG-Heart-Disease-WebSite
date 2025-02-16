import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ simulationData }) => {
  // Validate and process patient data
console.log(simulationData);
console.log("new changes")


  const labels = simulationData?.map((patient) => `Patient ${patient?.patient_id}`) || [];
  const arrivalTimes = simulationData?.map((patient) => patient?.arrival_time) || [];
  const burstTimes = simulationData?.map((patient) => patient?.burst_time) || [];
  const completionTimes = simulationData?.map((patient) => patient?.completion_time) || [];
  const endTimes = simulationData?.map((patient) => patient?.end_time) || [];
  const responseTimes = simulationData?.map((patient) => patient?.response_time) || [];
  const turnAroundTimes = simulationData?.map((patient) => patient?.turn_around_time) || [];
  const waitTimes = simulationData?.map((patient) => patient?.wait_time) || [];

  // Bar chart data and configurations
  const data = {
    labels, // Labels for X-axis
    datasets: [
      {
        label: "Arrival Time",
        data: arrivalTimes,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Burst Time",
        data: burstTimes,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Completion Time",
        data: completionTimes,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "End Time",
        data: endTimes,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Response Time",
        data: responseTimes,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Turnaround Time",
        data: turnAroundTimes,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Wait Time",
        data: waitTimes,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Patient Times Overview",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Patients",
        },
      },
      y: {
        title: {
          display: true,
          text: "Time (in units)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="bg-white h-full w-full p-10 mt-10">
      <h2 className="text-lg font-bold">Patient Data Times Graph</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graph;
