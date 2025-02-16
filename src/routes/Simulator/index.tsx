

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../globalStyles.css";
import Input from "../../components/Input";
import {
  getArrivalTimes,
  getPriorities,
  getServiceTimes,
} from "../../modules/simulator/utils";
import {
  Patient,
  serve_highest_priority_patient,
} from "../../modules/simulator/patient";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Title from "../../components/Title";
import PerformanceMeasures from "../../components/PerformanceMeasures";
import Loader from "../../components/Loader";
import AveragePerformanceMeasures from "../../components/AveragePerformanceMeasures";
import Graph from "../../components/Graph";
import GanttChart from "../../components/GanttChart";

function Simulator() {
  const location = useLocation();
  const { isPriorityEnabled, model } = location.state;

  const [arrivalMean, setArrivalMean] = useState();
  const [serviceMean, setServiceMean] = useState();
  const [servers, setNumberOfServers] = useState();
  const [simData, setSimData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [showChiSquareTable, setShowChiSquareTable] = useState(false);

  const [averageWaitTimeList, setAverageWaitTimeList] = useState([]);
  const [averageResponseTimeList, setAverageResponseTimeList] = useState([]);
  const [averageTurnAroundTimeList, setAverageTurnAroundTimeList] = useState(
    []
  );
  const [showAveragePerformanceMeasures, setShowAveragePerformanceMeasures] =
    useState(false);

    const [chiSquareData, setChiSquareData] = useState([]);
    const [chiSquareResult, setChiSquareResult] = useState("");
    const [chiSquareStatistic, setChiSquareStatistic] = useState(0);
    const [criticalValue, setCriticalValue] = useState(0);

  const A = 55;
  const M = 1994;
  const Z = 10112166;
  const C = 9;
  const a = 1;
  const b = 3;

  const arrivalTimes = getArrivalTimes(arrivalMean);
  const serviceTimes = servers
  ? getServiceTimes(arrivalTimes.arrivalTimes.length, serviceMean)
  : [];

  const priorities = isPriorityEnabled
    ? getPriorities(arrivalTimes.arrivalTimes.length, A, M, Z, C, a, b)
    : Array.from({ length: arrivalTimes.arrivalTimes.length }, () => 1);

  const dataLength = simData.length;
  const averageTurnAroundTime =
    simData.reduce((total, current) => total + current.turn_around_time, 0) /
    dataLength;
  const averageResponseTime =
    simData.reduce((total, current) => total + current.response_time, 0) /
    dataLength;
  const averageWaitTime =
    simData.reduce((total, current) => total + current.wait_time, 0) /
    dataLength;

    const poissonProbability = (lambda, k) => {
      return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    };
    
    const performChiSquareTest = (data) => {
      const frequencyCounts = {};
    
      // Count the frequencies of arrival times
      data.forEach(({ arrival_time }) => {
        frequencyCounts[arrival_time] = (frequencyCounts[arrival_time] || 0) + 1;
      });
    
      const totalObservations = data.length;
      const chiSquareDetails = [];
      let chiSquareStatistic = 0;
    
      console.log("Frequency Counts:", frequencyCounts);
    
      // Loop through the observed frequencies and calculate the expected frequencies
      Object.keys(frequencyCounts).forEach((key) => {
        const observed = frequencyCounts[key];
        const expected = totalObservations * poissonProbability(arrivalMean, key);
        
        // Filter out categories with very small expected frequencies (e.g., less than 0.5)
        if (expected < 0.5) {
          console.warn(`Expected frequency for arrival time ${key} is too small (${expected.toFixed(2)}). Ignoring.`);
          return; // Skip chi-square calculation if expected frequency is too small
        }
    
        console.log(`Arrival Time: ${key}, Observed: ${observed}, Expected: ${expected.toFixed(2)}`);
    
        const chiSquare = ((observed - expected) ** 2) / expected;
        chiSquareDetails.push({ key, observed, expected, chiSquare });
        chiSquareStatistic += chiSquare;
      });
    
      console.log("Chi-Square Statistic:", chiSquareStatistic);
    
      const degreesOfFreedom = Math.max(1, Object.keys(frequencyCounts).length - 1);
      const criticalValue = getCriticalValue(degreesOfFreedom, 0.05);
      console.log("Critical Value:", criticalValue);
    
      const result =
        chiSquareStatistic <= criticalValue
          ? "Fail to reject the null hypothesis: Data follows Poisson distribution."
          : "Reject the null hypothesis: Data does not follow Poisson distribution.";
    
      // Set the results and state variables
      setChiSquareStatistic(chiSquareStatistic);
      setCriticalValue(criticalValue);
      setChiSquareData(chiSquareDetails);
      setChiSquareResult(result);
    };
    
    const factorial = (n) => {
      return n === 0 ? 1 : n * factorial(n - 1);
    };
  
    const getCriticalValue = (df, alpha = 0.05) => {
      const chiSquareTable = {
        1: 3.84, 2: 5.99, 3: 7.81, 4: 9.49, 5: 11.07, 6: 12.59,
        7: 14.07, 8: 15.51, 9: 16.92, 10: 18.31, 11: 19.75, 12: 21.03
        // Add more as needed...
      };
      
    
      return chiSquareTable[df] || 2 * df; // Approximate for higher df
    };
    
    console.log("Chi-Square Statistic:", chiSquareStatistic);


  return (
    <div className="container">
      <Title>{`${model} with${!isPriorityEnabled ? "out" : ""} Priority`}</Title>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input label="Arrival Mean" setValue={setArrivalMean} />
        <Input label="Service Mean" setValue={setServiceMean} />
        <Input label="Number of Servers" setValue={setNumberOfServers} />
      </div>
      <Button
        title="Simulate"
        
        onClick={() => {
          setSimData([]); // Reset before the new simulation
          setIsLoading(true);
          setTimeout(() => {
            if (servers <= 0 || !arrivalTimes.arrivalTimes.length) {
              console.warn("Invalid input data or server count.");
              setIsLoading(false);
              return;
            }
            const patients = arrivalTimes.arrivalTimes.map(
              (_, i) =>
                new Patient(
                  i + 1,
                  arrivalTimes.arrivalTimes[i],
                  serviceTimes[i],
                  priorities[i],
                  serviceTimes[i]
                )
            );
            serve_highest_priority_patient(patients);
            setSimData(patients);
            performChiSquareTest(patients);
            setIsLoading(false);
          }, 2000);
        }}
        
        
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {simData.length ? (
            <>
            <Table simData={simData} isPriorityEnabled={isPriorityEnabled} />
            <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-md">
  <h2 className="text-3xl font-bold text-center text-white mb-4">
    Chi-Square Test Result
  </h2>
  <div className="flex justify-center items-center">
    <p
      className={`text-lg px-8 py-4 rounded-lg ${
        chiSquareStatistic <= criticalValue
          ? "bg-green-800 text-green-300 animate-pulse"
          : "bg-red-800 text-red-300 animate-shake"
      }`}
    >
      <strong>
        {chiSquareStatistic <= criticalValue
          ? "✅ Data follows a Poisson distribution."
          : "❌ Data does not follow a Poisson distribution."}
      </strong>
    </p>
  </div>

  <div className="overflow-x-auto mt-6 flex justify-center">
    <table className="border border-gray-700 text-white w-full max-w-4xl">
      <thead>
        <tr className="bg-gray-700">
          <th className="px-6 py-3">Arrival Time</th>
          <th className="px-6 py-3">Observed</th>
          <th className="px-6 py-3">Expected</th>
          <th className="px-6 py-3">Chi-Square</th>
        </tr>
      </thead>
      <tbody>
        {chiSquareData?.map((row, index) => (
          <tr key={index} className="even:bg-gray-800 odd:bg-gray-900">
            <td className="px-6 py-3">{row.key}</td>
            <td className="px-6 py-3">{row.observed}</td>
            <td className="px-6 py-3">{row.expected.toFixed(2)}</td>
            <td className="px-6 py-3">{row.chiSquare.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          
            </>
          ) : null}






          {simData.length ? (
            <>
              <PerformanceMeasures data={simData} />
              <Button
                title="Replicate"
                onClick={() => {
                  setShowAveragePerformanceMeasures(true);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 2000);
                  const patients = arrivalTimes.arrivalTimes.map(
                    (_, i) =>
                      new Patient(
                        i + 1,
                        arrivalTimes.arrivalTimes[i],
                        serviceTimes[i],
                        priorities[i],
                        serviceTimes[i]
                      )
                  );
                  serve_highest_priority_patient(patients);
                  setSimData(patients);
                  setAverageWaitTimeList([
                    ...averageWaitTimeList,
                    averageWaitTime,
                  ]);
                  setAverageResponseTimeList([
                    ...averageResponseTimeList,
                    averageResponseTime,
                  ]);
                  setAverageTurnAroundTimeList([
                    ...averageTurnAroundTimeList,
                    averageTurnAroundTime,
                  ]);
                }}
              />
            </>
          ) : null}

          {showAveragePerformanceMeasures && (
            <AveragePerformanceMeasures
              averageWaitTimeList={averageWaitTimeList}
              averageResponseTimeList={averageResponseTimeList}
              averageTurnAroundTimeList={averageTurnAroundTimeList}
            />
          )}
          {simData.length && <Graph simulationData={simData} />}
          {simData.length && <GanttChart servers={servers} tasks={simData} />}
        </>
      )}
    </div>
  );
}

export default Simulator;
