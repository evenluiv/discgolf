import { useLocation, useNavigate } from "react-router-dom";

function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, players, holes } = location.state as {
    courseName: string;
    players: { name: string; scores: number[]; isOB: boolean[] }[];
    holes: { hole_number: number; par: number }[];
  };

  const calculateTotalScore = (scores: number[]) =>
    scores.reduce((total, score) => (score !== null ? total + score : total), 0);
  
  const calculateParDifference = (scores: number[]) => {
    // Filter out unmarked holes (scores that are null)
    const validScores = scores.filter((score) => score !== null);
    const totalScore = calculateTotalScore(validScores);
  
    // Calculate par only for holes that are marked
    const totalPar = holes
      .filter((_, index) => scores[index] !== null)
      .reduce((sum, hole) => sum + hole.par, 0);
  
    return totalScore - totalPar;
  };
  

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0); // Calculate total par

  const getCellStyle = (
    score: number | null,
    par: number,
    isOB: boolean
  ): string => {
    let baseStyle = "bg-white relative";
  
    if (score === null) return baseStyle;
  
    if (score === 1) {
      baseStyle = "bg-yellow-200 text-yellow-800 font-bold relative"; // Hole-in-one
    } else {
      const difference = score - par;
  
      if (difference < -2) {
        baseStyle = "bg-green-200 text-green-900 relative"; // More than 2 under par
      } else if (difference < 0) {
        baseStyle = "bg-green-100 text-green-800 relative"; // Under par
      } else if (difference === 1) {
        baseStyle = "bg-red-100 text-red-800 relative"; // One over par
      } else if (difference > 1) {
        baseStyle = "bg-red-200 text-red-900 relative"; // Two or more over par
      } else {
        baseStyle = "text-gray-800 relative"; // Par
      }
    }
  
    if (isOB) {
      baseStyle += " after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-red-500";
    }
  
    return baseStyle;
  };  

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-2">
          Game Summary
        </h1>
        <h2 className="text-xl font-semibold text-center text-green-700 mb-6">
          Course: <span className="font-semibold">{courseName}</span>
        </h2>
  
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border bg-gray-100 text-center font-medium text-gray-700">
                  Player
                </th>
                {holes.map((hole, index) => (
                  <th
                    key={index}
                    className="p-2 border bg-gray-100 text-center font-medium text-gray-700"
                  >
                    {hole.hole_number}
                  </th>
                ))}
                <th className="p-2 border bg-gray-100 text-center font-medium text-gray-700">
                  Total
                </th>
                <th className="p-2 border bg-gray-100 text-center font-medium text-gray-700">
                  Par Difference
                </th>
              </tr>
              <tr>
                <th className="p-2 border bg-gray-50 text-center font-medium text-gray-600">
                  Par
                </th>
                {holes.map((hole, index) => (
                  <th
                    key={index}
                    className="p-2 border bg-gray-50 text-center font-medium text-gray-600"
                  >
                    {hole.par}
                  </th>
                ))}
                <th className="p-2 border bg-gray-50 text-center font-bold text-gray-800">
                  {totalPar}
                </th>
                <th className="p-2 border bg-gray-50"></th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, playerIndex) => {
                const totalScore = calculateTotalScore(player.scores);
                const parDifference = calculateParDifference(player.scores);
  
                return (
                  <tr
                    key={playerIndex}
                    className={playerIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 border font-medium text-gray-800">
                      {player.name}
                    </td>
                    {holes.map((hole, holeIndex) => {
                      const score = player.scores[holeIndex];
                      const isOB = player.isOB[holeIndex];
  
                      return (
                        <td
                          key={holeIndex}
                          className={`p-2 border text-center ${getCellStyle(
                            score,
                            hole.par,
                            isOB
                          )}`}
                        >
                          {score !== null ? score : "-"}
                        </td>
                      );
                    })}
                    <td className="p-2 border text-center font-bold text-gray-800">
                      {totalScore}
                    </td>
                    <td
                      className={`p-2 border text-center font-bold ${
                        parDifference < -2
                          ? "bg-green-200 text-green-900"
                          : parDifference < 0
                          ? "bg-green-100 text-green-800"
                          : parDifference === 1
                          ? "bg-red-100 text-red-800"
                          : parDifference > 1
                          ? "bg-red-200 text-red-900"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {parDifference > 0 ? "+" : ""}
                      {parDifference}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full p-4 bg-green-700 text-white text-lg font-bold rounded-lg hover:bg-green-800 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() =>
              navigate("/play", { state: { courseName, players, holes } })
            }
            className="w-full p-4 bg-green-700 text-white text-lg font-bold rounded-lg hover:bg-green-800 transition-colors"
          >
            Edit Scores
          </button>
        </div>
      </div>
    </div>
  );  
}

export default SummaryPage;
