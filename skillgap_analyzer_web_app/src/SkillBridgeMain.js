import React, { useState } from "react";

/*
  SkillBridgeMain - Main container/component for SkillBridge (ColorCraft frontend Container)

  Features:
    1. Skill Assessment - Users input current skills and proficiency.
    2. Job Role Selection - Users select/search target career/job.
    3. Gap Analysis Report - Comparisons & Chart/Visualization.
    4. Learning Resource Suggestions - Resource cards with quick links.
    5. Progress Tracking - Users check off progress, see overall completion.

  Visual design: Colorful, step-wise, "light" theme with provided custom colors.
  - primary:   #4F8A8B
  - secondary: #FBD46D
  - accent:    #F6416C

  No backend - data lives in state
*/


// Skill options and roles for demonstration (would come from backend in prod)
const SKILL_OPTIONS = [
  "JavaScript", "React", "CSS", "Python", "Data Analysis", "Communication", "Leadership",
  "Project Management", "SQL", "UI/UX Design"
];
// Simple demo job roles dictionary
const JOB_ROLES = [
  {
    name: "Frontend Developer",
    skills: {
      "JavaScript": 4,
      "React": 4,
      "CSS": 3,
      "UI/UX Design": 2
    }
  },
  {
    name: "Data Analyst",
    skills: {
      "Python": 4,
      "Data Analysis": 5,
      "SQL": 3,
      "Communication": 3
    }
  },
  {
    name: "Team Lead",
    skills: {
      "Leadership": 5,
      "Communication": 4,
      "Project Management": 4,
      "JavaScript": 2
    }
  }
];

// Example resources (would be dynamic in prod)
const RESOURCE_SUGGESTIONS = {
  "JavaScript": [
    {
      title: "JavaScript for Beginners",
      type: "Course",
      url: "https://www.codecademy.com/learn/introduction-to-javascript",
    }
  ],
  "React": [
    {
      title: "React Official Tutorial",
      type: "Docs",
      url: "https://reactjs.org/tutorial/tutorial.html",
    }
  ],
  "CSS": [
    {
      title: "CSS Basics",
      type: "Article",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics",
    }
  ],
  "Python": [
    {
      title: "Python.org Beginners Guide",
      type: "Docs",
      url: "https://docs.python.org/3/tutorial/index.html",
    }
  ],
  "Data Analysis": [
    {
      title: "Kaggle Data Analysis Micro-course",
      type: "Course",
      url: "https://www.kaggle.com/learn/data-analysis",
    }
  ],
  "Communication": [
    {
      title: "Improving Communication Skills",
      type: "MOOC",
      url: "https://www.coursera.org/learn/wharton-communication-skills",
    }
  ],
  "Leadership": [
    {
      title: "Leadership Foundations",
      type: "Course",
      url: "https://www.linkedin.com/learning/leadership-foundations",
    }
  ],
  "Project Management": [
    {
      title: "Project Management Principles",
      type: "Article",
      url: "https://asana.com/resources/project-management",
    }
  ],
  "SQL": [
    {
      title: "SQL for Data Science",
      type: "MOOC",
      url: "https://www.coursera.org/learn/sql-for-data-science",
    }
  ],
  "UI/UX Design": [
    {
      title: "Intro to UX/UI Design",
      type: "Article",
      url: "https://careerfoundry.com/en/blog/ux-design/what-is-ux-ui-design/",
    }
  ]
};

const STEPS = [
  "Skill Assessment",
  "Job Role Selection",
  "Gap Analysis",
  "Learning Resources",
  "Progress Tracking"
];

const COLOR = {
  primary: "#4F8A8B",
  secondary: "#FBD46D",
  accent: "#F6416C"
};


