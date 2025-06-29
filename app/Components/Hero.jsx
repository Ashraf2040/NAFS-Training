import Image from "next/image";
import React, { useState } from "react";

const Hero = ({ role, changeTHeDomain }) => {
  if (role === "ST") return null;

  const [activeBox, setActiveBox] = useState(null);

  const boxes = [
    { title: "NAFS Mastering", color: "bg-theme", hover: "hover:bg-themeYellow" },
    { title: "GAT Mastering", color: "bg-blue-600", hover: "hover:bg-blue-500" },
    { title: "SAT Mastering", color: "bg-themeYellow", hover: "hover:bg-purple-500" },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="md:text-2xl text-theme font-semibold">
            Choose your preferred domain :
          </h1>
          
          {/* Three expandable boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
            {boxes
              .filter((box, index) => activeBox === null || activeBox === index) // Only show selected box or all if none selected
              .map((box, index) => (
                <div
                  key={index}
                  onClick={() => {
                    // Toggle active box locally for UI expansion
                    setActiveBox(activeBox === index ? null : index);
                    // Update the parent state with the box title
                    changeTHeDomain(box.title);
                  }}
                  className={`${box.color} ${box.hover} transition-all duration-500 ease-in-out rounded-xl p-6 md:p-8 text-white shadow-2xl hover:shadow-3xl cursor-pointer transform hover:scale-105 ${
                    activeBox === index
                      ? "sm:col-span-3 sm:row-span-1 sm:px-10 sm:py-12 md:min-h-[300px] scale-110 z-10 w-full sm:min-w-[80rem] max-w-7xl mx-auto"
                      : "sm:col-span-1 md:min-h-[200px] w-full"
                  }`}
                >
                  <h3
                    className={`font-bold mb-2 ${
                      activeBox === index ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                    } transition-all duration-300`}
                  >
                    {box.title}
                  </h3>
                  <p
                    className={`opacity-90 ${
                      activeBox === index ? "text-lg md:text-xl" : "text-sm md:text-base"
                    } transition-all duration-300`}
                  >
                    Master your skills for {box.title.replace(" Mastering", "")} with our expert training.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
