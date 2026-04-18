import { useState, useEffect, useRef } from "react";

const DIMS = [
  {
    id: "state",
    letter: "S¹",
    name: "state",
    tagline: "the body decides before the mind arrives",
    color: "#C45B3F",
    question: "Is your nervous system allowing choice or locked in reaction?",
    sayings: [
      "state always wins",
      "you cannot think your way out of a body stuck on",
      "the body provides the no the mind can no longer access",
      "risk mode is not anxiety — it is perimeter construction",
      "presence is residue of a body put in order",
      "sleep restores baseline — baseline is not the test",
    ],
    actions: [
      { step: "Audit your mode", desc: "Before any high-stakes decision, ask: am I in risk mode or rest mode? If your chest is tight, breath is shallow, and attention is narrow — you are in risk mode. Do not decide from here." },
      { step: "Body first protocol", desc: "Movement before meetings. 10 pushups, 60 seconds cold water, 5 minutes direct sunlight within 30 minutes of waking. The nervous system learns calm under stress through physical repetition, not through thinking about calm." },
      { step: "Track your HRV", desc: "Heart rate variability is the simplest read of whether choice is available. High variability means the system has range. Low means it is stuck on. Track daytime HRV, not just sleep. Many people wake up regulated and burn it to zero by noon." },
      { step: "Close open loops", desc: "Continuous activation without resolution eats control bandwidth. Every unresolved email, undecided hire, ambiguous relationship keeps the system activated. Close, defer, or delete. Open loops are the silent tax on state." },
      { step: "60-second resets", desc: "When the signal spikes: splash cold water on your face for 30 seconds. 5-10 pushups floor or wall. Step outside and widen your visual field. Change the signal, the body follows. No negotiation required." },
    ],
    assessment: [
      { q: "I make the same quality decisions at 4pm that I make at 9am", scale: true },
      { q: "I can pause before replying to provocative messages", scale: true },
      { q: "My sleep restores me — I wake feeling recovered", scale: true },
      { q: "I can distinguish between urgency and importance in real time", scale: true },
      { q: "Physical tension in my body has reduced over the past 30 days", scale: true },
    ]
  },
  {
    id: "signal",
    letter: "S²",
    name: "signal",
    tagline: "most of what you're reacting to already happened",
    color: "#B8860B",
    question: "Are you responding to what's actually happening, or to what your system remembers?",
    sayings: [
      "a trigger is a scheduling decision the body already made",
      "the nervous system mistakes a ghost for a guest",
      "thought is closed captioning for a movie already playing",
      "the devil shows up calm confident well dressed",
      "intensity becomes meaning when discernment collapses",
      "if i can explain it i can protect myself — wrong",
    ],
    actions: [
      { step: "Name the ghost", desc: "When a reaction feels disproportionate to the moment, ask: is this a real threat or a remembered one? The body cannot tell a harsh email from a predator. Same alarm. Same surge. Naming the pattern breaks the automatic loop." },
      { step: "Map your watchlist", desc: "The devil has a watchlist: early morning alone, late night after a screen, right after something good happens. Know your vulnerable windows. Context is thin, feedback is gone, memory fills the room. Don't conclude who you are during these moments." },
      { step: "Contain before you explain", desc: "When talking feels like bleeding out rather than cleaning a wound — contain. Do not engage intrusive imagery or narrative. Interrupt. Redirect. Physical anchor. Explaining is for lighter loads. Containment is for heavy." },
      { step: "Run the litmus test", desc: "Does explaining make you feel lighter or light headed? Does the narrative provide a map or a maze? Does the why exhaust you? If yes — contain. Act. Clarity is residue of a regulated body, not a well-argued case." },
      { step: "Audit signal source", desc: "Before reacting, ask: where is this signal coming from? Is it data from the present moment, or pattern-matching from the past? Is it your gut reading reality, or your cortex running a post-game analysis on a game that ended years ago?" },
    ],
    assessment: [
      { q: "I can tell the difference between real threats and false alarms in my body", scale: true },
      { q: "I rarely replay conversations or events for more than a few minutes", scale: true },
      { q: "My emotional reactions are proportionate to what's actually happening", scale: true },
      { q: "I can receive ambiguous information without spiraling", scale: true },
      { q: "I recognize when my mind is running old code on a new situation", scale: true },
    ]
  },
  {
    id: "structure",
    letter: "S³",
    name: "structure",
    tagline: "you cannot calibrate inside a system that lies",
    color: "#4A7C6F",
    question: "Is the system you're operating inside designed to support what you're trying to do?",
    sayings: [
      "agency is not willpower — it is accurate signal converted to correct adjustment",
      "redraw the load path or accept the shear",
      "identity built from moments requires infinite maintenance",
      "values subtract before they add",
      "your identity is rented and rent always goes up mfer",
      "culture is values plus behaviors — everything else is decoration",
    ],
    actions: [
      { step: "Audit your load path", desc: "Where is the weight actually being carried in your organization? Follow the load, not the org chart. If effort increases but outcomes don't, the structure is absorbing your energy without transferring it. Precision on the wrong frame is expensive." },
      { step: "Define your mission in one sentence", desc: "A leader provides a vision for others to rally around. If you cannot state your mission in one clear sentence that every employee can repeat, your culture is running on assumptions. Clarity is the first act of leadership." },
      { step: "Build your values as constraints", desc: "Values are not slogans. They are what you cannot do. Truth, steadiness, agency, craft, clarity — these define you by what they block: who you cannot stay friends with, what deals you cannot take, what pace you refuse. Values subtract before they add." },
      { step: "Map behaviors to values", desc: "Culture is values plus behaviors. Define the specific behaviors that express each value. If you value truth: feedback is given directly, meetings start with what is actually happening, problems are named before solutions are proposed. Behaviors make values observable." },
      { step: "Run the identity audit", desc: "Is your identity as a leader built on external validation or internal definition? If your peace requires agreement, memory, justice, or recognition — your identity is rented. Events become data when identity is internally defined. Pain still arrives. It does not metastasize." },
      { step: "Inspect the structure for lies", desc: "When gauges read nominal but the frame is buckling — the structure is lying. The visible frame holds language and alignment. The load-bearing frame holds actual capacity and incentives. If you are optimizing the visible surface while the footing moves, you are in a split load system." },
    ],
    assessment: [
      { q: "My organizational structure supports the strategy I am trying to execute", scale: true },
      { q: "I can clearly state my company's mission in one sentence", scale: true },
      { q: "My direct reports understand what behaviors are expected of them", scale: true },
      { q: "My identity as a leader does not depend on external validation", scale: true },
      { q: "I have exited or restructured relationships and systems that were working against me", scale: true },
    ]
  },
  {
    id: "sequence",
    letter: "S⁴",
    name: "sequence",
    tagline: "the right move in the wrong order is the wrong move",
    color: "#5B6ABF",
    question: "Are you running the right plays in the right order?",
    sayings: [
      "body first philosophy later",
      "meaning follows stability not the other way around",
      "performance first story after",
      "strategy only works when state is clean",
      "you do not lecture the car — you drive it",
      "the voice-over belongs at the end of the movie",
    ],
    actions: [
      { step: "Fix state before strategy", desc: "Do not make strategic decisions from a dysregulated nervous system. The hierarchy is fixed: physiology → psychology → narrative. No amount of strategic thinking compensates for a body stuck in risk mode. Regulate first. Decide second." },
      { step: "Sequence your day by state", desc: "Your highest-state hours go to your highest-leverage decisions. For most CEOs this is 6am-11am. Protect that window from meetings, email, and reactive tasks. Put the strategic work where the system has range. Put the administrative work where it doesn't matter." },
      { step: "Stop narrating mid-scene", desc: "Voice-over belongs at the end of the movie, not the middle. Every time you explain yourself while still in the room, you freeze motion and call it truth. Performance first. Story after. Jordan didn't explain the shot while it was in the air." },
      { step: "Build the base before the peak", desc: "Distribution creates surface area. Surface area creates attention. Attention creates value. In your organization: hire before you scale, systematize before you optimize, stabilize before you grow. The sequence is not reversible." },
      { step: "Replace expectations with plans", desc: "Expectations are what you hope will happen. Plans are what you will do when it doesn't. In uncertainty, expectations produce anxiety. Plans produce options. Convert every expectation into a specific action with a trigger condition and a deadline." },
    ],
    assessment: [
      { q: "I address my physical state before making important decisions", scale: true },
      { q: "My highest-leverage work gets my highest-quality hours", scale: true },
      { q: "I have a clear onboarding sequence for new hires, not ad hoc orientation", scale: true },
      { q: "I stabilize operations before pursuing growth", scale: true },
      { q: "My planning process produces specific actions, not aspirational goals", scale: true },
    ]
  },
];

