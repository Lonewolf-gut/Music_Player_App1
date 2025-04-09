import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import TrackCard from "./components/TrackCard";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import "./App.css"; //styles loaded for dark and light modes
import { searchTracks } from "./utils/api";

const App = () => {
  // State to manage the theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Default to light or saved theme
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Store the user's theme preference in local storage
  };

  //Fetch tracks based on search//
  const handleSearch = async (query) => {
    if (!query) return; // Prevention of an empty search request
    const data = await searchTracks(query);
    setTracks(data.data); // fetch tracks into state
  };

  // Apply the theme to the body when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      <div
        className={`container mx-auto p-4 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Dark mode toggle button */}
        <button
          onClick={toggleTheme}
          className={`mb-4 p-2 ${
            theme === "dark" ? "bg-gray-600" : "bg-gray-300"
          } rounded-full hover:${
            theme === "dark" ? "bg-gray-500" : "bg-gray-400"
          }`}
        >
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
        <Sidebar toggleTheme={toggleTheme} theme={theme} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchBar onSearch={handleSearch} />
                <div className="mt-4">
                  {tracks.length > 0 ? (
                    tracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        onPlay={setCurrentTrack}
                      />
                    ))
                  ) : (
                    <p>No tracks found. Try searching again.</p>
                  )}
                </div>
              </>
            }
          />
          {currentTrack && (
            <Route
              path="/now-playing"
              element={<MusicPlayer track={currentTrack} />}
            />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
