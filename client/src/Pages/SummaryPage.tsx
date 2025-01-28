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
    <div className="min-h-screen py-8 px-4 md:px-16">
      <h1 className="text-3xl font-bold text-center mb-4">
        Game Summary
      </h1>
      <h2 className="text-xl text-center mb-6 text-gray-800">
        Course: <span className="font-semibold">{courseName}</span>
      </h2>
      <div className="overflow-x-auto border-8 rounded-md border-green-1 outline-2 outline-green-2 outline-double">
        <table className="min-w-full shadow-sm text-sm">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-gray-200 text-left font-medium text-gray-700 sticky left-0 z-10">
                Holes
              </th>
              {holes.map((hole, index) => (
                <th
                  key={index}
                  className="py-2 px-3 bg-gray-200 text-center font-medium text-gray-700"
                >
                  {hole.hole_number}
                </th>
              ))}
              <th className="py-2 px-3 bg-gray-200 text-center font-medium text-gray-700 sticky right-0 z-10">
                Total
              </th>
              <th className="py-2 px-3 bg-gray-200 text-center font-medium text-gray-700 sticky right-0 z-10">
                Par Difference
              </th>
            </tr>
            <tr>
              <th className="py-2 px-3 bg-gray-100 text-left font-medium text-gray-600 sticky left-0 z-10">
                Par
              </th>
              {holes.map((hole, index) => (
                <th
                  key={index}
                  className="py-2 px-3 bg-gray-100 text-center font-medium text-gray-600"
                >
                  {hole.par}
                </th>
              ))}
              <th className="py-2 px-3 bg-gray-100 text-center font-bold text-gray-800 sticky right-0 z-10">
                {totalPar}
              </th>
              <th className="py-2 px-3 bg-gray-100 text-center font-medium text-gray-600 sticky right-0 z-10"></th>
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
                  <td className="py-2 px-3 font-medium text-gray-800 sticky left-0 bg-white z-10">
                    {player.name}
                  </td>
                  {holes.map((hole, holeIndex) => {
                    const score = player.scores[holeIndex];
                    const isOB = player.isOB[holeIndex];

                    return (
                      <td
                        key={holeIndex}
                        className={`py-2 px-3 text-center ${getCellStyle(
                          score,
                          hole.par,
                          isOB
                        )}`}
                      >
                        {score !== null ? score : "-"}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center font-bold text-gray-800 sticky right-0 bg-white z-10">
                    {totalScore}
                  </td>
                  <td
                    className={`py-2 px-3 text-center font-bold sticky right-0 z-10 ${
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
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 text-sm font-medium text-green-2 hover:bg-green-1 rounded-lg border-2 border-green-2 shadow"
        >
          Back to Home
        </button>
        <button
          onClick={() =>
            navigate("/play", {
              state: { courseName, players, holes },
            })
          }
          className="px-6 py-2 text-sm font-medium text-white bg-green-2 hover:bg-green-1 rounded-lg shadow"
        >
          Edit Scores
        </button>
      </div>
    </div>
  );
}

export default SummaryPage;
