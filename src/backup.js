import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

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

  // beep 音の生成 (動作確認用のダミー)
  const playSound = (sound) => {
    let audioPath = "";
    if (sound === "Snare") {
      audioPath = "Snare_808_Tone1.wav";
    } else if (sound === "Kick") {
      audioPath = "Kick_808_Tone1.wav";
    } else if (sound === "Cymbal") {
      audioPath = "Cymbal_808_Tone1.wav";
    }
    //const [playing, currentTime, play, pause, jump] = useAudio(audioPath);
    const tone = new Audio(audioPath);
    tone.play();
  };
  // const playSound = (sound) => {
  //   // オシレーターを作成 (一定の音程を発生させる)
  //   const oscillator = audioContext.current.createOscillator();
  //   const gainNode = audioContext.current.createGain();

  //   oscillator.connect(gainNode);
  //   gainNode.connect(audioContext.current.destination);

  //   if (sound === "beep") {
  //     oscillator.type = "sine";
  //     oscillator.frequency.setValueAtTime(
  //       440,
  //       audioContext.current.currentTime
  //     ); // Frequency in Hz
  //   } else if (sound === "clap") {
  //     oscillator.type = "square";
  //     oscillator.frequency.setValueAtTime(
  //       880,
  //       audioContext.current.currentTime
  //     ); // Frequency in Hz
  //   } else if (sound === "hihat") {
  //     oscillator.type = "triangle";
  //     oscillator.frequency.setValueAtTime(
  //       660,
  //       audioContext.current.currentTime
  //     ); // Frequency in Hz
  //   }

  //   gainNode.gain.setValueAtTime(1, audioContext.current.currentTime);
  //   gainNode.gain.exponentialRampToValueAtTime(
  //     0.001,
  //     audioContext.current.currentTime + 0.1
  //   ); // Duration of beep

  //   oscillator.start(audioContext.current.currentTime);
  //   oscillator.stop(audioContext.current.currentTime + 0.1); // Duration of beep
  // };

  const handleSoundChange = (e) => {
    setSelectedSound(e.target.value);
  };

  const handleBeatClick = (index) => {
    const newBeatsSounds = beatsSounds.map((beatSounds, beatIndex) => {
      console.log(beatSounds);
      if (beatIndex === index) {
        return [...beatSounds, selectedSound];
        //return beatSounds.push(selectedSound);
      }
      return beatSounds;
    });
    console.log(newBeatsSounds);
    setBeatsSounds(newBeatsSounds);
  };

  // const handleBeatClick = (index) => {
  //   const newBeatsSounds = beatsSounds.map((beatSounds, beatIndex) => {
  //     if (beatIndex === index) {
  //       if (beatSounds.findIndex(selectedSound) === -1) {
  //         beatSounds.push(selectedSound);
  //       } else {
  //         beatSounds.splice(selectedSound);
  //       }
  //     }
  //     return beatSounds;
  //   });
  //   setBeatsSounds(newBeatsSounds);
  // };

  return (
    <Container>
      <h1>Rhythm Box</h1>
      <Select value={selectedSound} onChange={handleSoundChange}>
        {toneLabels.map((toneName) => (
          <option value={toneName}>{toneName}</option>
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
