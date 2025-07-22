// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';
// import moment from 'moment-timezone';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import jsPDF from 'jspdf';
// import iataCityMap from './iataCityMap.json';

// function App() {
//   const [flight, setFlight] = useState(localStorage.getItem('flight') || '');
//   const [flightDate, setFlightDate] = useState(localStorage.getItem('flightDate') || '');
//   const [flightTime, setFlightTime] = useState(localStorage.getItem('flightTime') || '');
//   const [flightData, setFlightData] = useState(null);
//   const [weatherDep, setWeatherDep] = useState(null);
//   const [weatherArr, setWeatherArr] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     localStorage.setItem('flight', flight);
//     localStorage.setItem('flightDate', flightDate);
//     localStorage.setItem('flightTime', flightTime);
//   }, [flight, flightDate, flightTime]);

//   const fetchFlightInfo = async () => {
//     if (!flight || !flightDate) {
//       toast.warn('Please enter both flight number and date.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.get(`https://<your-render-backend-url>.onrender.com/api/flight/${flightNumber}`);

//       if (!res.data || !res.data.data || res.data.data.length === 0) {
//         toast.warn("No flight data found ⚠️");
//         setFlightData(null);
//         return;
//       }
//       const data = res.data.data[0];
//       setFlightData(data);

//       const depCity = encodeURIComponent(iataCityMap[data.departure.iata] || 'New York');
//       const arrCity = encodeURIComponent(iataCityMap[data.arrival.iata] || 'London');

//       const [depWeatherRes, arrWeatherRes] = await Promise.all([
//         axios.get(`http://localhost:5050/api/weather/${depCity}`),
//         axios.get(`http://localhost:5050/api/weather/${arrCity}`)
//       ]);

//       setWeatherDep(depWeatherRes.data);
//       setWeatherArr(arrWeatherRes.data);
//       toast.success("Flight info loaded ✅");
//     } catch (error) {
//       console.error('❌ Fetch error:', error.message);
//       toast.error('Something went wrong ❌');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatIST = (timeString) => {
//     return moment.utc(timeString).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A (z)');
//   };

//   const formatUTC = (timeString) => {
//     return moment.utc(timeString).format('DD MMM YYYY, hh:mm A (z)');
//   };

//   const getHeuristicPrediction = () => {
//     if (!flightDate || !flightTime) return null;
//     const dt = new Date(`${flightDate}T${flightTime}`);
//     const day = dt.getDay();
//     const hour = dt.getHours();
//     if ((day === 5 && hour >= 17 && hour <= 21) || (day === 0 && hour >= 12 && hour <= 16)) return 80;
//     if (day === 1 && hour >= 6 && hour <= 9) return 60;
//     if (hour < 6) return 10;
//     return 5;
//   };

//   const predicted = getHeuristicPrediction();

//   const getReportedDelay = () => {
//     const delay = flightData?.departure?.delay;
//     if (delay !== undefined && delay !== null) {
//       const className = delay > 30 ? 'delay-high' : delay > 15 ? 'delay-medium' : 'delay-low';
//       return <span className={className}>{`${delay} minutes`}</span>;
//     }
//     return 'No delay reported';
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Flight Info Summary", 10, 10);
//     doc.text(`Flight: ${flight}`, 10, 20);
//     doc.text(`Date: ${flightDate}`, 10, 30);
//     doc.text(`Time: ${flightTime}`, 10, 40);
//     if (flightData) {
//       doc.text(`Departure: ${flightData.departure.airport}`, 10, 50);
//       doc.text(`Arrival: ${flightData.arrival.airport}`, 10, 60);
//       doc.text(`Status: ${flightData.flight_status || 'N/A'}`, 10, 70);
//     }
//     doc.save('flight-info.pdf');
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>✈️ Flight Info Dashboard</h1>
//       </div>

//       <div className="search-section">
//         <input type="text" placeholder="Flight Number (e.g., AI2988)" value={flight} onChange={(e) => setFlight(e.target.value)} />
//         <input type="date" value={flightDate} onChange={(e) => setFlightDate(e.target.value)} />
//         <input type="time" value={flightTime} onChange={(e) => setFlightTime(e.target.value)} />
//         <button onClick={fetchFlightInfo}>Get Info</button>
//         <button onClick={exportToPDF}>Download PDF</button>
//       </div>

//       {loading && <div className="loading">Loading...</div>}

