import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  course_id: number;
  course_name: string;
}

const sortCourses = (arr: Course[]): Course[] => {
  const length = arr.length;
  let swapped: boolean;

  for (let i = 0; i < length - 1; i++) {
    swapped = false;

    for (let j = 0; j < length - i - 1; j++) {
      if (arr[j].course_name > arr[j + 1].course_name) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return arr;
};

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1"]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://discgolf-backend.onrender.com/api/courses")
      .then((response) => response.json())
      .then((data: Course[]) => {
        const sortedCourses = sortCourses(data);
        setCourses(sortedCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleStartGame = async () => {
    if (selectedCourse && playerNames.length > 0) {
      try {
        const selectedCourseDetails = courses.find(
          (course) => course.course_id === selectedCourse
        );

        if (!selectedCourseDetails) {
          console.error("Selected course not found");
          return;
        }

        const response = await fetch(
          `https://discgolf-backend.onrender.com/api/courses/${selectedCourse}`
        );
        const holes = await response.json();

        navigate(`/play`, {
          state: {
            courseId: selectedCourse,
            courseName: selectedCourseDetails.course_name,
            numPlayers: playerNames.length,
            playerNames,
            holes,
          },
        });
      } catch (error) {
        console.error("Error fetching holes:", error);
      }
    }
  };

  return (
    <div className="homepage flex flex-col min-h-screen items-center p-4 gap-4">
      <h1>Disc Golf Score Tracker</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartGame();
        }}
        className="flex flex-col justify-between items-center gap-6 w-full max-w-md"
      >
        <label className="flex flex-row items-baseline gap-4 w-full">
          <span>Select course:</span>
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            required
            className="flex flex-grow border-2 border-green-1 rounded-md px-2 py-1"
          >
            <option value="" disabled>
              Choose a course
            </option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col w-full gap-2">
          <h2 className="text-lg font-bold">Players:</h2>
          {playerNames.map((player, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border-2 border-green-1 rounded-md p-3"
            >
              <input
                type="text"
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                value={player}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 20) {
                    handlePlayerNameChange(index, newValue);
                  }
                }}
                maxLength={20}
                required
              />
              {playerNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {playerNames.length < 8 && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full px-3 py-2 text-center text-white rounded-md font-medium bg-green-1 hover:bg-green-2"
            >
              + Add Player
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-2 hover:bg-green-3 font-medium rounded-md p-2"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}

export default HomePage;
