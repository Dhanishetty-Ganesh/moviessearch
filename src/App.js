import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { IoSearch, IoCloseSharp } from "react-icons/io5";

const App = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    setShowWelcome(false); // Hide the welcome message when fetching movies
    try {
      const movieResponse = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
      const moviesData = movieResponse.data.docs;

      const movieDetails = await Promise.all(
        moviesData.map(async (movie) => {
          const dogResponse = await axios.get('https://dog.ceo/api/breeds/image/random');
          return {
            title: movie.title,
            author: movie.author_name?.[0],
            publishYear: movie.first_publish_year,
            dogImage: dogResponse.data.message,
          };
        })
      );

      setMovies(movieDetails);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === '') {
      setInputError('Search input cannot be empty');
    } else {
      setInputError('');
      fetchMovies();
    }
  };

  const handleFocus = () => {
    setShowWelcome(false); // Hide the welcome message when the search bar is focused
  };

  const handleClearInput = () => {
    setQuery('');
    setMovies([]);
    setShowWelcome(true);
  };

  return (
    <div className="moviesearch-app">
      <h1 className="moviesearch-title">Movie Search</h1>
      {showWelcome && <p className="moviesearch-welcome">Welcome to the Movie Search application that fetches movies data.</p>}
      <form onSubmit={handleSearch} className="moviesearch-form">
        <div className="moviesearch-input-container">
          <div className='moviesearch-input-card'>
            <IoSearch className="moviesearch-icon" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onFocus={handleFocus} 
              placeholder="Search for a movie..." 
              className="moviesearch-input"
            />
            {query && <IoCloseSharp className="moviesearch-close-icon" onClick={handleClearInput} />}
          </div>
          <button type="submit" className="moviesearch-button">Search</button>
        </div>
        {inputError && <p className="moviesearch-input-error">{inputError}</p>}
      </form>
      {loading && <div className="moviesearch-loading"></div>}
      {error && <p className="moviesearch-error">{error}</p>}
      <div className="moviesearch-movies">
        {movies.map((movie, index) => (
          <div key={index} className="moviesearch-movie-card">
            <img src={movie.dogImage} alt="Dog" className="moviesearch-dog-image"/>
            <h1 className="moviesearch-movie-title"><span className='movie-details-span'>Movie Title: </span>{movie.title}</h1>
            <p className="moviesearch-movie-author"><span className='movie-details-span'>Movie Director: </span>{movie.author}</p>
            <p className="moviesearch-movie-year"><span className='movie-details-span'>Movie Year: </span>{movie.publishYear}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