const LANG = {
  id: "language",
  letter: "L",
  name: "language",
  tagline: "the story you tell determines which system runs",
  color: "#8B6B8B",
  question: "Is the story you're telling helping you move or keeping you stuck?",
  sayings: [
    "words are tinder — they feed the fire rather than dousing it",
    "the captions feel powerful because they are loud — they are descriptive not directive",
    "this is who you are — the sentence that ends more futures than bad luck",
    "identity is a log not a description",
    "use your name for the storm — use i for joy",
    "an identity built from moments requires infinite maintenance",
  ],
  actions: [
    { step: "Third person for storms, first person for joy", desc: "When overwhelmed: 'OG is rattled. OG needs five minutes outside. OG will handle one task then reassess.' When grateful: 'I love this. I want this. I am here.' Distance for management. Presence for living." },
    { step: "Stop self-describing", desc: "Every self-description is a cage. 'This is who I am' renders futures inaccessible. Replace descriptions with logs: what did I do today? Identity is not a sentence you repeat. It is the record of what you keep choosing." },
    { step: "Reframe emotion as system behavior", desc: "Rage is not failure — it is a system-level override. Fear is not weakness — it is perimeter construction. Desperation is not character — it is a state that bends decisions. Language that frames emotion as system behavior removes moral judgment and enables intervention." },
    { step: "Audit your company's language", desc: "What words does your organization use repeatedly? 'Hustle' keeps the system in risk mode. 'Alignment' without specifics creates the illusion of agreement. 'Culture' without defined behaviors is decoration. Swap abstract language for observable behaviors." },
    { step: "Write to clarify, not to perform", desc: "The best CEOs write to themselves before they write to others. Morning pages, decision journals, weekly reflections. Writing externalizes the narrative so it can be examined. If you only think about your problems, the closed captioning runs the show." },
  ],
};