//       {flightData && !loading && (
//         <>
//           <div className="info-grid">
//             <div className="card">
//               <h3>🛫 Departure ({flightData.departure.iata} - {flightData.departure.airport})</h3>
//               <p>🕓 Scheduled (IST): {formatIST(flightData.departure.scheduled)}</p>
//               <p>🕓 Scheduled (UTC): {formatUTC(flightData.departure.scheduled)}</p>
//               <p>⏰ Estimated (IST): {formatIST(flightData.departure.estimated)}</p>
//               <p>⏰ Estimated (UTC): {formatUTC(flightData.departure.estimated)}</p>
//               <p>Gate: {flightData.departure.gate || 'N/A'}</p>
//               <p>Terminal: {flightData.departure.terminal || 'N/A'}</p>
//                           </div>

//             <div className="card">
//               <h3>🛬 Arrival ({flightData.arrival.iata} - {flightData.arrival.airport})</h3>
//               <p>🕓 Scheduled (IST): {formatIST(flightData.arrival.scheduled)}</p>
//               <p>🕓 Scheduled (UTC): {formatUTC(flightData.arrival.scheduled)}</p>
//               <p>⏰ Estimated (IST): {formatIST(flightData.arrival.estimated)}</p>
//               <p>⏰ Estimated (UTC): {formatUTC(flightData.arrival.estimated)}</p>
//               <p>Gate: {flightData.arrival.gate || 'N/A'}</p>
//               <p>Terminal: {flightData.arrival.terminal || 'N/A'}</p>
//               <p>Status: {flightData.flight_status || 'N/A'}</p>
//             </div>
//           </div>

//           <div className="prediction-section">
//             <h3>📊 Predicted Delay (Heuristic)</h3>
//             <p><strong>Reported Delay:</strong> {getReportedDelay()}</p>
//             <p>{predicted !== null ? `${predicted}% chance of delay` : 'Select date & time to predict'}</p>
//           </div>

//           <div className="weather-section">
//             <div className="weather-card">
//               <h3>🌤 Departure Weather – {iataCityMap[flightData.departure.iata]}</h3>
//               <p>Temp: {weatherDep?.main?.temp} °C</p>
//               <p>Wind: {weatherDep?.wind?.speed} m/s</p>
//               <p>Rain: {weatherDep?.rain ? 'Yes' : 'No'}</p>
//             </div>
//             <div className="weather-card">
//               <h3>🌦 Arrival Weather – {iataCityMap[flightData.arrival.iata]}</h3>
//               <p>Temp: {weatherArr?.main?.temp} °C</p>
//               <p>Wind: {weatherArr?.wind?.speed} m/s</p>
//               <p>Rain: {weatherArr?.rain ? 'Yes' : 'No'}</p>
//             </div>
//           </div>
//         </>
//       )}

//       <ToastContainer position="top-right" autoClose={4000} theme="dark" />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment-timezone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import iataCityMap from './iataCityMap.json';

// ✅ Replace this with your actual Render backend URL:
const API_BASE = 'https://aviation-dashboard-w4bv.onrender.com';