// PUBLIC_INTERFACE
function SkillBridgeMain() {
  // Step state
  const [step, setStep] = useState(0);

  // User skills: [{name, level}]
  const [userSkills, setUserSkills] = useState([{ name: "", level: 1 }]);
  // Selected job role
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  // Track completion per skill in progress tracking
  const [progress, setProgress] = useState({});

  // Handler for user skill changes
  function handleUserSkillChange(idx, field, value) {
    const skills = [...userSkills];
    skills[idx][field] = value;
    setUserSkills(skills);
  }

  function handleAddSkill() {
    setUserSkills([...userSkills, { name: "", level: 1 }]);
  }

  function handleRemoveSkill(idx) {
    if (userSkills.length === 1) return;
    setUserSkills(userSkills.filter((_, i) => i !== idx));
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }

  // Calculate gap analysis
  function getGapAnalysis() {
    const userMap = {};
    for (let { name, level } of userSkills) {
      userMap[name] = Number(level);
    }
    const required = JOB_ROLES[selectedJobIndex].skills;
    const allSkills = Array.from(new Set([...Object.keys(required), ...Object.keys(userMap)]));

    return allSkills.map((sk) => ({
      name: sk,
      user: userMap[sk] || 0,
      required: required[sk] || 0,
      gap: (required[sk] || 0) - (userMap[sk] || 0)
    }));
  }

  // For progress, count acquired/total for required skills
  function getProgressStats() {
    const analysis = getGapAnalysis();
    const total = analysis.length;
    const done = analysis.reduce(
      (cnt, skill) => cnt + (progress[skill.name] || skill.user >= skill.required ? 1 : 0),
      0
    );
    return { done, total };
  }

  // Get skill gaps (deficit only)
  function getSkillGapList() {
    return getGapAnalysis().filter(skill => skill.gap > 0);
  }

  // --- STEP CONTENTS ---
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <SkillAssessment
            userSkills={userSkills}
            setUserSkills={setUserSkills}
            handleUserSkillChange={handleUserSkillChange}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
        );
      case 1:
        return (
          <JobRoleSelection
            jobRoles={JOB_ROLES}
            selectedJobIndex={selectedJobIndex}
            setSelectedJobIndex={setSelectedJobIndex}
          />
        );
      case 2:
        return (
          <GapAnalysis
            job={JOB_ROLES[selectedJobIndex]}
            userSkills={userSkills}
            getGapAnalysis={getGapAnalysis}
            color={COLOR}
          />
        );
      case 3:
        return (
          <LearningResources
            gapSkills={getSkillGapList()}
            resourceSuggestions={RESOURCE_SUGGESTIONS}
            color={COLOR}
          />
        );
      case 4:
        return (
          <ProgressTracking
            gapAnalysis={getGapAnalysis()}
            progress={progress}
            setProgress={setProgress}
            color={COLOR}
          />
        );
      default:
        return null;
    }
  };

  // PUBLIC_INTERFACE
  return (
    <div style={{
      background: "#fff",
      minHeight: "100vh",
      fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
      color: "#1A1A1A"
    }}>
      <header style={{
        background: COLOR.primary,
        color: '#fff',
        padding: "22px 0",
        borderBottom: `4px solid ${COLOR.secondary}`,
        boxShadow: "0 2px 8px 0 rgba(79, 138, 139, 0.05)"
      }}>
        <div style={{
          maxWidth: 950,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ fontWeight: 700, fontSize: 25, letterSpacing: 1.2, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              color: COLOR.secondary,
              fontSize: 32,
              fontWeight: "bold"
            }}>🎨</span> SkillBridge
          </div>
          <div style={{
            background: COLOR.accent,
            color: "#fff",
            borderRadius: 21,
            padding: "4px 18px",
            fontWeight: 500,
            fontSize: 16,
            boxShadow: "0 0 0 2px rgba(246, 65, 108, 0.09)"
          }}>
            ColorCraft
          </div>
        </div>
      </header>
      <main style={{
        maxWidth: 950,
        margin: "0 auto",
        padding: "48px 15px 36px 15px"
      }}>
        <div style={{
          margin: "24px 0 42px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            color: COLOR.accent,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: "1rem"
          }}>
            Skill Gap Analyzer
          </div>
          <h2 style={{
            margin: "7px 0 0 0",
            fontWeight: 700,
            fontSize: "2.6rem",
            lineHeight: 1.12
          }}>
            {STEPS[step]}
          </h2>
          <p style={{
            color: "#444",
            fontSize: "1.19rem",
            marginTop: 12,
            marginBottom: 0,
            maxWidth: 620,
            textAlign: "center"
          }}>
            {step === 0 && "Input your skills to begin your personalized journey!"}
            {step === 1 && "Which career or job do you want to compare your skills against?"}
            {step === 2 && "See how your skills compare to your dream role & explore your gap analysis!"}
            {step === 3 && "Explore hand-picked resources to bridge your skill gaps."}
            {step === 4 && "Mark your progress as you upskill and close your gaps!"}
          </p>
        </div>

        {/* Stepper Indicator */}
        <Stepper step={step} steps={STEPS} color={COLOR} />

        <div style={{ margin: "36px 0 32px 0", minHeight: 340 }}>
          {renderStep()}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              background: "#fff",
              color: COLOR.primary,
              border: `2px solid ${COLOR.primary}`,
              borderRadius: 6,
              padding: "9px 22px",
              fontWeight: 500,
              fontSize: 16,
              opacity: step === 0 ? 0.5 : 1,
              cursor: step === 0 ? "not-allowed" : "pointer",
              boxShadow: "0 2px 9px 0 rgb(79 138 139 / 5%)"
            }}
          >
            &larr; Back
          </button>
          <button
            onClick={handleNext}
            disabled={step === STEPS.length - 1}
            style={{
              background: COLOR.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "9px 22px",
              fontWeight: 600,
              fontSize: 16,
              opacity: step === STEPS.length - 1 ? 0.5 : 1,
              cursor: step === STEPS.length - 1 ? "not-allowed" : "pointer",
              boxShadow: "0 2px 9px 0 rgb(246 65 108 / 7%)"
            }}
          >
            {step === STEPS.length - 2 ? "Suggest Resources" : "Next →"}
          </button>
        </div>

        {step === 4 && (
          <div style={{
            margin: "30px 0 0 0",
            background: COLOR.secondary,
            padding: "18px 24px",
            borderRadius: 10,
            boxShadow: "0 2px 5px 0 rgba(0,0,0,0.06)",
            color: "#333",
            fontWeight: 600,
            textAlign: "center",
            fontSize: "1.19rem"
          }}>
            Progress: {getProgressStats().done} / {getProgressStats().total} skills completed! 🚀
          </div>
        )}
      </main>
      <footer style={{
        borderTop: `2px solid ${COLOR.secondary}`,
        background: "#f7f7f7",
        color: "#666",
        fontSize: 15,
        fontWeight: 400,
        marginTop: 30,
        padding: "18px 0",
        textAlign: "center"
      }}>
        SkillBridge &lt;ColorCraft Edition&gt; &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}


