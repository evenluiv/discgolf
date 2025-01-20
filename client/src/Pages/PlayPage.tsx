import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Player {
  name: string;
  scores: (number | null)[];
  isOB: boolean[];
}

interface Hole {
  hole_number: number;
  par: number;
}

const PlayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    courseName,
    numPlayers,
    playerNames,
    holes,
  }: {
    courseName: string;
    numPlayers: number;
    playerNames: string[];
    holes: Hole[];
  } = location.state;

  const keypadStyles = "py-3 text-xl font-bold text-white bg-green-2 rounded hover:bg-green-3";

  const [players, setPlayers] = useState<Player[]>(
    () =>
      location.state?.players || // Use existing players if passed from SummaryPage
      Array.from({ length: numPlayers }, (_, index) => ({
        name: playerNames[index] || `Player ${index + 1}`,
        scores: Array(holes.length).fill(null),
        isOB: Array(holes.length).fill(false),
      }))
  );

  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [pendingInput, setPendingInput] = useState<number | null>(null); // For multi-digit scores

  const currentHole = holes[currentHoleIndex];

  const allScoresMarked = (holeIndex: number) =>
    players.every((player) => player.scores[holeIndex] !== null);

  const handleScoreInput = (value: number | "OB") => {
    if (selectedPlayerIndex !== null) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) => {
          if (index === selectedPlayerIndex) {
            const updatedScores = [...player.scores];
            const updatedIsOB = [...player.isOB];

            if (value === "OB") {
              updatedIsOB[currentHoleIndex] = !updatedIsOB[currentHoleIndex]; // Toggle OB status
            } else {
              if (pendingInput !== null) {
                // Append the digit to the pending input for multi-digit numbers
                updatedScores[currentHoleIndex] = pendingInput * 10 + value;
                setPendingInput(null); // Reset pending input after second digit
              } else {
                // Normal single-digit input or start of multi-digit input
                updatedScores[currentHoleIndex] = value;
                setPendingInput(value === 1 ? 1 : null); // Allow second digit only if 1
              }
            }

            return {
              ...player,
              scores: updatedScores,
              isOB: updatedIsOB,
            };
          }
          return player;
        })
      );
    }
  };

  const toggleOBStatus = (playerIndex: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) => {
        if (index === playerIndex) {
          const updatedIsOB = [...player.isOB];
          updatedIsOB[currentHoleIndex] = !updatedIsOB[currentHoleIndex]; // Toggle OB status for this player
          return {
            ...player,
            isOB: updatedIsOB,
          };
        }
        return player;
      })
    );
  };

  const nextHoleOrPlayer = () => {
    // If not on the last player, switch to the next player
    if (selectedPlayerIndex < numPlayers - 1) {
      setSelectedPlayerIndex(selectedPlayerIndex + 1);
    } 
    // If on the last player and not on the last hole, switch to the next hole
    else if (currentHoleIndex < holes.length - 1) {
      setCurrentHoleIndex(currentHoleIndex + 1);
      setSelectedPlayerIndex(0); // Reset to the first player for the next hole
    } 
    // If on the last player and the last hole, navigate to the results page
    else {
      navigate("/results", { state: { courseName, players, holes } });
    }
    setPendingInput(null); // Reset pending input when moving to the next player or hole
  };
  

  const previousHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex(currentHoleIndex - 1);
      setSelectedPlayerIndex(0); // Reset to the first player
    }
    setPendingInput(null); // Reset pending input when moving to the previous hole
  };

  return (
    <div className="play-page flex flex-col min-h-screen">
      <header className="header text-lg flex flex-row justify-between items-center px-10 pt-8">
        <h1>Course Name: {courseName}</h1>
        <button
          className="results-button bg-green-3 text-white px-3 py-1 rounded"
          onClick={() => navigate("/results", { state: { courseName, players, holes } })}
        >
          Results
        </button>
      </header>

      <div className="flex-grow">
        <div className="hole-info flex flex-col items-center gap-2 py-4">
          <p>
            Basket no {currentHole.hole_number} | par {currentHole.par}
          </p>
          <div className="progress-dots flex flex-row gap-1">
            {holes.map((_, idx: number) => {
              const isCurrentHole = idx === currentHoleIndex;
              const isComplete = allScoresMarked(idx);
              return (
                <span
                  key={idx}
                  className={`dot w-4 h-4 rounded-full border-2 ${
                    isCurrentHole
                      ? "border-green-500"
                      : isComplete
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                ></span>
              );
            })}
          </div>
        </div>

        <div className="player-list flex flex-col gap-2 px-4">
          {players.map((player, index) => (
            <div
              key={index}
              className={`player-row grid grid-cols-[2fr, 1fr, 1fr] items-center rounded-md px-4 py-2 cursor-pointer border-2 border-solid border-green-2 ${
                selectedPlayerIndex === index
                  ? "bg-green-1 opacity-80"
                  : "hover:bg-green-1 hover:opacity-90"
              }`}
              onClick={() => setSelectedPlayerIndex(index)}
            >
              <span className="player-name text-lg font-bold">
                {player.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the row when toggling OB
                  toggleOBStatus(index); // Pass the correct player index
                }}
                className={`ob-toggle px-2 py-1 text-sm font-bold rounded ${
                  player.isOB[currentHoleIndex]
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                OB
              </button>

              <span className="player-score text-lg font-bold text-right">
                {player.scores[currentHoleIndex] !== null
                  ? player.scores[currentHoleIndex]
                  : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="keypad grid grid-cols-5 gap-3 p-4 bg-green-1 shadow-md">
        <button onClick={() => handleScoreInput(0)} className={keypadStyles}>
          0
        </button>
        <button onClick={() => handleScoreInput(1)} className={keypadStyles}>
          1
        </button>
        <button onClick={() => handleScoreInput(2)} className={keypadStyles}>
          2
        </button>
        <button onClick={() => handleScoreInput(3)} className={keypadStyles}>
          3
        </button>
        <button
          onClick={() => handleScoreInput("OB")}
          className="py-3 text-lg font-bold text-white bg-red-500 rounded hover:bg-red-600"
        >
          OB
        </button>

        <button
          onClick={previousHole}
          disabled={currentHoleIndex === 0}
          className="row-span-2 py-2 text-lg font-bold text-white bg-gray-500 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          ←
        </button>
        <button onClick={() => handleScoreInput(4)} className={keypadStyles}>
          4
        </button>
        <button onClick={() => handleScoreInput(5)} className={keypadStyles}>
          5
        </button>
        <button onClick={() => handleScoreInput(6)} className={keypadStyles}>
          6
        </button>
        <button
          onClick={nextHoleOrPlayer}
          className="row-span-2 py-2 text-lg font-bold text-white bg-gray-500 rounded hover:bg-gray-600"
        >
          →
        </button>

        <button onClick={() => handleScoreInput(7)} className={keypadStyles}>
          7
        </button>
        <button onClick={() => handleScoreInput(8)} className={keypadStyles}>
          8
        </button>
        <button onClick={() => handleScoreInput(9)} className={keypadStyles}>
          9
        </button>
      </div>
    </div>
  );
};

export default PlayPage;
