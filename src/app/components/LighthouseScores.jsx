import React from "react";

const LighthouseScores = () => {
  const scores = [
    { title: "Performance", value: 97, color: "bg-green-500" },
    { title: "Accessibility", value: 88, color: "bg-yellow-500" },
    { title: "Best Practices", value: 96, color: "bg-green-500" },
    { title: "SEO", value: 100, color: "bg-green-500" },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 p-6 ">
      {scores.map((score, index) => (
        <div
          key={index}
          className="flex flex-col items-center space-y-4 transform transition-all hover:scale-110 hover:shadow-2xl"
        >
          <div
            className={`relative w-20 h-20 flex items-center justify-center rounded-full ${score.color}`}
          >
            <span className="text-2xl font-extrabold text-white">{score.value}</span>
            <div
              className="absolute inset-0 border-4 border-gray-700 rounded-full animate-spin-slow"
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-300 tracking-wider">
            {score.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LighthouseScores;