// ---------- Step Components Below --

function Stepper({ step, steps, color }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      margin: "22px 0"
    }}>
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div style={{
            background: idx === step ? color.primary : "#f0f0f0",
            color: idx === step ? "#fff" : "#444",
            border: `2px solid ${color.primary}`,
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "1.03rem",
            transition: "background 0.14s"
          }}>
            {idx+1}
          </div>
          {idx < steps.length - 1 && (
            <div style={{
              height: 3,
              width: 30,
              background: idx < step ? color.primary : "#edecee",
              borderRadius: 2
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}


// PUBLIC_INTERFACE
function SkillAssessment({
  userSkills,
  handleUserSkillChange,
  handleAddSkill,
  handleRemoveSkill
}) {
  return (
    <div>
      <div style={{marginBottom:22}}>
        <strong style={{fontSize:"1.14rem"}}>Your Current Skills</strong>
        <p style={{color:"#666", margin:"6px 0 0 0", fontSize:"1rem"}}>Select your skills and rate your proficiency.</p>
      </div>
      {userSkills.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12
          }}
        >
          <select
            value={entry.name}
            onChange={e => handleUserSkillChange(idx, "name", e.target.value)}
            style={{
              border: "1px solid #bbb",
              borderRadius: 6,
              fontSize: 16,
              padding: "8px 14px",
              minWidth: 180
            }}
            required
          >
            <option value="">Select skill...</option>
            {SKILL_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <label style={{fontWeight:500}}>Proficiency:
            <select
              value={entry.level}
              onChange={e => handleUserSkillChange(idx, "level", e.target.value)}
              style={{
                border: "1px solid #bbb",
                borderRadius: 6,
                fontSize: 16,
                padding: "8px 8px",
                marginLeft: 7
              }}
            >
              {[1,2,3,4,5].map(lvl =>
                <option key={lvl} value={lvl}>
                  {lvl} {["(Beginner)","","","","(Expert)"][lvl-1]}
                </option>
              )}
            </select>
          </label>
          <button
            onClick={() => handleRemoveSkill(idx)}
            style={{
              background: "#fff",
              border: "1px solid #d6d6d6",
              color: "#e74c3c",
              borderRadius: 16,
              fontWeight: 800,
              fontSize: 24,
              width: 36, height: 36, cursor: userSkills.length === 1 ? "not-allowed" : "pointer",
              opacity: userSkills.length === 1 ? 0.38 : 1,
              marginLeft: 16
            }}
            disabled={userSkills.length === 1}
            title="Remove Skill"
            tabIndex={-1}
          >
            −
          </button>
        </div>
      ))}
      <button
        onClick={handleAddSkill}
        style={{
          background: COLOR.secondary,
          color: "#222",
          border: "none",
          borderRadius: 7,
          fontWeight: 700,
          fontSize: 15,
          padding: "9px 19px",
          marginTop: 10,
          marginLeft: 2,
          boxShadow: "0 1px 6px 0 rgba(251,212,109,0.09)",
          cursor: "pointer"
        }}
      >
        + Add Another Skill
      </button>
    </div>
  );
}


