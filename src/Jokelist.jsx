import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke.jsx";
import "./JokeList.css";

const JokeList = () => {
    const numJokesToGet = 5;
    const [jokes, setJokes] = useState([])
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        generateNewJokes();
    }, []);

    const getJokes = async() => {
        try {
            // load jokes one at a time, adding not-yet-seen jokes
            let jokes = [];
            let seenJokes = new Set();
      
            while (jokes.length < numJokesToGet) {
              let res = await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
              });
              let { ...joke } = res.data;
      
              if (!seenJokes.has(joke.id)) {
                seenJokes.add(joke.id);
                jokes.push({ ...joke, votes: 0 });
              } else {
                console.log("duplicate found!");
              }
            }
      
            setJokes( jokes );
            setLoading(false);
          } catch (err) {
            console.error(err);
          }
    }

    const generateNewJokes = () => {
        setLoading(true);
        getJokes();
    }

    const vote = (id, delta) => {
        setJokes(jokes =>
            jokes.map(j =>
              j.id === id ? { ...j, votes: j.votes + delta } : j
            )
          );
        //   console.log(`JOKES: ${jokes}`)
    }
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    return(
        <div className="JokeList">
            {isLoading && (
                <div className="loading">
                    <i className="fas fa-4x fa-spinner fa-spin" />
                </div>
            )}
            {!isLoading && (
                <div className="JokeList">
                    <button
                        className="JokeList-getmore"
                        onClick={generateNewJokes}
                    >
                        Get New Jokes
                    </button>
            
                    {sortedJokes.map(j => (
                    <Joke
                        text={j.joke}
                        key={j.id}
                        id={j.id}
                        votes={j.votes}
                        vote={vote}
                    />
                    ))}
                </div>
            )}
        </div>
        
    );
}

export default JokeList;