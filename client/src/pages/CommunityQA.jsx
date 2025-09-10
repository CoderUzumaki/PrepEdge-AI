import { useState, useEffect } from "react";
import axios from "axios";

export default function CommunityQA() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/community-qa`);
        setQuestions(res.data);
      } catch {}
    };
    fetchQuestions();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/community-qa`, {
        title,
        content,
        tags: tags.split(",").map(t => t.trim()),
      });
      setMessage("Question posted!");
    } catch {
      setMessage("Failed to post question.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Community Q&amp;A</h1>
      <form onSubmit={handlePost} className="mb-8 flex flex-col gap-4">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="border p-2 rounded" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Your question..." required className="border p-2 rounded" />
        <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Question</button>
      </form>
      {message && <div className="mb-4 text-green-700">{message}</div>}
      <ul>
        {questions.map((q) => (
          <li key={q._id} className="mb-4 p-4 border rounded">
            <h2 className="font-semibold">{q.title}</h2>
            <div className="text-gray-700 mb-2">{q.content}</div>
            <div className="text-xs text-gray-500 mb-2">Tags: {q.tags.join(", ")}</div>
            <div className="text-sm text-gray-600">Answers: {q.answers.length}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