const SCORES = ["strongly disagree", "disagree", "neutral", "agree", "strongly agree"];

export default function FourSL() {
  const [view, setView] = useState("home");
  const [activeDim, setActiveDim] = useState(null);
  const [assessmentScores, setAssessmentScores] = useState({});
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [dailyPlan, setDailyPlan] = useState({ state: "", priorities: "", sequence: "" });
  const [showResults, setShowResults] = useState(false);

  const allDims = [...DIMS, LANG];
  const dim = activeDim !== null ? allDims[activeDim] : null;

  const totalQs = [...DIMS, LANG].reduce((sum, d) => sum + (d.assessment?.length || 0), 0);
  const answered = Object.keys(assessmentScores).length;

  const getScore = (dimId) => {
    const d = allDims.find(x => x.id === dimId);
    if (!d?.assessment) return null;
    const scores = d.assessment.map((_, i) => assessmentScores[`${dimId}-${i}`]).filter(x => x !== undefined);
    if (scores.length === 0) return null;
    return Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 4)) * 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A08", color: "#E8E2D6", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .fade { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        button { cursor: pointer; background: transparent; border: 1px solid rgba(187,169,138,0.3); color: #BBA98A; padding: 12px 24px; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.2s; }
        button:hover { background: rgba(187,169,138,0.1); border-color: #BBA98A; }
        .nav-btn { border: none; padding: 8px 16px; font-size: 11px; opacity: 0.5; }
        .nav-btn:hover { opacity: 1; background: transparent; }
        .nav-btn.active { opacity: 1; border-bottom: 1px solid #BBA98A; }
        textarea { width: 100%; background: rgba(187,169,138,0.05); border: 1px solid rgba(187,169,138,0.15); color: #E8E2D6; padding: 12px; font-family: 'DM Mono', monospace; font-size: 13px; resize: vertical; min-height: 60px; }
        textarea:focus { outline: none; border-color: rgba(187,169,138,0.4); }
        .dim-card { border: 1px solid rgba(187,169,138,0.12); padding: 24px; cursor: pointer; transition: all 0.3s; }
        .dim-card:hover { border-color: rgba(187,169,138,0.35); background: rgba(187,169,138,0.02); }
        .score-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; padding: 0; }
        .score-btn.selected { background: rgba(187,169,138,0.2); border-color: #BBA98A; }
      `}</style>

      <nav style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(187,169,138,0.08)" }}>
        <div className="mono" style={{ fontSize: 16, letterSpacing: 4, color: "#BBA98A", cursor: "pointer" }} onClick={() => { setView("home"); setActiveDim(null); }}>
          4SL
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["home", "framework", "assess", "plan"].map(v => (
            <button key={v} className={`nav-btn ${view === v ? "active" : ""}`} onClick={() => { setView(v); setActiveDim(null); }}>
              {v === "home" ? "system" : v === "assess" ? "diagnostic" : v === "plan" ? "daily plan" : v}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px" }} className="fade">

        {view === "home" && (
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 4, color: "rgba(187,169,138,0.4)", marginBottom: 24 }}>THE CEO OPERATING SYSTEM</div>
            <h1 style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.2, marginBottom: 12 }}>4SL</h1>
            <p style={{ fontSize: 18, fontWeight: 300, color: "rgba(232,226,214,0.6)", marginBottom: 40, lineHeight: 1.7 }}>
              state — signal — structure — sequence<br />
              <span style={{ color: "#BBA98A" }}>language shapes how all four are interpreted</span>
            </p>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(232,226,214,0.55)", marginBottom: 20 }}>most ceos are optimizing the wrong layer. they fix strategy when state is broken. they fix behavior when the structure is lying. they fix communication when the sequence is reversed. they never examine the language that keeps the whole pattern locked in place.</p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(232,226,214,0.55)" }}>4sl identifies where the operating issue actually sits. then it gives you the tools to fix it in the right order.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {[...DIMS, LANG].map((d, i) => (
                <div key={d.id} className="dim-card" onClick={() => { setView("framework"); setActiveDim(i); }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span className="mono" style={{ fontSize: 14, color: d.color, minWidth: 28 }}>{d.letter}</span>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 400 }}>{d.name}</span>
                      <span style={{ fontSize: 13, color: "rgba(232,226,214,0.35)", marginLeft: 16 }}>{d.tagline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setView("assess")}>take the diagnostic</button>
              <button onClick={() => setView("plan")}>build today's plan</button>
            </div>
          </div>
        )}

        {view === "framework" && dim && (
          <div>
            <button className="nav-btn" onClick={() => setActiveDim(null)} style={{ marginBottom: 24, paddingLeft: 0 }}>← all dimensions</button>
            {activeDim === null ? (
              <div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: 4, color: "rgba(187,169,138,0.4)", marginBottom: 24 }}>THE 4SL FRAMEWORK</div>
                <p style={{ fontSize: 15, color: "rgba(232,226,214,0.5)", marginBottom: 32 }}>select a dimension to explore its action steps, sayings, and diagnostic questions</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {allDims.map((d, i) => (
                    <div key={d.id} className="dim-card" onClick={() => setActiveDim(i)}>
                      <span className="mono" style={{ color: d.color, marginRight: 16 }}>{d.letter}</span>
                      <span style={{ fontSize: 20 }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 28, color: dim.color }}>{dim.letter}</span>
                  <h2 style={{ fontSize: 32, fontWeight: 300 }}>{dim.name}</h2>
                </div>
                <p style={{ fontSize: 16, color: "rgba(232,226,214,0.5)", fontStyle: "italic", marginBottom: 32 }}>{dim.tagline}</p>
                <div className="mono" style={{ fontSize: 15, color: dim.color, marginBottom: 24, lineHeight: 1.7 }}>"{dim.question}"</div>
                <div style={{ marginBottom: 40 }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: 3, color: "rgba(187,169,138,0.3)", marginBottom: 16 }}>KEY PHRASES</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {dim.sayings.map((s, i) => (
                      <div key={i} style={{ padding: "10px 16px", borderLeft: `2px solid ${dim.color}33`, fontSize: 14, color: "rgba(232,226,214,0.6)", fontStyle: "italic", lineHeight: 1.6 }}>{s}</div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 40 }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: 3, color: "rgba(187,169,138,0.3)", marginBottom: 16 }}>ACTION STEPS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {dim.actions.map((a, i) => (
                      <div key={i} style={{ padding: "20px", border: "1px solid rgba(187,169,138,0.1)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
                          <span className="mono" style={{ fontSize: 11, color: dim.color }}>{String(i + 1).padStart(2, "0")}</span>
                          <span style={{ fontSize: 16, fontWeight: 500 }}>{a.step}</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(232,226,214,0.55)", paddingLeft: 32 }}>{a.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {activeDim > 0 && <button onClick={() => setActiveDim(activeDim - 1)}>← {allDims[activeDim - 1].name}</button>}
                  {activeDim < allDims.length - 1 && <button onClick={() => setActiveDim(activeDim + 1)}>{allDims[activeDim + 1].name} →</button>}
                </div>
              </div>
            )}
          </div>
        )}

        {view === "assess" && (
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 4, color: "rgba(187,169,138,0.4)", marginBottom: 24 }}>4SL DIAGNOSTIC</div>
            <h2 style={{ fontSize: 28, fontWeight: 300, marginBottom: 8 }}>where does your operating issue sit?</h2>
            <p style={{ fontSize: 14, color: "rgba(232,226,214,0.4)", marginBottom: 32 }}>{answered}/{totalQs} answered</p>
            {!showResults ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {allDims.map(d => (
                  <div key={d.id}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                      <span className="mono" style={{ fontSize: 14, color: d.color }}>{d.letter}</span>
                      <span style={{ fontSize: 18 }}>{d.name}</span>
                    </div>
                    {d.assessment?.map((item, qi) => {
                      const key = `${d.id}-${qi}`;
                      return (
                        <div key={qi} style={{ marginBottom: 16, paddingLeft: 32 }}>
                          <p style={{ fontSize: 14, color: "rgba(232,226,214,0.6)", marginBottom: 8, lineHeight: 1.6 }}>{item.q}</p>
                          <div style={{ display: "flex", gap: 8 }}>
                            {[0, 1, 2, 3, 4].map(v => (
                              <button key={v} className={`score-btn ${assessmentScores[key] === v ? "selected" : ""}`}
                                onClick={() => setAssessmentScores(p => ({ ...p, [key]: v }))}
                                title={SCORES[v]}>
                                {v + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {answered >= totalQs && (
                  <button onClick={() => setShowResults(true)} style={{ alignSelf: "flex-start" }}>see my results</button>
                )}
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: 3, color: "rgba(187,169,138,0.3)", marginBottom: 16 }}>YOUR 4SL PROFILE</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {allDims.map(d => {
                      const score = getScore(d.id);
                      if (score === null) return null;
                      return (
                        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <span className="mono" style={{ fontSize: 13, color: d.color, minWidth: 80 }}>{d.letter} {d.name}</span>
                          <div style={{ flex: 1, height: 8, background: "rgba(187,169,138,0.08)", position: "relative" }}>
                            <div style={{ height: "100%", width: `${score}%`, background: d.color, transition: "width 1s ease" }} />
                          </div>
                          <span className="mono" style={{ fontSize: 13, color: d.color, minWidth: 36, textAlign: "right" }}>{score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {(() => {
                  const scores = allDims.map(d => ({ ...d, score: getScore(d.id) || 0 })).sort((a, b) => a.score - b.score);
                  const weakest = scores[0];
                  return (
                    <div style={{ padding: 24, border: `1px solid ${weakest.color}33`, marginBottom: 24 }}>
                      <div className="mono" style={{ fontSize: 11, letterSpacing: 3, color: weakest.color, marginBottom: 8 }}>YOUR PRIMARY OPERATING ISSUE</div>
                      <h3 style={{ fontSize: 22, fontWeight: 300, marginBottom: 8 }}>{weakest.letter} {weakest.name}</h3>
                      <p style={{ fontSize: 14, color: "rgba(232,226,214,0.5)", lineHeight: 1.7, marginBottom: 16 }}>{weakest.tagline}</p>
                      <button onClick={() => { setView("framework"); setActiveDim(allDims.findIndex(d => d.id === weakest.id)); }}>
                        see action steps for {weakest.name}
                      </button>
                    </div>
                  );
                })()}
                <button onClick={() => { setShowResults(false); setAssessmentScores({}); }}>retake</button>
              </div>
            )}
          </div>
        )}

        {view === "plan" && (
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 4, color: "rgba(187,169,138,0.4)", marginBottom: 24 }}>4SL DAILY OPERATING PLAN</div>
            <h2 style={{ fontSize: 28, fontWeight: 300, marginBottom: 8 }}>build today from the right layer</h2>
            <p style={{ fontSize: 14, color: "rgba(232,226,214,0.4)", marginBottom: 32 }}>state first. then signal. then structure. then sequence. language throughout.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ padding: 20, border: "1px solid rgba(196,91,63,0.2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 14, color: "#C45B3F" }}>S¹</span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>state check</span>
                  <span style={{ fontSize: 12, color: "rgba(232,226,214,0.3)" }}>before anything else</span>
                </div>
                <div style={{ paddingLeft: 32, display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, color: "rgba(232,226,214,0.5)" }}>how does your body feel right now? (1 = locked up, 5 = open and regulated)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1,2,3,4,5].map(v => (
                      <button key={v} className={`score-btn ${dailyPlan.state == v ? "selected" : ""}`}
                        onClick={() => setDailyPlan(p => ({ ...p, state: v }))}>{v}</button>
                    ))}
                  </div>
                  {dailyPlan.state && dailyPlan.state <= 2 && (
                    <div className="mono" style={{ fontSize: 12, color: "#C45B3F", marginTop: 8, lineHeight: 1.6 }}>state is low. do not make high-stakes decisions right now. body first: 10 pushups, cold water, 5 min outside. reassess in 30 minutes.</div>
                  )}
                  {dailyPlan.state && dailyPlan.state >= 4 && (
                    <div className="mono" style={{ fontSize: 12, color: "#4A7C6F", marginTop: 8, lineHeight: 1.6 }}>state is clean. this is your window for high-leverage work. protect the next 3 hours.</div>
                  )}
                </div>
              </div>
              <div style={{ padding: 20, border: "1px solid rgba(184,134,11,0.2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 14, color: "#B8860B" }}>S²</span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>signal check</span>
                  <span style={{ fontSize: 12, color: "rgba(232,226,214,0.3)" }}>what is actually happening today</span>
                </div>
                <div style={{ paddingLeft: 32 }}>
                  <textarea placeholder="what signals are you receiving right now? separate real from remembered. what is actually urgent vs what feels urgent?" value={dailyPlan.signals || ""} onChange={e => setDailyPlan(p => ({ ...p, signals: e.target.value }))} />
                </div>
              </div>
              <div style={{ padding: 20, border: "1px solid rgba(74,124,111,0.2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 14, color: "#4A7C6F" }}>S³</span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>structure</span>
                  <span style={{ fontSize: 12, color: "rgba(232,226,214,0.3)" }}>what needs to hold today</span>
                </div>
                <div style={{ paddingLeft: 32 }}>
                  <textarea placeholder="what commitments, meetings, and load-bearing decisions are on the board today? what structure needs to hold?" value={dailyPlan.structure || ""} onChange={e => setDailyPlan(p => ({ ...p, structure: e.target.value }))} />
                </div>
              </div>
              <div style={{ padding: 20, border: "1px solid rgba(91,106,191,0.2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 14, color: "#5B6ABF" }}>S⁴</span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>sequence</span>
                  <span style={{ fontSize: 12, color: "rgba(232,226,214,0.3)" }}>the order that matters</span>
                </div>
                <div style={{ paddingLeft: 32 }}>
                  <textarea placeholder="what is the most important thing to do first, second, third? sequence by state quality and leverage, not urgency." value={dailyPlan.sequence || ""} onChange={e => setDailyPlan(p => ({ ...p, sequence: e.target.value }))} />
                </div>
              </div>
              <div style={{ padding: 20, border: "1px solid rgba(139,107,139,0.2)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                  <span className="mono" style={{ fontSize: 14, color: "#8B6B8B" }}>L</span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>language</span>
                  <span style={{ fontSize: 12, color: "rgba(232,226,214,0.3)" }}>what story are you telling</span>
                </div>
                <div style={{ paddingLeft: 32 }}>
                  <textarea placeholder="what narrative is running in your head today? is it helping you move or keeping you stuck? rewrite it in third person if it's a storm." value={dailyPlan.language || ""} onChange={e => setDailyPlan(p => ({ ...p, language: e.target.value }))} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 32, padding: 20, background: "rgba(187,169,138,0.03)", border: "1px solid rgba(187,169,138,0.1)" }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: 3, color: "rgba(187,169,138,0.4)", marginBottom: 8 }}>DAILY OPERATING PRINCIPLE</div>
              <p style={{ fontSize: 15, fontStyle: "italic", color: "rgba(232,226,214,0.6)", lineHeight: 1.7 }}>fix state before strategy. check signal before reacting. inspect structure before optimizing. sequence before executing. audit language throughout. this is the order. it is not negotiable.</p>
            </div>
          </div>
        )}

      </div>

      <footer style={{ padding: "40px 32px", borderTop: "1px solid rgba(187,169,138,0.06)", marginTop: 60 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="mono" style={{ fontSize: 11, color: "rgba(187,169,138,0.25)", letterSpacing: 2 }}>4SL</div>
          <div className="mono" style={{ fontSize: 11, color: "rgba(187,169,138,0.15)" }}>state · signal · structure · sequence · language</div>
        </div>
      </footer>
    </div>
  );
}
