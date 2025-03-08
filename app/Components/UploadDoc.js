"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { revalidatePath } from "next/cache";
import Image from "next/image";
import { skillsData } from "../../lib/skillsData";

const UploadDoc = () => {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedQuiz, setUpdatedQuiz] = useState({});
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [findIndexQuiz, setFindIndexQuiz] = useState(null);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  // Define the skills array
  

  // Fetch skills when grade or subject changes
  const fetchSkills = (grade, subject) => {
    try {
      // Find the skills for the selected grade and subject
      const gradeData = skillsData.find((item) => item.grade === grade);
      if (gradeData) {
        const subjectData = gradeData.outcomes.find((item) => item.subject === subject);
        if (subjectData) {
          setSkills(subjectData.outcomes);
        } else {
          setSkills([]);
        }
      } else {
        setSkills([]);
      }
    } catch (error) {
      setError("Failed to fetch skills.");
    }
  };

  // Handle subject change
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    fetchSkills(grade, e.target.value);
  };

  // Handle grade change
  const handleGradeChange = (e) => {
    setGrade(e.target.value);
    fetchSkills(e.target.value, subject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload the document first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document);
    try {
      const res = await fetch("/api/quizzes/generate", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        const data = await res.json();
        setUpdatedQuiz(data.result.quiz);
        console.log(data.result);
        saveQuiz(data.result);
        router.push("/");
        // revalidatePath("/");
      }
    } catch (e) {
      console.log("error while generating", e);
    }
    setIsLoading(false);
  };

  async function saveQuiz(data) {
    try {
      const res = await fetch("http://localhost:3000/api/quizzes/parsequiz", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          quiz: data || updatedQuiz,
          subject, // Include selected subject
          grade, // Include selected grade
          skill,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update quiz");
      }

      toast.success("The quiz has been saved successfully.");
      setAllQuizzes(updatedQuiz);
    } catch (error) {
      toast.error(error.message);
    } finally {
      router.push("/"); // Navigate to main page
    }
  }

  const handleDocumentUpload = (e) => {
    setDocument(e?.target?.files?.[0]);
    if (error) {
      setError("");
    }
  };

  return (
    <div className=" text-xl w-fit">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="w-full flex flex-col gap-10" onSubmit={handleSubmit}>
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document?.name ? document.name : "Drag a file"}
            </div>
            <input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={handleDocumentUpload}
            />
          </label>
          <p className="text-secondary-foreground my-2 text-center">
            Supported file types: pdf
          </p>
          {error ? <p className="text-red-600">{error}</p> : null}
          <div className=" px-4 my-6 py-3 mx-auto rounded-md bg-theme font-bold text-white gap-10 flex items-center justify-between">
           
            <div>
              <span className="mr-2">Subject :</span>
              <select
                name="subject"
                className="text-theme px-2 rounded-md"
                onChange={handleSubjectChange}
              >
                <option value="">Choose Subject</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div>
              <span className="mr-2">Grade :</span>
              <select
                name="grade"
                className="text-theme px-2 rounded-md"
                onChange={handleGradeChange}
              >
                <option value="">Select Grade</option>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </div>
            <div>
              <span className="mr-2">Skill :</span>
              <select
                name="skill"
                className="text-theme px-2 rounded-md"
                onChange={(e) => setSkill(e.target.value)}
              >
                <option value="">Select Skill</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="mt-2 bg-theme p-4 rounded-lg text-white text-2xl font-semibold"
            type="submit"
          >
            Generate Quizz 🪄
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;