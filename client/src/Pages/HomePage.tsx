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
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap elements
        swapped = true;
      }
    }

    if (!swapped) break; // If no swaps were made, array is sorted
  }

  return arr;
};

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [numPlayers, setNumPlayers] = useState<number>(1);
  const [playerNames, setPlayerNames] = useState<string[]>([""]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/api/courses") // Node backend URL
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

  const handleNumPlayersChange = (count: number) => {
    setNumPlayers(count);
    const updatedNames = [...playerNames];
    while (updatedNames.length < count) updatedNames.push("");
    while (updatedNames.length > count) updatedNames.pop();
    setPlayerNames(updatedNames);
  };

  const handleStartGame = async () => {
    if (selectedCourse && numPlayers > 0) {
      try {
        const selectedCourseDetails = courses.find(
          (course) => course.course_id === selectedCourse
        );
  
        if (!selectedCourseDetails) {
          console.error("Selected course not found");
          return;
        }
  
        const response = await fetch(
          `http://localhost:9000/api/courses/${selectedCourse}`
        );
        const holes = await response.json();
  
        navigate(`/play`, {
          state: {
            courseId: selectedCourse,
            courseName: selectedCourseDetails.course_name,
            numPlayers,
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
        className="flex flex-col justify-between items-center gap-6"
      >
        <label className="flex flex-row gap-2">
          Select course:
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            required
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
        <label className="flex flex-row gap-2">
          Number of players:
          <input
            type="number"
            min={1}
            max={8}
            value={numPlayers}
            onChange={(e) => handleNumPlayersChange(Number(e.target.value))}
            required
          />
        </label>
        <div className="flex flex-col gap-3">
          {Array.from({ length: numPlayers }, (_, index) => (
            <label key={index} className="flex flex-row gap-2 border-2 border-solid border-green-1 rounded-md p-3">
              Player {index + 1} name:
              <input
                className="px-2"
                type="text"
                value={playerNames[index]}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                required
              />
            </label>
          ))}
        </div>
        <button type="submit" className="bg-green-2 rounded-md p-2">Start Game</button>
      </form>
    </div>
  );
}

export default HomePage;
