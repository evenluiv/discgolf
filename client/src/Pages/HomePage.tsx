import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  course_id: number;
  course_name: string;
}

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1"]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://discgolf-backend.onrender.com/api/courses")
      .then((response) => response.json())
      .then((data: Course[]) => {
        setCourses(data);
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

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course selection
  const handleCourseSelect = (courseId: number, courseName: string) => {
    setSelectedCourse(courseId);
    setSelectedCourseName(courseName);
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Disc Golf Scorecard</h1>
        
        {/* Course Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Select Course</h2>
          <input
            type="text"
            placeholder="Search for course"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <div className="max-h-40 overflow-y-auto mb-3 border border-gray-200 rounded-lg">
            {courses.length === 0 ? (
              <div className="p-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-lg">
                Server is starting up, this may take 50 seconds or more...
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div 
                  key={course.course_id}
                  className={`p-3 cursor-pointer hover:bg-green-100 ${selectedCourse === course.course_id ? 'bg-green-200' : ''}`}
                  onClick={() => handleCourseSelect(course.course_id, course.course_name)}
                >
                  <div className="font-medium">{course.course_name}</div>
                </div>
              ))
            )}
            
            {filteredCourses.length === 0 && searchTerm && courses.length > 0 && (
              <div className="p-4 text-gray-600">
                No courses found matching "{searchTerm}"
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            Selected: <span className="font-medium">{selectedCourseName || 'None'}</span>
          </div>
        </div>
        
        {/* Player Names */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Players (max 8)</h2>
          
          {playerNames.map((player, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                placeholder={`Player ${index + 1}`}
                value={player}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 20) {
                    handlePlayerNameChange(index, newValue);
                  }
                }}
                maxLength={20}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              {playerNames.length > 1 && (
                <button 
                  onClick={() => removePlayer(index)}
                  type="button"
                  className="ml-2 px-3 bg-red-500 text-white rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {playerNames.length < 8 && (
            <button 
              onClick={addPlayer}
              type="button"
              className="w-full p-2 bg-green-600 text-white rounded-lg mt-2"
            >
              Add Player
            </button>
          )}
        </div>
        
        {/* Start Game Button */}
        <button 
          onClick={handleStartGame}
          type="button"
          disabled={!selectedCourse || playerNames.some(name => name.trim() === '')}
          className={`w-full p-4 text-white text-lg font-bold rounded-lg transition-colors ${
            !selectedCourse || playerNames.some(name => name.trim() === '') 
              ? 'bg-gray-400' 
              : 'bg-green-700 hover:bg-green-800'
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default HomePage;
