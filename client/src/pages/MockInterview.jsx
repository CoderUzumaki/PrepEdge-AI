import { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "../context/UserDataContext";

export default function MockInterview() {
  const { userData } = useUserData();
  const [interviews, setInterviews] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/mock-interview`);
        setInterviews(res.data);
      } catch {}
    };
    fetchInterviews();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/mock-interview`, {
        scheduledAt: new Date(`${date}T${time}`),
        durationMinutes: duration,
      });
      setMessage("Interview scheduled!");
    } catch {
      setMessage("Failed to schedule interview.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Schedule a Mock Interview</h1>
      <form onSubmit={handleSchedule} className="mb-8 flex flex-col gap-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="border p-2 rounded" />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="border p-2 rounded" />
        <input type="number" min={15} max={120} value={duration} onChange={e => setDuration(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Schedule</button>
      </form>
      {message && <div className="mb-4 text-green-700">{message}</div>}
      <h2 className="text-xl font-semibold mb-2">Upcoming Interviews</h2>
      <ul>
        {interviews.map((i) => (
          <li key={i._id} className="mb-2 p-2 border rounded">
            {new Date(i.scheduledAt).toLocaleString()} ({i.durationMinutes} min)
            {i.meetingLink && <a href={i.meetingLink} className="ml-2 text-blue-600 underline">Join</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