function App() {
  const [flight, setFlight] = useState(localStorage.getItem('flight') || '');
  const [flightDate, setFlightDate] = useState(localStorage.getItem('flightDate') || '');
  const [flightTime, setFlightTime] = useState(localStorage.getItem('flightTime') || '');
  const [flightData, setFlightData] = useState(null);
  const [weatherDep, setWeatherDep] = useState(null);
  const [weatherArr, setWeatherArr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('flight', flight);
    localStorage.setItem('flightDate', flightDate);
    localStorage.setItem('flightTime', flightTime);
  }, [flight, flightDate, flightTime]);

  const fetchFlightInfo = async () => {
    if (!flight || !flightDate) {
      toast.warn('Please enter both flight number and date.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/flight/${flight}`);


      if (!res.data || !res.data.data || res.data.data.length === 0) {
        toast.warn("No flight data found ⚠️");
        setFlightData(null);
        return;
      }

      const data = res.data.data[0];
      setFlightData(data);

      const depCity = encodeURIComponent(iataCityMap[data.departure.iata] || 'New York');
      const arrCity = encodeURIComponent(iataCityMap[data.arrival.iata] || 'London');

      const [depWeatherRes, arrWeatherRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather/${depCity}`),
        axios.get(`${API_BASE}/api/weather/${arrCity}`)
      ]);

      setWeatherDep(depWeatherRes.data);
      setWeatherArr(arrWeatherRes.data);
      toast.success("Flight info loaded ✅");
    } catch (error) {
      console.error('❌ Fetch error:', error.message);
      toast.error('Something went wrong ❌');
    } finally {
      setLoading(false);
    }
  };

  const formatIST = (timeString) => moment.utc(timeString).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A (z)');
  const formatUTC = (timeString) => moment.utc(timeString).format('DD MMM YYYY, hh:mm A (z)');

  const getHeuristicPrediction = () => {
    if (!flightDate || !flightTime) return null;
    const dt = new Date(`${flightDate}T${flightTime}`);
    const day = dt.getDay();
    const hour = dt.getHours();
    if ((day === 5 && hour >= 17 && hour <= 21) || (day === 0 && hour >= 12 && hour <= 16)) return 80;
    if (day === 1 && hour >= 6 && hour <= 9) return 60;
    if (hour < 6) return 10;
    return 5;
  };

  const predicted = getHeuristicPrediction();

  const getReportedDelay = () => {
    const delay = flightData?.departure?.delay;
    if (delay !== undefined && delay !== null) {
      const className = delay > 30 ? 'delay-high' : delay > 15 ? 'delay-medium' : 'delay-low';
      return <span className={className}>{`${delay} minutes`}</span>;
    }
    return 'No delay reported';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Flight Info Summary", 10, 10);
    doc.text(`Flight: ${flight}`, 10, 20);
    doc.text(`Date: ${flightDate}`, 10, 30);
    doc.text(`Time: ${flightTime}`, 10, 40);
    if (flightData) {
      doc.text(`Departure: ${flightData.departure.airport}`, 10, 50);
      doc.text(`Arrival: ${flightData.arrival.airport}`, 10, 60);
      doc.text(`Status: ${flightData.flight_status || 'N/A'}`, 10, 70);
    }
    doc.save('flight-info.pdf');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>✈️ Flight Info Dashboard</h1>
      </div>

      <div className="search-section">
        <input type="text" placeholder="Flight Number (e.g., AI2988)" value={flight} onChange={(e) => setFlight(e.target.value)} />
        <input type="date" value={flightDate} onChange={(e) => setFlightDate(e.target.value)} />
        <input type="time" value={flightTime} onChange={(e) => setFlightTime(e.target.value)} />
        <button onClick={fetchFlightInfo}>Get Info</button>
        <button onClick={exportToPDF}>Download PDF</button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {flightData && !loading && (
        <>
          <div className="info-grid">
            <div className="card">
              <h3>🛫 Departure ({flightData.departure.iata} - {flightData.departure.airport})</h3>
              <p>🕓 Scheduled (IST): {formatIST(flightData.departure.scheduled)}</p>
              <p>🕓 Scheduled (UTC): {formatUTC(flightData.departure.scheduled)}</p>
              <p>⏰ Estimated (IST): {formatIST(flightData.departure.estimated)}</p>
              <p>⏰ Estimated (UTC): {formatUTC(flightData.departure.estimated)}</p>
              <p>Gate: {flightData.departure.gate || 'N/A'}</p>
              <p>Terminal: {flightData.departure.terminal || 'N/A'}</p>
            </div>

            <div className="card">
              <h3>🛬 Arrival ({flightData.arrival.iata} - {flightData.arrival.airport})</h3>
              <p>🕓 Scheduled (IST): {formatIST(flightData.arrival.scheduled)}</p>
              <p>🕓 Scheduled (UTC): {formatUTC(flightData.arrival.scheduled)}</p>
              <p>⏰ Estimated (IST): {formatIST(flightData.arrival.estimated)}</p>
              <p>⏰ Estimated (UTC): {formatUTC(flightData.arrival.estimated)}</p>
              <p>Gate: {flightData.arrival.gate || 'N/A'}</p>
              <p>Terminal: {flightData.arrival.terminal || 'N/A'}</p>
              <p>Status: {flightData.flight_status || 'N/A'}</p>
            </div>
          </div>

          <div className="prediction-section">
            <h3>📊 Predicted Delay (Heuristic)</h3>
            <p><strong>Reported Delay:</strong> {getReportedDelay()}</p>
            <p>{predicted !== null ? `${predicted}% chance of delay` : 'Select date & time to predict'}</p>
          </div>

          <div className="weather-section">
            <div className="weather-card">
              <h3>🌤 Departure Weather – {iataCityMap[flightData.departure.iata]}</h3>
              <p>Temp: {weatherDep?.main?.temp} °C</p>
              <p>Wind: {weatherDep?.wind?.speed} m/s</p>
              <p>Rain: {weatherDep?.rain ? 'Yes' : 'No'}</p>
            </div>
            <div className="weather-card">
              <h3>🌦 Arrival Weather – {iataCityMap[flightData.arrival.iata]}</h3>
              <p>Temp: {weatherArr?.main?.temp} °C</p>
              <p>Wind: {weatherArr?.wind?.speed} m/s</p>
              <p>Rain: {weatherArr?.rain ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </div>
  );
}

export default App;