// PUBLIC_INTERFACE
function JobRoleSelection({ jobRoles, selectedJobIndex, setSelectedJobIndex }) {
  // (For demo: simple select, for real life, a search could be added)
  return (
    <div>
      <div style={{marginBottom:22}}>
        <strong style={{fontSize: "1.14rem"}}>Select a Job Role</strong>
        <p style={{color:"#666", margin:"6px 0 0 0", fontSize:"1rem"}}>
          Choose the job/career path you'd like to analyze
        </p>
      </div>
      <select
        value={selectedJobIndex}
        onChange={e => setSelectedJobIndex(Number(e.target.value))}
        style={{
          border: "2px solid #4F8A8B",
          borderRadius: 7,
          fontSize: 18,
          padding: "11px 19px",
          minWidth: 260
        }}
      >
        {jobRoles.map((role, idx) =>
          <option key={role.name} value={idx}>{role.name}</option>
        )}
      </select>
      <ul style={{color:"#555", margin:"13px 0 0 4px", fontSize:16}}>
        <li>
          <b>Required skills:</b>{" "}
          {Object.entries(jobRoles[selectedJobIndex].skills).map(
            ([sk, lvl]) => `${sk} (${lvl}/5)`
          ).join(", ")}
        </li>
      </ul>
    </div>
  );
}


