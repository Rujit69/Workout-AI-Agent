import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import "./GeminiChat.css"; // import the new CSS file

const GeminiChat = () => {
  // New state variables for each question
  const [daysFree, setDaysFree] = useState("3");
  const [gymAvailable, setGymAvailable] = useState("Yes");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [pushUps, setPushUps] = useState("");
  const [pullUps, setPullUps] = useState("");
  const [squats, setSquats] = useState("");
  const [goal, setGoal] = useState("gain muscle");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_API;

  const handleSend = async () => {
    setLoading(true);
    setResponse("");
    // Combine system context with the predefined responses
    const systemContext =
      "You are a personal workout fitness buddy. Provide a complete, personalized workout routine with exercises and number of sets based on the user's input.";
    const userInput = `
User Preferences:
- Days free per week: ${daysFree}
- Gym available: ${gymAvailable}
- Current fitness level: ${fitnessLevel}
- Max push ups in a row: ${pushUps}
- Max pull ups in a row: ${pullUps}
- Max squats in a row: ${squats}
- Goal: ${goal}
    `;
    const fullInput = `${systemContext}\n${userInput}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullInput }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setResponse(text);
    } catch (err) {
      console.error(err);
      setResponse("Error fetching response.");
    }

    setLoading(false);
  };

  const formatResponse = (text) => {
    if (!text) return "";
    
    return (
      <div className="response-content">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="gemini-chat-container">
      <h2>Gemini Workout Buddy</h2>
      <div className="form-group">
        <label>How many days a week are you free?</label>
        <select value={daysFree} onChange={(e) => setDaysFree(e.target.value)}>
          {[...Array(7)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Is gym available?</label>
        <div>
          <input
            type="radio"
            id="gymYes"
            name="gymAvailable"
            value="Yes"
            checked={gymAvailable === "Yes"}
            onChange={(e) => setGymAvailable(e.target.value)}
          />
          <label htmlFor="gymYes">Yes</label>
          <input
            type="radio"
            id="gymNo"
            name="gymAvailable"
            value="No"
            checked={gymAvailable === "No"}
            onChange={(e) => setGymAvailable(e.target.value)}
          />
          <label htmlFor="gymNo">No</label>
        </div>
      </div>
      <div className="form-group">
        <label>Current fitness level:</label>
        <select
          value={fitnessLevel}
          onChange={(e) => setFitnessLevel(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div className="form-group">
        <label>Total number of push ups in a row:</label>
        <input
          type="number"
          value={pushUps}
          onChange={(e) => setPushUps(e.target.value)}
          placeholder="e.g., 10"
        />
      </div>
      <div className="form-group">
        <label>Total number of pull ups in a row:</label>
        <input
          type="number"
          value={pullUps}
          onChange={(e) => setPullUps(e.target.value)}
          placeholder="e.g., 5"
        />
      </div>
      <div className="form-group">
        <label>Total number of squats in a row:</label>
        <input
          type="number"
          value={squats}
          onChange={(e) => setSquats(e.target.value)}
          placeholder="e.g., 20"
        />
      </div>
      <div className="form-group">
        <label>Goal:</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="gain muscle">Gain muscle</option>
          <option value="lose weight">Lose weight</option>
          <option value="improve endurance">Improve endurance</option>
          <option value="general fitness">General fitness</option>
        </select>
      </div>
      <button 
        className={`send-button ${loading ? 'loading' : ''}`} 
        onClick={handleSend} 
        disabled={loading}
      >
        {loading ? "Generating Your Workout Plan..." : "Generate Routine"}
      </button>
      <div className="response-section">
        <h3>Your Personalized Workout Plan</h3>
        <div className="response-box">
          {loading ? (
            <div className="loading">Preparing your workout plan...</div>
          ) : (
            formatResponse(response)
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;