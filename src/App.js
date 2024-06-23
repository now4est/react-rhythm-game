import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import useSound from "use-sound";
import toneSnare from "./sounds/Snare_808_Tone1.wav";
import toneKick from "./sounds/Kick_808_Tone1.wav";
import toneCymbal from "./sounds/Cymbal_808_Tone1.wav";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #282c34;
  color: white;
`;

const Button = styled.button`
  margin: 10px;
  padding: 20px;
  font-size: 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #61dafb;
  color: #282c34;
  &:hover {
    background-color: #21a1f1;
  }
`;

const BeatContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
`;

const Select = styled.select`
  margin: 0.5em;
  padding: 0.25em 1em;
  border: none;
  border-radius: 3px;
  background: #61dafb;
  color: #282c34;
  font-size: 1em;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: #21a1f1;
  }
`;

const RhythmBox = () => {
  const beats = 8;
  const tempo = 120; // BPM
  const toneLabels = ["Snare", "Kick", "Cymbal"];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsSounds, setBeatsSounds] = useState(Array(beats).fill([]));
  const [selectedSound, setSelectedSound] = useState(toneLabels[0]);
  const audioContext = useRef(null);

  const [soundSnare] = useSound(toneSnare);
  const [soundKick] = useSound(toneKick);
  const [soundCymbal] = useSound(toneCymbal);

  useEffect(() => {
    // Initialize Web Audio API Context
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentBeat((prevBeat) => (prevBeat + 1) % beats);
      }, (60 / tempo) * 1000);
    } else {
      setCurrentBeat(0);
    }

    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  useEffect(() => {
    if (isPlaying) {
      beatsSounds[currentBeat].forEach((sound) => playSound(sound));
    }
  }, [currentBeat, isPlaying, beatsSounds]);

  // 音の生成

  const playSound = (sound) => {
    let audioPath = "";
    if (sound === "Snare") {
      soundSnare();
    } else if (sound === "Kick") {
      soundKick();
    } else if (sound === "Cymbal") {
      soundCymbal();
    }
  };

  const handleSoundChange = (e) => {
    setSelectedSound(e.target.value);
  };

  const handleBeatClick = (index) => {
    const newBeatsSounds = beatsSounds.map((beatSounds, beatIndex) => {
      if (beatIndex === index) {
        return [...beatSounds, selectedSound];
      }
      return beatSounds;
    });
    setBeatsSounds(newBeatsSounds);
  };

  return (
    <Container>
      <h1>Rhythm Box</h1>
      <Select value={selectedSound} onChange={handleSoundChange}>
        {toneLabels.map((toneName) => (
          <option key={toneName} value={toneName}>
            {toneName}
          </option>
        ))}
      </Select>
      <div>
        {Array.from({ length: beats }).map((_, index) => (
          <BeatContainer key={index}>
            <Button
              style={{
                backgroundColor: currentBeat === index ? "#ff6347" : "#61dafb",
              }}
              onClick={() => handleBeatClick(index)}
            >
              {index + 1}
            </Button>
            <div>
              {beatsSounds[index].map((sound, soundIndex) => (
                <span key={soundIndex} style={{ margin: "0 5px" }}>
                  {sound}
                </span>
              ))}
            </div>
          </BeatContainer>
        ))}
      </div>
      <Button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Start"}
      </Button>
    </Container>
  );
};

function App() {
  return <RhythmBox />;
}

export default App;