// PUBLIC_INTERFACE
function GapAnalysis({ job, userSkills, getGapAnalysis, color }) {
  const analysis = getGapAnalysis();

  return (
    <div>
      <strong style={{fontSize:"1.14rem"}}>Gap Analysis for <span style={{color:color.primary}}>{job.name}</span></strong>
      <div style={{margin:"8px 0 18px 0", color:"#777", fontSize:15}}>Visualizing your skill match and gaps:</div>
      <table style={{
        width: "100%",
        borderSpacing: 0,
        marginBottom: 16,
        background: "#fafafa",
        borderRadius: 9,
        boxShadow: "0 1px 6px 0 rgba(104, 205, 196, 0.03)"
      }}>
        <thead>
          <tr>
            <th style={{textAlign:"left", padding:"6px 10px", color:color.primary}}>Skill</th>
            <th style={{textAlign:"center", padding:"6px", color:"#222"}}>You</th>
            <th style={{textAlign:"center", padding:"6px", color:"#222"}}>Required</th>
            <th style={{textAlign:"center", padding:"6px", color:color.accent}}>Gap</th>
            <th style={{textAlign:"center", padding:"6px"}}>Visual</th>
          </tr>
        </thead>
        <tbody>
        {analysis.map((row) =>
          <tr key={row.name}>
            <td style={{padding:"7px 12px"}}><b>{row.name}</b></td>
            <td style={{textAlign:"center", color:"#27ae60"}}>{row.user}</td>
            <td style={{textAlign:"center", color:color.primary}}>{row.required}</td>
            <td style={{
              textAlign:"center",
              color: row.gap > 0 ? color.accent : "#3cc18e",
              fontWeight: 600
            }}>
              {row.gap > 0 ? "+"+row.gap : "✔"}
            </td>
            <td style={{textAlign:"center"}}>
              {/* Chart bar: user/required */}
              <div style={{ width: 86, display: "flex", gap:0, height:16 }}>
                <div style={{
                  background: color.secondary,
                  width: `${(Math.max(row.user, 0)/5)*100}%`,
                  borderRadius: "8px 0 0 8px",
                  height:16,
                  transition:"width 0.2s"
                }} title="User Score"/>
                <div style={{
                  background: color.primary,
                  width: `${((row.required-row.user)>0 ? (Math.min(row.required, 5)-Math.max(row.user,0))/5 : 0)*100}%`,
                  borderRadius: "0 8px 8px 0",
                  height: 16
                }} title="Gap Score"/>
              </div>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <div style={{color:color.primary, fontWeight:700, marginBottom:4, marginTop:14}}>Legend:</div>
      <div style={{fontSize:14,color:"#555",display:"flex",alignItems:"center",gap:13}}>
        <span style={{
          display:"inline-block",background:color.secondary,width:18,height:10,borderRadius:5,marginRight:3
        }}></span> Your proficiency
        <span style={{
          display:"inline-block",background:color.primary,width:18,height:10,borderRadius:5,marginRight:3
        }}></span> Gap to close
        <span style={{
          display:"inline-block",background:color.accent,width:18,height:10,borderRadius:5,marginRight:3
        }}></span> Calls to action
      </div>
    </div>
  );
}


// PUBLIC_INTERFACE
function LearningResources({ gapSkills, resourceSuggestions, color }) {
  return (
    <div>
      <strong style={{fontSize:"1.14rem"}}>Recommendations to Bridge Your Skill Gaps</strong>
      {gapSkills.length === 0 ? (
        <div style={{margin:"18px 0", color:color.primary, fontWeight:500}}>
          🎉 You meet or exceed all required skills for your target role!
        </div>
      ) : (
        <>
          <div style={{margin:"10px 0 18px 0", color:"#444", fontSize:15}}>Explore courses, articles, and videos for developing your gap skills:</div>
          <div style={{
            display:"flex",
            flexWrap:"wrap",
            gap:"18px 24px"
          }}>
            {gapSkills.map(skill => (
              <div key={skill.name} style={{
                border: `2px solid ${color.primary}`,
                borderRadius: 14,
                padding: "16px 17px",
                background: "#fff",
                minWidth: 222,
                maxWidth: 300,
                flex: "1 1 235px",
                boxShadow: "0 1px 8px 0 rgba(79,138,139,0.08)"
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: color.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 7
                }}>
                  <span style={{color: color.accent}}>★</span> {skill.name}
                </div>
                <ul style={{margin: "10px 0 0 4px", padding: 0, listStyle: "disc"}}>
                  {(resourceSuggestions[skill.name] || []).map((res, idx) => (
                    <li key={idx} style={{marginBottom: 6, fontSize: 15}}>
                      <span style={{
                        color: color.accent, fontWeight: 500, fontSize: 15
                      }}>{res.type}:</span>{" "}
                      <a href={res.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          color: color.primary,
                          fontWeight: 500,
                          textDecoration: "underline"
                        }}>{res.title}</a>
                    </li>
                  ))}
                  {(resourceSuggestions[skill.name]||[]).length === 0 &&
                    <li style={{fontSize:15,color:"#9a9a9a"}}>No resources available.</li>
                  }
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


// PUBLIC_INTERFACE
function ProgressTracking({ gapAnalysis, progress, setProgress, color }) {
  // Show required skills, checkboxes for completion
  return (
    <div>
      <strong style={{fontSize:"1.14rem"}}>Track Your Upskilling Progress</strong>
      <div style={{margin:"9px 0 17px 0",color:"#555",fontSize:15}}>
        Mark skills you have completed learning for your chosen role.
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {gapAnalysis.map((skill, idx) => (
          <div key={skill.name} style={{
            display:"flex", alignItems:"center", gap:18,
            background: "#fafbfc",
            borderRadius: 8,
            padding: "9px 13px",
            border: `1px solid ${color.primary}22`
          }}>
            <input
              type="checkbox"
              checked={progress[skill.name] || skill.user >= skill.required}
              onChange={() => setProgress({
                ...progress,
                [skill.name]: !(progress[skill.name] || skill.user >= skill.required)
              })}
              style={{
                width: 24, height: 24, accentColor: color.primary
              }}
              title={"Mark as complete"}
              disabled={skill.user >= skill.required}
            />
            <span style={{
              fontWeight: 600, fontSize:17, minWidth:118, color:color.primary
            }}>{skill.name}</span>
            <span style={{
              fontSize:15,
              marginLeft:7,
              color:skill.user >= skill.required ? "#17aa4b" : color.accent,
              fontWeight:600
            }}>
              {skill.user >= skill.required ? "Completed" : `Gap: +${skill.gap}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillBridgeMain;
