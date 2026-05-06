import React, { useState, useEffect, useMemo } from 'react'

// ============================================================
// 452b — THE OPERATOR'S DIAGNOSTIC
// Three themes. One framework. Style selector in top right.
// ============================================================

// ============================================================
// SHARED DATA
// ============================================================

const DIMS = [
  {
    key: 'state', roman: 'I', label: 'state', sub: 'the operator',
    blurb: 'the physiological and mental operating mode of the man in the chair.',
    long: 'state precedes strategy. a dysregulated operator makes dysregulated decisions. sleep, stress, energy, the calibration of the nervous system — these are not concerns of wellness. they are the foundation. nothing downstream of the operator works if the operator is compromised.',
    diagnostic: 'before you read the situation, read yourself.',
    examples: [
      'decisions degrade after the first input hits',
      'the body samples reality before language shows up',
      'fatigue is a structural signal, not a moral failing',
    ],
  },
  {
    key: 'signal', roman: 'II', label: 'signal', sub: 'the read',
    blurb: 'what the system is reading. real threat against corrupted noise.',
    long: 'most operating issues are signal problems disguised as strategy problems. the nervous system scans constantly for threat. when the threat detector miscalibrates, you spend the day reacting to ghosts. the work is separating real signal from corrupted signal before you act.',
    diagnostic: 'is this a real threat, or a story you have been told?',
    examples: [
      'most ceo crises are noise mistaken for threat',
      'the trigger is a scheduling decision, not a fact',
      'reaction without verification is identity rent',
    ],
  },
  {
    key: 'structure', roman: 'III', label: 'structure', sub: 'the architecture',
    blurb: 'internal scaffolding of identity, external architecture of the firm.',
    long: 'you cannot calibrate inside a false structure. patching drywall while the footing moves under load is not progress. structure is the org chart, the reporting lines, the decision rights — and also the internal beliefs the ceo carries about who they are and what they owe. both must be examined.',
    diagnostic: 'what is the architecture, and is it built for the work you are actually doing?',
    examples: [
      'every $40m company is run by a ceo with a $5m operating rhythm',
      'identity is rented, and rent always goes up',
      'agency fails when the structure lies',
    ],
  },
  {
    key: 'sequence', roman: 'IV', label: 'sequence', sub: 'the order',
    blurb: 'the order in which operations must occur.',
    long: 'state before strategy. signal before reaction. structure before optimization. most operators run the right plays in the wrong order. the issue is not what to do. it is when. resequence, and the same actions produce different outcomes.',
    diagnostic: 'are you running the right plays in the wrong order?',
    examples: [
      'meaning follows state, not the other way around',
      'release before the floor is tested causes re-collapse',
      'discharge internal tension last',
    ],
  },
  {
    key: 'language', roman: 'V', label: 'language', sub: 'the layer over all four',
    blurb: 'the layer that shapes the interpretation of all four.',
    long: 'language is not decoration. the story a ceo tells himself about what is happening determines what he sees, what he feels, and what he does next. words are tinder. narration belongs at the end of the picture. before that, language is a load-bearing wall in the system, and most of it invisible.',
    diagnostic: 'what story are you telling yourself, and does it help you move?',
    examples: [
      'rage is not human, it is structural',
      'use your name for the storm, use i for joy',
      'the voice-over belongs at the end of the movie',
    ],
  },
]

const QUESTIONS = [
  { dim: 'state', q: 'in the last 7 days, have you made a decision you would not have made if you had slept 7 hours the night before?',
    options: [{l:'no',s:10},{l:'yes, once',s:7},{l:'yes, more than once',s:4},{l:'i dont track this',s:3}] },
  { dim: 'state', q: 'when you wake up, your first physical sensation is closest to:',
    options: [{l:'alert and ready',s:10},{l:'foggy but functional',s:6},{l:'tense or wired',s:4},{l:'exhausted',s:2}] },
  { dim: 'signal', q: 'the last crisis you reacted to in the last 14 days. real threat to the business, or a story your nervous system told you was a threat?',
    options: [{l:'real threat',s:10},{l:'both',s:6},{l:'story',s:3},{l:'cannot separate them',s:2}] },
  { dim: 'signal', q: 'how often do you check email, slack, or messages in the first 30 minutes after waking?',
    options: [{l:'never',s:10},{l:'once',s:7},{l:'a few times',s:4},{l:'continuously',s:2}] },
  { dim: 'structure', q: 'if you were unreachable for 14 days starting tomorrow, how many of your top three problems would still get solved?',
    options: [{l:'all three',s:10},{l:'two',s:7},{l:'one',s:4},{l:'zero',s:2}] },
  { dim: 'structure', q: 'if asked separately, would your leadership team describe the company mission in the same words?',
    options: [{l:'yes, almost identically',s:10},{l:'close, with notable variations',s:6},{l:'no, different versions',s:3},{l:'i dont know',s:2}] },
  { dim: 'sequence', q: 'when something feels off in the business, your first move is usually to:',
    options: [{l:'check your own state',s:10},{l:'gather more data',s:7},{l:'call a meeting',s:4},{l:'start fixing',s:3}] },
  { dim: 'sequence', q: 'in the last quarter, how many major decisions did you make and then reverse within 30 days?',
    options: [{l:'zero',s:10},{l:'one',s:7},{l:'two',s:4},{l:'three or more',s:2}] },
  { dim: 'language', q: 'pick the sentence closest to where you are right now:',
    options: [
      {l:'the system is working but i am tired', s:5, tag:'state'},
      {l:'the numbers are fine but i am not', s:4, tag:'state'},
      {l:'i cannot tell what is signal anymore', s:3, tag:'signal'},
      {l:'i know what to do, i am just not doing it', s:4, tag:'sequence'},
      {l:'i do not know what the actual problem is', s:2, tag:'structure'},
    ]},
]

const READS = {
  state: 'your operator is the bottleneck. nothing downstream of you will improve until your state does. start here: protect the first 90 minutes of your day from input. the rest can be mapped in a 90-minute call.',
  signal: 'you are reacting to noise as if it were threat. the work is not more discipline. it is separating real signal from corrupted signal. the rest can be mapped in a 90-minute call.',
  structure: 'your architecture is fighting your mission. people, reporting lines, or decision rights are misaligned. the fix is not more effort. it is structural redesign. the rest can be mapped in a 90-minute call.',
  sequence: 'you are running the right plays in the wrong order. you do not need new plays. you need to resequence. the rest can be mapped in a 90-minute call.',
  language: 'the story you are telling yourself about what is happening is shaping what you see. until that story changes, the system cannot update. the rest can be mapped in a 90-minute call.',
}

const ARTICLES = [
  {dim:'state', title:'body first, mind second', blurb:'physiology before psychology. state is the foundation.'},
  {dim:'state', title:'unsteady on steady ground', blurb:'phantom load and residual roll in the operator system.'},
  {dim:'state', title:'nothing is burning, now what', blurb:'meaning follows state, not the other way around.'},
  {dim:'signal', title:'a trigger is a scheduling decision', blurb:'the body samples reality before language shows up.'},
  {dim:'signal', title:'the devil inside you', blurb:'how the nervous system mistakes a ghost for a guest.'},
  {dim:'signal', title:'precision as distraction', blurb:'when the metric becomes a symptom of misalignment.'},
  {dim:'structure', title:'agency fails when the structure lies', blurb:'you cannot calibrate inside a false architecture.'},
  {dim:'structure', title:'identity rent', blurb:'who you are without the wound is more you, not less.'},
  {dim:'structure', title:'why precision feels like failure', blurb:'patching drywall while the footing moves under load.'},
  {dim:'sequence', title:'exit arc flash', blurb:'the cost of releasing before the floor is tested.'},
  {dim:'sequence', title:'discharge internal tension last', blurb:'why the urgent move is usually the wrong move first.'},
  {dim:'sequence', title:'stop narrating your life', blurb:'the voice-over belongs at the end of the movie.'},
  {dim:'language', title:'why we rage', blurb:'rage is not human, it is structural.'},
  {dim:'language', title:'use your name for the storm', blurb:'use i for joy, distance not denial.'},
  {dim:'language', title:'words are tinder', blurb:'language is a load-bearing wall in the operating system.'},
]

const STUDIO_ITEMS = [
  {n:'I', cat:'CANON', title:'worn faded', body:'Muted neons. Analog grain. Dissolving silhouettes. Kintsugi cracks. Impressionistic only, never photorealistic. An aesthetic system: rules locked, outputs varied.'},
  {n:'II', cat:'COLLECTION', title:'soft gods', body:'Sixty-nine worn bears. One master. A trait system layered over a fixed identity — the ceo problem in plush form. Demonstrates the structure principle.'},
  {n:'III', cat:'CHARACTER', title:'paper hands herbert', body:'The down bad bear. Hope, loss, timing, humor, presence. A daily practice in five-word systems. Character bible locked: every output reflects the constitution.'},
  {n:'IV', cat:'OTHER', title:'sundry pursuits', body:'Beekeeper. Brewer. Martial artist. Comic collector. Weather Alpha trading systems. A father-son app called Dingus HQ. The framework lives across surfaces.'},
]

const CREDS = [
  ['IFS', '$28m → $114m revenue · 13 years scaling a manufacturing concern'],
  ['Institutional', '$250m managed · SAC Capital'],
  ['CFA', 'Chartered Financial Analyst'],
  ['Columbia', 'MBA · Columbia Business School'],
  ['Duke', 'Undergraduate · Duke University'],
  ['452b', 'Managing Partner'],
  ['Writing', '50+ essays, public, on operating under load'],
]

// ============================================================
// SHARED LOGIC: scoring
// ============================================================

function useScores(answers) {
  return useMemo(() => {
    const out = {state: [], signal: [], structure: [], sequence: [], language: []}
    QUESTIONS.forEach((q, i) => {
      if (answers[i] !== undefined) out[q.dim].push(answers[i].score)
    })
    const result = {}
    Object.keys(out).forEach(k => {
      result[k] = out[k].length ? out[k].reduce((a,b) => a+b, 0) / out[k].length : 0
    })
    const q9 = answers[8]
    if (q9 && q9.tag) result[q9.tag] = (result[q9.tag] + q9.score) / 2
    return result
  }, [answers])
}

function useLowest(scores) {
  return useMemo(() => {
    const entries = Object.entries(scores)
    if (entries.every(([_, v]) => v === 0)) return null
    return entries.reduce((min, cur) => cur[1] < min[1] ? cur : min)[0]
  }, [scores])
}

// ============================================================
// THEME SELECTOR
// ============================================================

const ThemeSelector = ({theme, setTheme}) => (
  <div style={{
    position: 'fixed', top: 16, right: 16, zIndex: 1000,
    background: 'rgba(20,20,20,0.92)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '6px',
    display: 'flex', gap: 4,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10, letterSpacing: '0.15em',
    borderRadius: 2,
  }}>
    {[
      {k:'broadsheet', l:'1890'},
      {k:'terminal', l:'1985'},
      {k:'editorial', l:'2026'},
    ].map(t => (
      <button key={t.k} onClick={() => setTheme(t.k)} style={{
        padding:'8px 12px',
        background: theme === t.k ? '#fff' : 'transparent',
        color: theme === t.k ? '#000' : '#aaa',
        border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit',
        textTransform: 'uppercase',
      }}>
        {t.l}
      </button>
    ))}
  </div>
)

// ╔══════════════════════════════════════════════════════════╗
// ║                  THEME 1: BROADSHEET                     ║
// ║              1890s, refined, Playfair + Cormorant        ║
// ╚══════════════════════════════════════════════════════════╝

const B = {
  paper: '#f4ede0',
  paperShadow: '#e6dec9',
  ink: '#1a1614',
  inkSoft: '#3d3631',
  inkFaint: '#7a6e62',
  rule: '#1a1614',
  red: '#7a1f12',
  ruleFaint: 'rgba(26,22,20,0.18)',
}
const BF = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Cormorant Garamond', Georgia, serif",
  smallcaps: "'Playfair Display', serif",
}

const BroadsheetApp = ({active, setActive}) => {
  const [diagStep, setDiagStep] = useState(0)
  const [diagAnswers, setDiagAnswers] = useState({})
  const [fwActive, setFwActive] = useState('state')
  const [writingFilter, setWritingFilter] = useState('all')

  return (
    <div style={{minHeight: '100vh', background: B.paper, color: B.ink, fontFamily: BF.body}}>
      <style>{`::selection { background: ${B.ink}; color: ${B.paper}; }`}</style>
      <BroadsheetMasthead active={active} setActive={setActive} />
      {active === 'home' && <BroadsheetHome setActive={setActive} />}
      {active === '4sl' && <BroadsheetFramework fwActive={fwActive} setFwActive={setFwActive} />}
      {active === 'diagnostic' && <BroadsheetDiagnostic step={diagStep} setStep={setDiagStep} answers={diagAnswers} setAnswers={setDiagAnswers} setActive={setActive} />}
      {active === 'writing' && <BroadsheetWriting filter={writingFilter} setFilter={setWritingFilter} />}
      {active === 'studio' && <BroadsheetStudio />}
      {active === 'about' && <BroadsheetAbout setActive={setActive} />}
      <BroadsheetFooter />
    </div>
  )
}

const BSection = ({children, narrow, style}) => (
  <section style={{padding: '64px 0', ...style}}>
    <div style={{maxWidth: narrow ? 680 : 920, margin: '0 auto', padding: '0 32px'}}>{children}</div>
  </section>
)
const BRule = ({type='single', style}) => {
  const styles = {
    single: { borderTop: `1px solid ${B.rule}` },
    double: { borderTop: `1px solid ${B.rule}`, borderBottom: `1px solid ${B.rule}`, height: 4 },
    triple: { borderTop: `3px double ${B.rule}` },
    thin: { borderTop: `1px solid ${B.ruleFaint}` },
  }
  return <div style={{...styles[type], width:'100%', ...style}} />
}
const BOrnament = ({style}) => (
  <div style={{textAlign:'center', fontSize: 14, color: B.inkFaint, letterSpacing:'0.5em', margin:'8px 0', ...style}}>
    ⁂
  </div>
)
const BSC = ({children, style, color, ...rest}) => (
  <span style={{
    fontFamily: BF.display, fontWeight: 500, fontSize: 11,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: color || B.ink, ...style,
  }} {...rest}>{children}</span>
)

const BroadsheetMasthead = ({active, setActive}) => (
  <header style={{borderBottom: `3px double ${B.rule}`, paddingTop: 28, paddingBottom: 16, background: B.paper}}>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
        fontFamily: BF.display, fontSize: 10, letterSpacing:'0.25em', color: B.inkFaint, marginBottom: 10, textTransform:'uppercase'}}>
        <span>Vol. I · No. 1</span>
        <span>Anno MMXXVI</span>
        <span>Operator's Use</span>
      </div>
      <BRule type="single" style={{marginBottom: 14}} />
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily: BF.display, fontSize: 11, letterSpacing:'0.55em', color: B.inkFaint, marginBottom: 6, textTransform:'uppercase'}}>
          Four-Fifty-Two-B
        </div>
        <button onClick={() => setActive('home')} style={{
          background:'none', border:'none', cursor:'pointer', padding:0,
          fontFamily: BF.display, fontSize: 'clamp(56px, 9vw, 96px)', fontWeight: 500,
          color: B.ink, letterSpacing:'-0.02em', lineHeight: 1, fontStyle:'italic',
        }}>
          452b
        </button>
        <div style={{fontFamily: BF.display, fontSize: 12, letterSpacing:'0.35em', color: B.ink, marginTop: 10, marginBottom: 6, textTransform:'uppercase', fontWeight: 500}}>
          The Operator's Diagnostic
        </div>
        <div style={{fontSize: 14, fontStyle:'italic', color: B.inkSoft}}>
          a system for the man in the chair
        </div>
      </div>
      <BRule type="double" style={{marginTop: 18, marginBottom: 14}} />
      <nav style={{display:'flex', justifyContent:'center', gap: 32, flexWrap:'wrap'}}>
        {[
          {k:'home', l:'masthead'},
          {k:'4sl', l:'the framework'},
          {k:'diagnostic', l:'diagnostic'},
          {k:'writing', l:'dispatches'},
          {k:'studio', l:'studio'},
          {k:'about', l:'colophon'},
        ].map(item => (
          <button key={item.k} onClick={() => setActive(item.k)} style={{
            background:'none', border:'none', cursor:'pointer', padding:'4px 0',
            fontFamily: BF.display, fontSize: 11, letterSpacing:'0.22em', fontWeight: 500,
            color: active === item.k ? B.red : B.ink,
            borderBottom: active === item.k ? `1px solid ${B.red}` : '1px solid transparent',
            textTransform:'uppercase',
          }}>
            {item.l}
          </button>
        ))}
      </nav>
    </div>
  </header>
)

const BroadsheetHome = ({setActive}) => (
  <>
    <BSection style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center'}}>
        <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', marginBottom: 28, display:'block'}}>⁂  A New Practice  ⁂</BSC>
        <h1 style={{
          fontFamily: BF.display, fontSize: 'clamp(44px, 6.5vw, 80px)',
          fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.015em',
          color: B.ink, marginBottom: 24,
        }}>
          most advisors begin<br/>
          with strategy.<br/>
          <span style={{fontStyle:'italic', fontWeight: 400}}>we begin with</span><br/>
          <span style={{fontStyle:'italic', fontWeight: 400}}>the operator.</span>
        </h1>
        <BOrnament />
        <div style={{fontSize: 22, fontStyle:'italic', lineHeight: 1.5, color: B.inkSoft, maxWidth: 600, margin:'24px auto 0'}}>
          every company is a reflection of the man running it. fix the man, the rest grows clearer.
        </div>
      </div>
    </BSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple" style={{margin:'0'}}/></div>

    <BSection>
      <div style={{textAlign:'center', marginBottom: 40}}>
        <BSC color={B.inkFaint} style={{fontSize: 11}}>Being a Notice to Prospective Clients</BSC>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 48, fontSize: 18, lineHeight: 1.6, color: B.ink}}>
        <div className="drop-cap-broadsheet">
          We are 452b. We run a CEO advisory practice called 4sl — pronounced four-S-L — being a diagnostic system of four parts: <i>state</i>, <i>signal</i>, <i>structure</i>, <i>sequence</i>. A fifth dimension, <i>language</i>, is the layer that shapes how all four are interpreted. The framework was not invented in a classroom. It was extracted from twenty years of operating under load.
        </div>
        <div>
          <p style={{marginBottom: 16}}>
            We do not coach. We diagnose. The operator's room is full of advisors who confuse strategy with state. Most CEO problems are not strategic — they are physiological, structural, or sequenced poorly. Our work is to find which.
          </p>
          <p>
            The entry point is a <i>90-minute diagnostic</i> and a <i>five-page written read</i>, delivered within forty-eight hours. If the read lands, we proceed quarterly. If it does not, you owe us nothing further.
          </p>
        </div>
      </div>
    </BSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="double" style={{margin:'0'}}/></div>

    <BSection>
      <div style={{textAlign:'center', marginBottom: 40}}>
        <BSC color={B.inkFaint} style={{fontSize: 12, display:'block', marginBottom: 8}}>Article I.</BSC>
        <h2 style={{fontFamily: BF.display, fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.1}}>
          The Framework, in Four Parts
        </h2>
        <BOrnament style={{marginTop: 16}}/>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 0, border:`1px solid ${B.rule}`}}>
        {DIMS.slice(0, 4).map((d, i) => (
          <button key={d.key} onClick={() => setActive('4sl')} style={{
            padding: 32, textAlign:'left', cursor:'pointer',
            background: B.paper, border: 'none',
            borderRight: i % 2 === 0 ? `1px solid ${B.rule}` : 'none',
            borderBottom: i < 2 ? `1px solid ${B.rule}` : 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = B.paperShadow}
          onMouseLeave={e => e.currentTarget.style.background = B.paper}>
            <div style={{display:'flex', alignItems:'baseline', gap: 16, marginBottom: 12}}>
              <BSC color={B.red} style={{fontSize: 14}}>{d.roman}.</BSC>
              <span style={{fontFamily: BF.display, fontSize: 30, fontStyle:'italic', color: B.ink, fontWeight: 500}}>{d.label}</span>
            </div>
            <BSC color={B.inkFaint} style={{fontSize: 10, display:'block', marginBottom: 14}}>—— {d.sub} ——</BSC>
            <div style={{fontSize: 16, lineHeight: 1.5, color: B.inkSoft, fontStyle:'italic'}}>
              {d.blurb}
            </div>
          </button>
        ))}
      </div>
      <div style={{
        marginTop: 24, padding: '20px 32px',
        textAlign: 'center', fontSize: 18, fontStyle:'italic', color: B.ink,
        borderTop: `1px solid ${B.rule}`, borderBottom: `1px solid ${B.rule}`,
      }}>
        & a fifth dimension — <BSC color={B.red} style={{fontStyle:'normal', fontSize: 13}}>Language</BSC> — being the layer that shapes how all four are interpreted.
      </div>
    </BSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple" style={{margin:'0'}}/></div>

    <BSection>
      <div style={{textAlign:'center', marginBottom: 40}}>
        <BSC color={B.inkFaint} style={{fontSize: 12, display:'block', marginBottom: 8}}>Article II.</BSC>
        <h2 style={{fontFamily: BF.display, fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.1}}>
          Of the Engagement.
        </h2>
        <BOrnament style={{marginTop: 16}}/>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border: `1px solid ${B.rule}`, background: B.paper}}>
        <div style={{padding: 36, borderRight: `1px solid ${B.rule}`}}>
          <div style={{textAlign:'center', marginBottom: 20}}>
            <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 12}}>—— Door the First ——</BSC>
            <div style={{fontFamily: BF.display, fontSize: 36, fontStyle:'italic', color: B.ink, lineHeight: 1.05, fontWeight: 500}}>
              The Operator's Read
            </div>
            <div style={{fontFamily: BF.display, fontSize: 12, color: B.inkFaint, marginTop: 12, letterSpacing:'0.22em', textTransform:'uppercase', fontWeight: 500}}>
              Five Thousand Dollars · One Session
            </div>
          </div>
          <BRule type="thin" style={{marginBottom: 20}}/>
          <div style={{fontSize: 16, lineHeight: 1.6, color: B.inkSoft, marginBottom: 16}}>
            A <i>ninety-minute diagnostic</i> conducted by O.G. Jones, followed by a five-page written read delivered within forty-eight hours. The dimension that is broken, the sequence to fix it, the next thirty days.
          </div>
          <div style={{fontSize: 14, fontStyle:'italic', color: B.inkFaint, lineHeight: 1.6}}>
            No further commitment. No upsell. Should the read prove useful, you may return.
          </div>
        </div>
        <div style={{padding: 36, position:'relative'}}>
          <div style={{position:'absolute', top:-1, left:0, right:0, borderTop: `2px solid ${B.red}`}} />
          <div style={{textAlign:'center', marginBottom: 20}}>
            <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 12}}>—— Door the Second ——</BSC>
            <div style={{fontFamily: BF.display, fontSize: 36, fontStyle:'italic', color: B.ink, lineHeight: 1.05, fontWeight: 500}}>
              The Quarterly
            </div>
            <div style={{fontFamily: BF.display, fontSize: 12, color: B.inkFaint, marginTop: 12, letterSpacing:'0.22em', textTransform:'uppercase', fontWeight: 500}}>
              Thirty Thousand Per Quarter · Renewable
            </div>
          </div>
          <BRule type="thin" style={{marginBottom: 20}}/>
          <div style={{fontSize: 16, lineHeight: 1.6, color: B.inkSoft, marginBottom: 16}}>
            <i>Twelve weeks of full engagement.</i> Bi-weekly deep sessions. Weekly check-ins with our partner. Access to our diagnostic system. Quarterly recalibration of the framework against your actual conditions.
          </div>
          <div style={{fontSize: 14, fontStyle:'italic', color: B.inkFaint, lineHeight: 1.6}}>
            For operators ready to upgrade the entire system.
          </div>
        </div>
      </div>
      <div style={{textAlign:'center', marginTop: 40}}>
        <button onClick={() => setActive('diagnostic')} style={{
          fontFamily: BF.display, fontSize: 13, letterSpacing:'0.25em',
          color: B.paper, background: B.ink,
          border: `1px solid ${B.ink}`,
          padding:'14px 32px', cursor:'pointer',
          textTransform: 'uppercase', fontWeight: 500,
        }}>
          Begin the Diagnostic
        </button>
        <div style={{fontFamily: BF.display, fontSize: 10, color: B.inkFaint, marginTop: 12, letterSpacing:'0.3em', textTransform:'uppercase'}}>
          or read on
        </div>
      </div>
    </BSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple" style={{margin:'0'}}/></div>

    <BSection narrow>
      <div style={{textAlign:'center', marginBottom: 32}}>
        <BSC color={B.inkFaint} style={{fontSize: 12, display:'block', marginBottom: 8}}>Article III.</BSC>
        <h2 style={{fontFamily: BF.display, fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.1}}>
          Of the Practitioner.
        </h2>
        <BOrnament style={{marginTop: 16}}/>
      </div>
      <div className="drop-cap-broadsheet" style={{fontSize: 18, lineHeight: 1.7, color: B.ink, marginBottom: 24}}>
        We've been the people in the chair. Thirteen years scaling a manufacturing concern from $28m to $114m in revenue. Two hundred and fifty million managed institutionally. CFA charter. Columbia MBA. Duke. We did not study this work. We lived it. Then we lost a great deal, recovered, and rebuilt — and along the way, we wrote about every step.
      </div>
      <div style={{fontSize: 18, lineHeight: 1.7, color: B.inkSoft, fontStyle:'italic', textAlign:'center', marginTop: 32}}>
        Most CEO advisory is built by people who studied frameworks.<br/>
        Ours is built from the floor of an operating company under real load.
      </div>
      <div style={{textAlign:'center', marginTop: 32}}>
        <button onClick={() => setActive('about')} style={{
          background:'none', border:'none', padding:0, cursor:'pointer',
          fontFamily: BF.display, fontSize: 11, letterSpacing:'0.25em', color: B.red,
          borderBottom: `1px solid ${B.red}`, paddingBottom: 2, textTransform:'uppercase', fontWeight: 500,
        }}>
          The Full Colophon →
        </button>
      </div>
    </BSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple" style={{margin:'0'}}/></div>

    <BSection style={{paddingBottom: 80}}>
      <div style={{textAlign:'center', marginBottom: 40}}>
        <BSC color={B.inkFaint} style={{fontSize: 12, display:'block', marginBottom: 8}}>Article IV.</BSC>
        <h2 style={{fontFamily: BF.display, fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.1}}>
          Further Evidences.
        </h2>
        <BOrnament style={{marginTop: 16}}/>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border: `1px solid ${B.rule}`}}>
        <button onClick={() => setActive('writing')} style={{
          padding: 32, textAlign:'left', cursor:'pointer',
          background: B.paper, border: 'none', borderRight: `1px solid ${B.rule}`, transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = B.paperShadow}
        onMouseLeave={e => e.currentTarget.style.background = B.paper}>
          <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 12}}>Dispatches</BSC>
          <div style={{fontFamily: BF.display, fontSize: 28, fontStyle:'italic', color: B.ink, marginBottom: 12, lineHeight: 1.1, fontWeight: 500}}>
            Fifty essays on operating under load
          </div>
          <div style={{fontSize: 15, fontStyle:'italic', color: B.inkSoft, lineHeight: 1.5}}>
            The framework came from these. Each piece maps to a dimension. Read what you need.
          </div>
          <div style={{marginTop: 24, fontFamily: BF.display, fontSize: 11, color: B.inkFaint, letterSpacing:'0.22em', textTransform:'uppercase', fontWeight: 500}}>
            Read →
          </div>
        </button>
        <button onClick={() => setActive('studio')} style={{
          padding: 32, textAlign:'left', cursor:'pointer',
          background: B.paper, border: 'none', transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = B.paperShadow}
        onMouseLeave={e => e.currentTarget.style.background = B.paper}>
          <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 12}}>Studio</BSC>
          <div style={{fontFamily: BF.display, fontSize: 28, fontStyle:'italic', color: B.ink, marginBottom: 12, lineHeight: 1.1, fontWeight: 500}}>
            Worn faded, soft gods, & sundry
          </div>
          <div style={{fontSize: 15, fontStyle:'italic', color: B.inkSoft, lineHeight: 1.5}}>
            Art, characters, instruments, systems. The same operating principles in a different medium.
          </div>
          <div style={{marginTop: 24, fontFamily: BF.display, fontSize: 11, color: B.inkFaint, letterSpacing:'0.22em', textTransform:'uppercase', fontWeight: 500}}>
            See →
          </div>
        </button>
      </div>
    </BSection>
  </>
)

const BroadsheetFramework = ({fwActive, setFwActive}) => {
  const dim = DIMS.find(d => d.key === fwActive)
  return (
    <>
      <BSection style={{paddingTop: 60, paddingBottom: 40}}>
        <div style={{textAlign:'center'}}>
          <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', marginBottom: 16, display:'block'}}>⁂  The Framework, Expounded  ⁂</BSC>
          <h1 style={{fontFamily: BF.display, fontSize: 'clamp(56px, 9vw, 120px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 0.95, marginBottom: 16, letterSpacing:'-0.02em'}}>
            4sl
          </h1>
          <BOrnament />
          <div style={{fontSize: 22, fontStyle:'italic', color: B.inkSoft, marginTop: 16, lineHeight: 1.5}}>
            <span style={{color: B.ink}}>state</span> · <span style={{color: B.ink}}>signal</span> · <span style={{color: B.ink}}>structure</span> · <span style={{color: B.ink}}>sequence</span>
            <br/>
            <span style={{fontSize: 16, color: B.inkFaint}}>and language as the layer that shapes how all four are interpreted</span>
          </div>
        </div>
      </BSection>
      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple"/></div>
      <BSection style={{paddingTop: 60}}>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap: 64}}>
          <div style={{position:'sticky', top: 100, alignSelf:'start'}}>
            <BSC color={B.inkFaint} style={{fontSize: 11, display:'block', marginBottom: 16}}>—— Index ——</BSC>
            <div style={{display:'flex', flexDirection:'column'}}>
              {DIMS.map((d, i) => (
                <button key={d.key} onClick={() => setFwActive(d.key)} style={{
                  background:'none', border:'none', textAlign:'left', padding:'10px 0', cursor:'pointer',
                  borderTop: i === 0 ? `1px solid ${B.rule}` : 'none',
                  borderBottom: `1px solid ${fwActive === d.key ? B.rule : B.ruleFaint}`,
                  display:'flex', alignItems:'baseline', gap: 12,
                }}>
                  <BSC color={fwActive === d.key ? B.red : B.inkFaint} style={{fontSize: 11, width: 24}}>{d.roman}.</BSC>
                  <span style={{fontFamily: BF.display, fontSize: 20, fontStyle:'italic', color: fwActive === d.key ? B.red : B.ink, fontWeight: 500}}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 16, letterSpacing:'0.3em'}}>{dim.roman}. — {dim.sub}</BSC>
            <h2 style={{fontFamily: BF.display, fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1, marginBottom: 24, letterSpacing:'-0.02em'}}>
              {dim.label}.
            </h2>
            <BRule style={{marginBottom: 32}}/>
            <div className="drop-cap-broadsheet" style={{fontSize: 18, lineHeight: 1.7, color: B.ink, marginBottom: 32}}>
              {dim.long}
            </div>
            <BRule type="double" style={{marginBottom: 32}}/>
            <BSC color={B.inkFaint} style={{fontSize: 11, display:'block', marginBottom: 12}}>—— The Diagnostic Question ——</BSC>
            <div style={{fontSize: 22, fontStyle:'italic', color: B.red, marginBottom: 40, lineHeight: 1.4, textAlign:'center', padding:'24px 16px', borderTop: `1px solid ${B.rule}`, borderBottom: `1px solid ${B.rule}`}}>
              ❝ {dim.diagnostic} ❞
            </div>
            <BSC color={B.inkFaint} style={{fontSize: 11, display:'block', marginBottom: 16}}>—— Operating Principles ——</BSC>
            <ol style={{listStyle:'none', padding: 0, margin: 0}}>
              {dim.examples.map((ex, i) => (
                <li key={i} style={{display:'flex', gap: 20, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${B.ruleFaint}`}}>
                  <BSC color={B.red} style={{fontSize: 13, flexShrink: 0, paddingTop: 4}}>{String.fromCharCode(945 + i)}.</BSC>
                  <div style={{fontSize: 18, fontStyle:'italic', color: B.ink, lineHeight: 1.5}}>
                    {ex}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </BSection>
      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple"/></div>
      <BSection narrow style={{paddingBottom: 80}}>
        <div style={{textAlign:'center', marginBottom: 32}}>
          <BSC color={B.inkFaint} style={{fontSize: 12, display:'block', marginBottom: 12}}>—— The Operating Rule ——</BSC>
        </div>
        <div style={{fontSize: 22, lineHeight: 1.7, color: B.ink, textAlign:'center', fontStyle:'italic', padding:'32px 0', borderTop: `3px double ${B.rule}`, borderBottom: `3px double ${B.rule}`}}>
          Read state first.<br/>
          Check signal before reacting.<br/>
          Inspect structure before optimizing.<br/>
          Sequence before executing.<br/>
          <span style={{color: B.red}}>Audit language throughout.</span>
        </div>
      </BSection>
    </>
  )
}

const BroadsheetDiagnostic = ({step, setStep, answers, setAnswers, setActive}) => {
  const scores = useScores(answers)
  const lowest = useLowest(scores)

  const handleAnswer = (qIdx, score, tag) => {
    setAnswers(prev => ({...prev, [qIdx]: {score, tag}}))
    setTimeout(() => setStep(s => s + 1), 200)
  }

  if (step === 0) {
    return (
      <BSection narrow style={{paddingTop: 80, paddingBottom: 120, textAlign:'center'}}>
        <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', display:'block', marginBottom: 16}}>⁂  The Diagnostic  ⁂</BSC>
        <h1 style={{fontFamily: BF.display, fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.05, letterSpacing:'-0.015em', marginBottom: 24}}>
          nine questions.<br/>two minutes.<br/>a real read.
        </h1>
        <BOrnament />
        <div style={{fontSize: 18, lineHeight: 1.65, color: B.inkSoft, fontStyle:'italic', maxWidth: 540, margin:'24px auto 32px'}}>
          This is not a survey. Each question is designed to surface where your operating issue actually sits. You will receive a five-axis read at the end with the dimension that is most broken and what to do about it.
        </div>
        <div style={{fontSize: 16, color: B.inkFaint, marginBottom: 40}}>
          Should the read prove useful, the next step is a full Operator Read — $5,000.
        </div>
        <button onClick={() => setStep(1)} style={{
          fontFamily: BF.display, fontSize: 13, letterSpacing:'0.25em',
          color: B.paper, background: B.ink, border: `1px solid ${B.ink}`,
          padding:'14px 32px', cursor:'pointer', textTransform: 'uppercase', fontWeight: 500,
        }}>
          Begin
        </button>
      </BSection>
    )
  }

  if (step >= 1 && step <= 9) {
    const qIdx = step - 1
    const q = QUESTIONS[qIdx]
    const selected = answers[qIdx]?.score
    return (
      <BSection narrow style={{paddingTop: 60, paddingBottom: 100}}>
        <div style={{marginBottom: 40}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8}}>
            <BSC color={B.red} style={{fontSize: 11}}>Question {String(step).padStart(2,'0')} / 09</BSC>
            <BSC color={B.inkFaint} style={{fontSize: 11}}>{q.dim}</BSC>
          </div>
          <div style={{height: 1, background: B.ruleFaint, position:'relative'}}>
            <div style={{height: 1, background: B.ink, width: `${(step / 9) * 100}%`, transition:'width 0.3s'}}/>
          </div>
        </div>
        <h2 style={{fontFamily: BF.display, fontSize: 'clamp(26px, 3.6vw, 36px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.25, marginBottom: 40, letterSpacing:'-0.01em'}}>
          {q.q}
        </h2>
        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(qIdx, opt.s, opt.tag)} style={{
              padding:'18px 24px', textAlign:'left',
              background: selected === opt.s ? B.paperShadow : 'transparent',
              border: `1px solid ${selected === opt.s ? B.ink : B.ruleFaint}`,
              cursor:'pointer', transition:'all 0.15s',
              fontFamily: BF.body, fontSize: 18, color: B.ink,
              display:'flex', alignItems:'baseline', gap: 16,
            }}
            onMouseEnter={e => { if (selected !== opt.s) e.currentTarget.style.borderColor = B.rule }}
            onMouseLeave={e => { if (selected !== opt.s) e.currentTarget.style.borderColor = B.ruleFaint }}>
              <BSC color={B.inkFaint} style={{fontSize: 11, flexShrink: 0}}>{String.fromCharCode(97 + i)}.</BSC>
              <span style={{fontStyle:'italic'}}>{opt.l}</span>
            </button>
          ))}
        </div>
        {step > 1 && (
          <div style={{marginTop: 40}}>
            <button onClick={() => setStep(s => s - 1)} style={{
              background:'none', border:'none', cursor:'pointer', padding: 0,
              fontFamily: BF.display, fontSize: 11, letterSpacing:'0.22em', color: B.inkFaint, textTransform:'uppercase',
            }}>
              ← back
            </button>
          </div>
        )}
      </BSection>
    )
  }

  // Results
  return (
    <BSection style={{paddingTop: 60, paddingBottom: 100}}>
      <div style={{textAlign:'center', marginBottom: 40}}>
        <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', display:'block', marginBottom: 16}}>⁂  Your Read  ⁂</BSC>
        <h1 style={{fontFamily: BF.display, fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1, letterSpacing:'-0.015em'}}>
          primary issue:<br/>
          <span style={{color: B.red}}>{lowest}</span>
        </h1>
        <BOrnament />
      </div>
      <div style={{maxWidth: 600, margin:'0 auto', marginBottom: 48}}>
        <BSC color={B.inkFaint} style={{fontSize: 11, display:'block', marginBottom: 20, textAlign:'center'}}>—— Five-Axis Read ——</BSC>
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          {Object.entries(scores).map(([dim, score]) => (
            <div key={dim}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6}}>
                <span style={{fontFamily: BF.display, fontSize: 18, fontStyle:'italic', color: dim === lowest ? B.red : B.ink, fontWeight: 500}}>{dim}</span>
                <BSC color={dim === lowest ? B.red : B.inkFaint}>{score.toFixed(1)} / 10</BSC>
              </div>
              <div style={{height: 4, background: B.ruleFaint}}>
                <div style={{height: 4, background: dim === lowest ? B.red : B.ink, width: `${(score/10)*100}%`, transition:'width 0.6s'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{maxWidth: 640, margin:'0 auto', padding:'32px 36px', borderLeft: `2px solid ${B.red}`, background: B.paperShadow, marginBottom: 40}}>
        <BSC color={B.red} style={{fontSize: 11, display:'block', marginBottom: 12}}>—— The Read ——</BSC>
        <div style={{fontSize: 20, lineHeight: 1.55, color: B.ink, fontStyle:'italic'}}>
          {READS[lowest]}
        </div>
      </div>
      <div style={{textAlign:'center'}}>
        <a href="mailto:og@452b.io?subject=the operator read" style={{
          fontFamily: BF.display, fontSize: 13, letterSpacing:'0.25em',
          color: B.paper, background: B.ink, border: `1px solid ${B.ink}`,
          padding:'14px 32px', cursor:'pointer', textTransform: 'uppercase', fontWeight: 500,
          textDecoration:'none', display:'inline-block', marginRight: 16,
        }}>
          Book the Operator Read · $5,000
        </a>
        <button onClick={() => { setStep(0); setAnswers({}) }} style={{
          fontFamily: BF.display, fontSize: 13, letterSpacing:'0.25em',
          color: B.ink, background:'transparent', border: `1px solid ${B.ink}`,
          padding:'14px 32px', cursor:'pointer', textTransform: 'uppercase', fontWeight: 500,
        }}>
          Retake
        </button>
      </div>
      <div style={{textAlign:'center', marginTop: 32, fontSize: 14, color: B.inkFaint, fontStyle:'italic'}}>
        This read is yours. Use it however you want. If it landed, you know where to find us.
      </div>
    </BSection>
  )
}

const BroadsheetWriting = ({filter, setFilter}) => {
  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.dim === filter)
  return (
    <>
      <BSection style={{paddingTop: 60, paddingBottom: 40}}>
        <div style={{textAlign:'center'}}>
          <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', display:'block', marginBottom: 16}}>⁂  Dispatches  ⁂</BSC>
          <h1 style={{fontFamily: BF.display, fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.05, letterSpacing:'-0.01em'}}>
            the framework<br/>came from these.
          </h1>
          <BOrnament />
          <div style={{fontSize: 18, fontStyle:'italic', color: B.inkSoft, maxWidth: 540, margin:'24px auto 0', lineHeight: 1.6}}>
            Fifty essays on operating under load. Each maps to a dimension of the framework. Read what you need.
          </div>
        </div>
      </BSection>
      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="double"/></div>
      <BSection style={{paddingTop: 40}}>
        <div style={{display:'flex', gap: 8, marginBottom: 32, flexWrap:'wrap', justifyContent:'center'}}>
          {['all', 'state', 'signal', 'structure', 'sequence', 'language'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 16px',
              background: filter === f ? B.ink : 'transparent',
              color: filter === f ? B.paper : B.ink,
              border: `1px solid ${B.rule}`,
              fontFamily: BF.display, fontSize: 11, letterSpacing:'0.22em',
              cursor:'pointer', textTransform:'uppercase', fontWeight: 500,
            }}>
              {f}
            </button>
          ))}
        </div>
        <div>
          {filtered.map((a, i) => (
            <article key={i} style={{
              padding:'22px 0', borderBottom: `1px solid ${B.rule}`,
              display:'grid', gridTemplateColumns:'120px 1fr 80px', gap: 24, alignItems:'baseline', cursor:'pointer',
            }}>
              <BSC color={B.red} style={{fontSize: 11}}>{a.dim}</BSC>
              <div>
                <div style={{fontFamily: BF.display, fontSize: 24, fontStyle:'italic', color: B.ink, lineHeight: 1.15, marginBottom: 6, fontWeight: 500}}>
                  {a.title}
                </div>
                <div style={{fontSize: 15, color: B.inkSoft, lineHeight: 1.5, fontStyle:'italic'}}>{a.blurb}</div>
              </div>
              <BSC color={B.inkFaint} style={{fontSize: 10, textAlign:'right'}}>№.{String(i+1).padStart(2,'0')}</BSC>
            </article>
          ))}
        </div>
        <div style={{marginTop: 48, textAlign:'center'}}>
          <a href="https://www.linkedin.com/in/ogjones" style={{color: B.red, fontFamily: BF.display, fontSize: 11, letterSpacing:'0.22em', textDecoration:'none', borderBottom: `1px solid ${B.red}`, paddingBottom: 2, textTransform:'uppercase', fontWeight: 500}}>
            Full Archive on LinkedIn →
          </a>
        </div>
      </BSection>
    </>
  )
}

const BroadsheetStudio = () => (
  <>
    <BSection style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center'}}>
        <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', display:'block', marginBottom: 16}}>⁂  Studio  ⁂</BSC>
        <h1 style={{fontFamily: BF.display, fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.05, letterSpacing:'-0.01em'}}>
          the same principles,<br/>a different medium.
        </h1>
        <BOrnament />
        <div style={{fontSize: 18, fontStyle:'italic', color: B.inkSoft, maxWidth: 540, margin:'24px auto 0', lineHeight: 1.6}}>
          We make things. Art, characters, instruments. The framework holds because we live it across surfaces.
        </div>
      </div>
    </BSection>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="double"/></div>
    <BSection style={{paddingTop: 40, paddingBottom: 80}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 0, border:`1px solid ${B.rule}`}}>
        {STUDIO_ITEMS.map((s, i) => (
          <div key={i} style={{
            padding: 32,
            borderRight: i % 2 === 0 ? `1px solid ${B.rule}` : 'none',
            borderBottom: i < 2 ? `1px solid ${B.rule}` : 'none',
          }}>
            <div style={{display:'flex', alignItems:'baseline', gap: 16, marginBottom: 12}}>
              <BSC color={B.red} style={{fontSize: 12}}>{s.n}.</BSC>
              <BSC color={B.inkFaint} style={{fontSize: 10}}>—— {s.cat} ——</BSC>
            </div>
            <div style={{fontFamily: BF.display, fontSize: 28, fontStyle:'italic', color: B.ink, marginBottom: 12, lineHeight: 1.05, fontWeight: 500}}>
              {s.title}
            </div>
            <div style={{fontSize: 15, lineHeight: 1.6, color: B.inkSoft}}>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </BSection>
  </>
)

const BroadsheetAbout = ({setActive}) => (
  <>
    <BSection style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center'}}>
        <BSC color={B.red} style={{fontSize: 11, letterSpacing:'0.4em', display:'block', marginBottom: 16}}>⁂  Colophon  ⁂</BSC>
        <h1 style={{fontFamily: BF.display, fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.05, letterSpacing:'-0.01em'}}>
          452b is built<br/>by operators.
        </h1>
        <BOrnament />
        <div style={{fontSize: 18, fontStyle:'italic', color: B.inkSoft, maxWidth: 580, margin:'24px auto 0', lineHeight: 1.6}}>
          The practice is led by O.G. Jones. The framework comes from the ground — companies actually scaled, money actually managed, decisions actually made under real load.
        </div>
      </div>
    </BSection>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="double"/></div>
    <BSection style={{paddingTop: 40}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 64}}>
        <div>
          <BSC color={B.red} style={{fontSize: 12, display:'block', marginBottom: 24}}>—— Credentials ——</BSC>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <tbody>
              {CREDS.map(([k, v]) => (
                <tr key={k} style={{borderBottom: `1px solid ${B.rule}`}}>
                  <td style={{padding:'12px 16px 12px 0', verticalAlign:'top', fontFamily: BF.display, fontSize: 11, color: B.red, letterSpacing:'0.22em', width: 130, fontWeight: 500, textTransform:'uppercase'}}>{k}</td>
                  <td style={{padding:'12px 0', fontSize: 16, fontStyle:'italic', color: B.ink, lineHeight: 1.5}}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <BSC color={B.red} style={{fontSize: 12, display:'block', marginBottom: 24}}>—— Why This Framework ——</BSC>
          <div className="drop-cap-broadsheet" style={{fontSize: 17, lineHeight: 1.7, color: B.ink, marginBottom: 24}}>
            We did not study leadership. We lived it. Then we lost a great deal, recovered, and rebuilt — and along the way we wrote about every step of it.
          </div>
          <div style={{fontSize: 17, lineHeight: 1.7, color: B.inkSoft, marginBottom: 24, fontStyle:'italic'}}>
            Most CEO advisory is built by people who studied frameworks. Ours is built from the floor of an operating company under real load.
          </div>
          <div style={{fontSize: 22, fontStyle:'italic', color: B.red, lineHeight: 1.4, paddingTop: 24, borderTop: `3px double ${B.rule}`, textAlign:'center', fontFamily: BF.display, fontWeight: 500}}>
            ❝ We've been the people in the chair.<br/>That's the difference. ❞
          </div>
        </div>
      </div>
    </BSection>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}><BRule type="triple"/></div>
    <BSection narrow style={{paddingBottom: 80, textAlign:'center'}}>
      <h2 style={{fontFamily: BF.display, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, fontStyle:'italic', color: B.ink, lineHeight: 1.2, marginBottom: 32}}>
        if any of this resonates,<br/>the next step is the read.
      </h2>
      <button onClick={() => setActive('diagnostic')} style={{
        fontFamily: BF.display, fontSize: 13, letterSpacing:'0.25em',
        color: B.paper, background: B.ink, border: `1px solid ${B.ink}`,
        padding:'14px 32px', cursor:'pointer', textTransform: 'uppercase', fontWeight: 500, marginRight: 16,
      }}>
        Begin the Diagnostic
      </button>
      <a href="mailto:og@452b.io?subject=advisory inquiry" style={{
        fontFamily: BF.display, fontSize: 11, letterSpacing:'0.22em', color: B.ink, textDecoration:'none',
        borderBottom: `1px solid ${B.ink}`, paddingBottom: 2, display:'inline-block', textTransform:'uppercase', fontWeight: 500,
      }}>
        Or Email Directly →
      </a>
    </BSection>
  </>
)

const BroadsheetFooter = () => (
  <footer style={{borderTop: `3px double ${B.rule}`, padding:'40px 32px', background: B.paper}}>
    <div style={{maxWidth: 920, margin:'0 auto', textAlign:'center'}}>
      <BSC color={B.inkFaint} style={{fontSize: 11, letterSpacing:'0.32em'}}>452b · the operator's diagnostic</BSC>
      <BOrnament style={{marginTop: 14, marginBottom: 14}}/>
      <BSC color={B.inkFaint} style={{fontSize: 10, letterSpacing:'0.32em', opacity: 0.6}}>
        State · Signal · Structure · Sequence · Language
      </BSC>
      <div style={{fontSize: 13, fontStyle:'italic', color: B.inkFaint, marginTop: 20}}>
        og@452b.io
      </div>
    </div>
  </footer>
)

// ╔══════════════════════════════════════════════════════════╗
// ║              THEME 2: BLOOMBERG TERMINAL                 ║
// ║          1980s phosphor, monospace, full CRT             ║
// ╚══════════════════════════════════════════════════════════╝

const T = {
  bg: '#0a0d08',
  bgPanel: '#0f140d',
  green: '#00ff41',
  greenDim: '#00a82a',
  greenFaint: '#005c17',
  amber: '#ffb000',
  amberDim: '#a06c00',
  red: '#ff3030',
  rule: '#005c17',
  text: '#33ff66',
  textDim: '#888',
}
const TF = {
  mono: "'IBM Plex Mono', 'JetBrains Mono', 'Courier New', monospace",
  monoDisplay: "'VT323', 'IBM Plex Mono', monospace",
}

const TerminalApp = ({active, setActive}) => {
  const [diagStep, setDiagStep] = useState(0)
  const [diagAnswers, setDiagAnswers] = useState({})
  const [fwActive, setFwActive] = useState('state')
  const [writingFilter, setWritingFilter] = useState('all')

  return (
    <div className="scanlines crt-vignette" style={{minHeight:'100vh', background: T.bg, color: T.text, fontFamily: TF.mono, position:'relative'}}>
      <style>{`::selection { background: ${T.green}; color: ${T.bg}; }`}</style>
      <TerminalMasthead active={active} setActive={setActive} />
      {active === 'home' && <TerminalHome setActive={setActive} />}
      {active === '4sl' && <TerminalFramework fwActive={fwActive} setFwActive={setFwActive} />}
      {active === 'diagnostic' && <TerminalDiagnostic step={diagStep} setStep={setDiagStep} answers={diagAnswers} setAnswers={setDiagAnswers} />}
      {active === 'writing' && <TerminalWriting filter={writingFilter} setFilter={setWritingFilter} />}
      {active === 'studio' && <TerminalStudio />}
      {active === 'about' && <TerminalAbout setActive={setActive} />}
      <TerminalFooter />
    </div>
  )
}

const TSection = ({children, narrow, style}) => (
  <section style={{padding:'40px 0', ...style}}>
    <div style={{maxWidth: narrow ? 720 : 1120, margin:'0 auto', padding:'0 24px'}}>{children}</div>
  </section>
)

// Bloomberg-style top bar
const TerminalMasthead = ({active, setActive}) => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const hh = String(time.getHours()).padStart(2,'0')
  const mm = String(time.getMinutes()).padStart(2,'0')
  const ss = String(time.getSeconds()).padStart(2,'0')

  return (
    <header style={{borderBottom: `1px solid ${T.greenFaint}`, background: T.bgPanel}}>
      {/* Top status bar */}
      <div style={{
        background: T.amber, color: T.bg, padding:'4px 16px',
        fontSize: 12, letterSpacing:'0.1em', fontWeight: 500,
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span>452B&lt;GO&gt; OPERATOR DIAGNOSTIC SYSTEM v1.0</span>
        <span>{hh}:{mm}:{ss} EST · LIVE</span>
      </div>

      <div style={{maxWidth: 1120, margin:'0 auto', padding:'20px 24px'}}>
        {/* Big header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 20}}>
          <div>
            <div style={{fontSize: 11, color: T.greenDim, marginBottom: 4, letterSpacing:'0.2em'}}>
              [ 452B / SYSTEM / MAIN ]
            </div>
            <button onClick={() => setActive('home')} style={{
              background:'none', border:'none', cursor:'pointer', padding:0,
              fontFamily: TF.mono, fontSize: 48, color: T.green, fontWeight: 700,
              textShadow: `0 0 8px ${T.green}`, letterSpacing:'-0.02em',
            }}>
              452b
            </button>
            <div style={{fontSize: 14, color: T.greenDim, marginTop: 4, letterSpacing:'0.05em'}}>
              {`> THE OPERATOR'S DIAGNOSTIC`}
            </div>
          </div>
          <div style={{textAlign:'right', fontSize: 12, color: T.greenDim, lineHeight: 1.6}}>
            <div>SESSION: ANONYMOUS</div>
            <div>BUILD: 2026.05.06</div>
            <div style={{color: T.amber}}>STATUS: <span style={{color: T.green}}>READY</span></div>
          </div>
        </div>

        {/* Function key nav (Bloomberg-style F-keys) */}
        <div style={{
          display:'flex', gap: 0, borderTop: `1px solid ${T.greenFaint}`, borderBottom: `1px solid ${T.greenFaint}`,
        }}>
          {[
            {k:'home', l:'F1 MAIN'},
            {k:'4sl', l:'F2 4SL'},
            {k:'diagnostic', l:'F3 DIAG', highlight: true},
            {k:'writing', l:'F4 ESSAYS'},
            {k:'studio', l:'F5 STUDIO'},
            {k:'about', l:'F6 INFO'},
          ].map((item, i) => (
            <button key={item.k} onClick={() => setActive(item.k)} style={{
              flex: 1, padding:'10px 12px',
              background: active === item.k ? T.green : 'transparent',
              color: active === item.k ? T.bg : (item.highlight ? T.amber : T.green),
              border: 'none',
              borderRight: i < 5 ? `1px solid ${T.greenFaint}` : 'none',
              fontFamily: TF.mono, fontSize: 12, letterSpacing:'0.1em',
              cursor:'pointer', fontWeight: 600,
            }}>
              {item.l}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

const TerminalHome = ({setActive}) => (
  <>
    <TSection style={{paddingTop: 32}}>
      <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: T.greenFaint, marginBottom: 32}}>
        {/* MAIN COMMAND PANEL */}
        <div style={{background: T.bgPanel, padding: 32, gridColumn: 'span 2'}}>
          <div style={{color: T.greenDim, fontSize: 12, marginBottom: 12, letterSpacing:'0.1em'}}>
            {`> SYSTEM MESSAGE / 452B-MAIN`}
          </div>
          <h1 style={{
            fontFamily: TF.monoDisplay, fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 400, lineHeight: 1, color: T.green,
            textShadow: `0 0 8px ${T.green}`,
            marginBottom: 16, textTransform: 'uppercase',
          }}>
            MOST ADVISORS BEGIN<br/>
            WITH STRATEGY.<br/>
            <span style={{color: T.amber, textShadow: `0 0 8px ${T.amber}`}}>{`>>> WE BEGIN WITH`}</span><br/>
            <span style={{color: T.amber, textShadow: `0 0 8px ${T.amber}`}}>{`>>> THE OPERATOR.`}</span>
          </h1>
          <div style={{borderTop: `1px solid ${T.greenFaint}`, paddingTop: 16, fontSize: 16, lineHeight: 1.6, color: T.greenDim}}>
            {`> EVERY COMPANY IS A REFLECTION OF THE MAN RUNNING IT.`}<br/>
            {`> FIX THE MAN, THE REST GROWS CLEARER.`}
          </div>
        </div>
      </div>

      {/* ABOUT BLOCK + ENGAGEMENT */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 1, background: T.greenFaint, marginBottom: 32}}>
        <div style={{background: T.bgPanel, padding: 24}}>
          <div style={{color: T.amber, fontSize: 12, marginBottom: 12, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
            [ 01 / WHO WE ARE ]
          </div>
          <div style={{fontSize: 14, lineHeight: 1.7, color: T.text}}>
            We are 452b. We run a CEO advisory practice called 4SL — STATE, SIGNAL, STRUCTURE, SEQUENCE — with LANGUAGE as the layer that shapes how all four are interpreted.<br/><br/>
            We do not coach. We diagnose. The framework was extracted from twenty years of operating under real load.
          </div>
        </div>
        <div style={{background: T.bgPanel, padding: 24}}>
          <div style={{color: T.amber, fontSize: 12, marginBottom: 12, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
            [ 02 / HOW WE WORK ]
          </div>
          <div style={{fontSize: 14, lineHeight: 1.7, color: T.text}}>
            ENTRY: 90-min diagnostic + 5-page written read in 48 hours. $5,000.<br/><br/>
            FULL: 12-week quarterly engagement, bi-weekly sessions, ongoing access. $30,000/Q.<br/><br/>
            <span style={{color: T.greenDim}}>{`> NO COMMITMENT BEYOND THE READ.`}</span>
          </div>
        </div>
      </div>

      {/* FRAMEWORK TABLE */}
      <div style={{background: T.bgPanel, padding: 24, marginBottom: 32, border: `1px solid ${T.greenFaint}`}}>
        <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
          [ 03 / FRAMEWORK / 4SL ]
        </div>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize: 13}}>
          <thead>
            <tr style={{borderBottom: `1px solid ${T.greenFaint}`, color: T.greenDim}}>
              <th style={{textAlign:'left', padding:'10px 8px', fontWeight: 400, width: 60}}>#</th>
              <th style={{textAlign:'left', padding:'10px 8px', fontWeight: 400, width: 140}}>DIMENSION</th>
              <th style={{textAlign:'left', padding:'10px 8px', fontWeight: 400, width: 200}}>FUNCTION</th>
              <th style={{textAlign:'left', padding:'10px 8px', fontWeight: 400}}>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {DIMS.map((d, i) => (
              <tr key={d.key} onClick={() => setActive('4sl')} style={{
                borderBottom: `1px solid ${T.greenFaint}`, cursor:'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,65,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{padding:'14px 8px', color: T.amber}}>{d.roman}</td>
                <td style={{padding:'14px 8px', color: T.green, fontWeight: 600, textTransform:'uppercase'}}>{d.label}</td>
                <td style={{padding:'14px 8px', color: T.greenDim, textTransform:'uppercase'}}>{d.sub}</td>
                <td style={{padding:'14px 8px', color: T.text, lineHeight: 1.4}}>{d.blurb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMMAND PROMPT CTA */}
      <div style={{background: T.bgPanel, padding: 32, border: `1px solid ${T.green}`, textAlign:'center'}}>
        <div style={{fontSize: 14, color: T.greenDim, marginBottom: 16, letterSpacing:'0.1em'}}>
          {`> READY TO PROCEED? RUN DIAGNOSTIC TO IDENTIFY YOUR OPERATING ISSUE.`}
        </div>
        <button onClick={() => setActive('diagnostic')} style={{
          fontFamily: TF.mono, fontSize: 16, fontWeight: 700,
          color: T.bg, background: T.green, border: 'none',
          padding:'14px 32px', cursor:'pointer', letterSpacing:'0.15em',
        }}>
          {`[ EXECUTE: DIAGNOSTIC ]`}
        </button>
        <span className="blink-only" style={{marginLeft: 12, color: T.green}}>█</span>
      </div>
    </TSection>
  </>
)

const TerminalFramework = ({fwActive, setFwActive}) => {
  const dim = DIMS.find(d => d.key === fwActive)
  return (
    <TSection>
      <div style={{display:'grid', gridTemplateColumns:'240px 1fr', gap: 1, background: T.greenFaint}}>
        {/* SIDEBAR */}
        <div style={{background: T.bgPanel, padding: 20}}>
          <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
            [ MODULES ]
          </div>
          {DIMS.map(d => (
            <button key={d.key} onClick={() => setFwActive(d.key)} style={{
              display:'block', width:'100%', textAlign:'left', padding:'10px 8px',
              background: fwActive === d.key ? 'rgba(0,255,65,0.1)' : 'transparent',
              color: fwActive === d.key ? T.green : T.greenDim,
              border: `1px solid ${fwActive === d.key ? T.green : 'transparent'}`,
              fontFamily: TF.mono, fontSize: 14, cursor:'pointer', marginBottom: 4,
              letterSpacing:'0.05em',
            }}>
              <span style={{color: T.amber, marginRight: 8}}>{d.roman}.</span>
              {d.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* DETAIL */}
        <div style={{background: T.bgPanel, padding: 32, minHeight: 600}}>
          <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
            [ MODULE / {dim.roman} / {dim.label.toUpperCase()} ]
          </div>
          <h2 style={{
            fontFamily: TF.monoDisplay, fontSize: 64, fontWeight: 400, color: T.green,
            textShadow: `0 0 8px ${T.green}`,
            marginBottom: 16, textTransform:'uppercase', lineHeight: 1,
          }}>
            {dim.label}
          </h2>
          <div style={{color: T.amber, fontSize: 14, marginBottom: 24, letterSpacing:'0.05em'}}>
            {`>> `}{dim.sub.toUpperCase()}
          </div>
          <div style={{fontSize: 15, lineHeight: 1.7, color: T.text, marginBottom: 32, paddingLeft: 16, borderLeft: `2px solid ${T.greenFaint}`}}>
            {dim.long}
          </div>
          <div style={{borderTop: `1px solid ${T.greenFaint}`, paddingTop: 20, marginBottom: 32}}>
            <div style={{color: T.amber, fontSize: 12, marginBottom: 12, letterSpacing:'0.15em'}}>{`>>> DIAGNOSTIC QUERY:`}</div>
            <div style={{fontSize: 18, color: T.green, fontStyle:'italic'}}>
              ❝ {dim.diagnostic} ❞
            </div>
          </div>
          <div style={{borderTop: `1px solid ${T.greenFaint}`, paddingTop: 20}}>
            <div style={{color: T.amber, fontSize: 12, marginBottom: 12, letterSpacing:'0.15em'}}>{`>>> OPERATING PRINCIPLES:`}</div>
            {dim.examples.map((ex, i) => (
              <div key={i} style={{display:'flex', gap: 12, marginBottom: 8, fontSize: 14, lineHeight: 1.5, color: T.text}}>
                <span style={{color: T.amber, flexShrink: 0}}>{String(i+1).padStart(2,'0')}.</span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPERATING RULE */}
      <div style={{background: T.bgPanel, padding: 24, marginTop: 32, border: `1px solid ${T.amber}`, textAlign:'center'}}>
        <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em'}}>
          [[ THE OPERATING RULE ]]
        </div>
        <div style={{fontSize: 16, lineHeight: 2, color: T.green}}>
          READ STATE FIRST.<br/>
          CHECK SIGNAL BEFORE REACTING.<br/>
          INSPECT STRUCTURE BEFORE OPTIMIZING.<br/>
          SEQUENCE BEFORE EXECUTING.<br/>
          <span style={{color: T.amber}}>AUDIT LANGUAGE THROUGHOUT.</span>
        </div>
      </div>
    </TSection>
  )
}

const TerminalDiagnostic = ({step, setStep, answers, setAnswers}) => {
  const scores = useScores(answers)
  const lowest = useLowest(scores)
  const [bootText, setBootText] = useState([])

  useEffect(() => {
    if (step !== 0) return
    setBootText([])
    const lines = [
      '> 452B SYSTEMS DIAGNOSTIC v1.0',
      '> COPYRIGHT (C) 2026 452b OPERATIONS',
      '>',
      '> INITIALIZING...',
      '> LOADING FRAMEWORK MODULES:',
      '>   STATE......OK',
      '>   SIGNAL.....OK',
      '>   STRUCTURE..OK',
      '>   SEQUENCE...OK',
      '>   LANGUAGE...OK',
      '>',
      '> DIAGNOSTIC READY.',
      '> 09 QUERIES · ESTIMATED TIME: 2 MIN',
      '>',
      '> AWAITING [BEGIN]_',
    ]
    let i = 0
    const t = setInterval(() => {
      if (i >= lines.length) { clearInterval(t); return }
      setBootText(prev => [...prev, lines[i]])
      i++
    }, 70)
    return () => clearInterval(t)
  }, [step])

  const handleAnswer = (qIdx, score, tag) => {
    setAnswers(prev => ({...prev, [qIdx]: {score, tag}}))
    setTimeout(() => setStep(s => s + 1), 200)
  }

  if (step === 0) {
    return (
      <TSection narrow style={{paddingTop: 40, paddingBottom: 100}}>
        <div style={{background: T.bgPanel, padding: 32, border: `1px solid ${T.greenFaint}`, fontSize: 18, lineHeight: 1.5, minHeight: 480}}>
          {bootText.map((line, i) => (
            <div key={i} style={{minHeight: '1.5em', color: line.includes('OK') ? T.green : T.text}}>
              {line.includes('OK') ? (
                <span>{line.replace('OK', '')}<span style={{color: T.amber, textShadow: `0 0 4px ${T.amber}`}}>OK</span></span>
              ) : line.includes('AWAITING') ? (
                <span style={{color: T.amber}}>{line}</span>
              ) : line}
            </div>
          ))}
          {bootText.length >= 14 && (
            <div style={{marginTop: 24}}>
              <button onClick={() => setStep(1)} style={{
                fontFamily: TF.mono, fontSize: 18, fontWeight: 700,
                color: T.bg, background: T.green, border: 'none',
                padding:'10px 24px', cursor:'pointer', letterSpacing:'0.1em',
              }}>
                {`[ BEGIN ]`}
              </button>
              <span className="blink-only" style={{marginLeft: 12, color: T.green}}>█</span>
            </div>
          )}
        </div>
      </TSection>
    )
  }

  if (step >= 1 && step <= 9) {
    const qIdx = step - 1
    const q = QUESTIONS[qIdx]
    const selected = answers[qIdx]?.score
    return (
      <TSection narrow style={{paddingTop: 40, paddingBottom: 100}}>
        <div style={{background: T.bgPanel, padding: 32, border: `1px solid ${T.greenFaint}`}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: 12, marginBottom: 24, borderBottom: `1px solid ${T.greenFaint}`}}>
            <span style={{color: T.greenDim, fontSize: 13}}>{`> 452B/DIAG`}</span>
            <span style={{color: T.amber, fontSize: 13}}>[ Q{String(step).padStart(2,'0')}/09 · {q.dim.toUpperCase()} ]</span>
          </div>
          <div style={{marginBottom: 28, fontSize: 15, color: T.greenDim}}>
            {'['}<span style={{color: T.green}}>{'█'.repeat(step)}</span><span>{'░'.repeat(9 - step)}</span>{']'} {Math.round((step/9)*100)}%
          </div>
          <div style={{marginBottom: 28}}>
            <div style={{color: T.greenDim, fontSize: 13, marginBottom: 8}}>{`> QUERY:`}</div>
            <div style={{fontSize: 22, lineHeight: 1.4, color: T.green, paddingLeft: 16, borderLeft: `2px solid ${T.green}`, textShadow: `0 0 6px ${T.green}`}}>
              {q.q}
            </div>
          </div>
          <div style={{marginBottom: 24}}>
            <div style={{color: T.greenDim, fontSize: 13, marginBottom: 12}}>{`> SELECT ONE:`}</div>
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i)
              const isSelected = selected === opt.s
              return (
                <button key={i} onClick={() => handleAnswer(qIdx, opt.s, opt.tag)} style={{
                  display:'block', width:'100%', textAlign:'left',
                  padding:'10px 16px', marginBottom: 4,
                  background: isSelected ? 'rgba(0,255,65,0.15)' : 'transparent',
                  color: T.text,
                  border: `1px solid ${isSelected ? T.green : 'transparent'}`,
                  fontFamily: TF.mono, fontSize: 16, cursor:'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(0,255,65,0.05)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}>
                  <span style={{color: T.amber, marginRight: 16}}>[{letter}]</span>
                  {opt.l}
                </button>
              )
            })}
          </div>
          {step > 1 && (
            <div style={{marginTop: 24, paddingTop: 12, borderTop: `1px solid ${T.greenFaint}`}}>
              <button onClick={() => setStep(s => s - 1)} style={{
                background:'none', border:'none', cursor:'pointer',
                color: T.greenDim, fontFamily: TF.mono, fontSize: 13,
              }}>
                {`< BACK`}
              </button>
            </div>
          )}
        </div>
      </TSection>
    )
  }

  return (
    <TSection narrow style={{paddingTop: 40, paddingBottom: 100}}>
      <div style={{color: T.greenDim, fontSize: 14, marginBottom: 8}}>{`> DIAGNOSTIC COMPLETE.`}</div>
      <div style={{color: T.greenDim, fontSize: 14, marginBottom: 24}}>{`> RENDERING READ...`}</div>

      <div style={{background: T.bgPanel, padding: 24, marginBottom: 24, border: `2px solid ${T.amber}`}}>
        <div style={{color: T.amber, fontSize: 13, marginBottom: 8, letterSpacing:'0.15em'}}>{`>> PRIMARY OPERATING ISSUE:`}</div>
        <div style={{
          fontFamily: TF.monoDisplay, fontSize: 64, fontWeight: 400, color: T.amber,
          textShadow: `0 0 8px ${T.amber}`, textTransform:'uppercase', lineHeight: 1,
        }}>
          {lowest}
        </div>
      </div>

      <div style={{background: T.bgPanel, padding: 24, marginBottom: 24, border: `1px solid ${T.greenFaint}`}}>
        <div style={{color: T.greenDim, fontSize: 13, marginBottom: 16}}>{`> FIVE-AXIS READ:`}</div>
        {Object.entries(scores).map(([dim, score]) => {
          const filled = Math.round(score)
          const isLowest = dim === lowest
          const color = isLowest ? T.amber : T.green
          return (
            <div key={dim} style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 6, fontSize: 15, color, textShadow: `0 0 4px ${color}`}}>
              <span style={{width: 100, textTransform:'uppercase'}}>{dim}</span>
              <span>[</span>
              <span>{'█'.repeat(filled)}</span>
              <span style={{color: T.greenFaint, textShadow:'none'}}>{'░'.repeat(10 - filled)}</span>
              <span>]</span>
              <span style={{width: 60, textAlign:'right'}}>{score.toFixed(1)}/10</span>
            </div>
          )
        })}
      </div>

      <div style={{background: T.bgPanel, padding: 24, marginBottom: 24, border: `1px solid ${T.green}`}}>
        <div style={{color: T.greenDim, fontSize: 13, marginBottom: 12}}>{`>> THE READ:`}</div>
        <div style={{fontSize: 17, lineHeight: 1.5, color: T.green}}>
          {READS[lowest]}
        </div>
      </div>

      <div style={{marginTop: 24}}>
        <div style={{color: T.greenDim, fontSize: 13, marginBottom: 12}}>{`> NEXT ACTION:`}</div>
        <a href="mailto:og@452b.io?subject=the operator read" style={{
          display:'inline-block', padding:'12px 24px', marginBottom: 12, marginRight: 12,
          background: T.green, color: T.bg,
          fontFamily: TF.mono, fontSize: 16, fontWeight: 700,
          textDecoration:'none', letterSpacing:'0.1em',
        }}>
          {`[ BOOK OPERATOR READ · $5,000 ]`}
        </a>
        <button onClick={() => { setStep(0); setAnswers({}) }} style={{
          background:'none', border: `1px solid ${T.greenDim}`, padding:'12px 24px',
          color: T.greenDim, fontFamily: TF.mono, fontSize: 16, cursor:'pointer', letterSpacing:'0.1em',
        }}>
          {`[ RETAKE ]`}
        </button>
      </div>

      <div style={{marginTop: 32, color: T.greenDim, fontSize: 14}}>
        {`> THIS READ IS YOURS. USE IT HOWEVER YOU WANT.`}<br/>
        {`> IF IT LANDED, YOU KNOW WHERE TO FIND US.`}
      </div>
    </TSection>
  )
}

const TerminalWriting = ({filter, setFilter}) => {
  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.dim === filter)
  return (
    <TSection>
      <div style={{background: T.bgPanel, padding: 24, border: `1px solid ${T.greenFaint}`, marginBottom: 24}}>
        <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
          [ ESSAYS / DISPATCHES / 50+ ENTRIES ]
        </div>
        <div style={{fontSize: 14, color: T.greenDim, lineHeight: 1.6}}>
          {`> 50+ essays on operating under load.`}<br/>
          {`> Each entry maps to a dimension of the framework.`}<br/>
          {`> The framework was extracted from these.`}
        </div>
      </div>

      {/* FILTER */}
      <div style={{display:'flex', gap: 4, marginBottom: 24, flexWrap:'wrap'}}>
        {['all', 'state', 'signal', 'structure', 'sequence', 'language'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'8px 16px',
            background: filter === f ? T.green : 'transparent',
            color: filter === f ? T.bg : T.greenDim,
            border: `1px solid ${filter === f ? T.green : T.greenFaint}`,
            fontFamily: TF.mono, fontSize: 12, letterSpacing:'0.1em',
            cursor:'pointer', textTransform:'uppercase', fontWeight: 600,
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{background: T.bgPanel, padding: 0, border: `1px solid ${T.greenFaint}`}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize: 13}}>
          <thead>
            <tr style={{borderBottom: `1px solid ${T.greenFaint}`, color: T.greenDim, background: 'rgba(0,255,65,0.05)'}}>
              <th style={{textAlign:'left', padding:'10px 12px', fontWeight: 400, width: 60}}>#</th>
              <th style={{textAlign:'left', padding:'10px 12px', fontWeight: 400, width: 130}}>DIM</th>
              <th style={{textAlign:'left', padding:'10px 12px', fontWeight: 400}}>TITLE / DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} style={{borderBottom: `1px solid ${T.greenFaint}`, cursor:'pointer'}}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,65,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{padding:'12px', color: T.amber}}>{String(i+1).padStart(3,'0')}</td>
                <td style={{padding:'12px', color: T.green, textTransform:'uppercase'}}>{a.dim}</td>
                <td style={{padding:'12px'}}>
                  <div style={{color: T.green, fontSize: 14, marginBottom: 4, textTransform:'uppercase', fontWeight: 600}}>{a.title}</div>
                  <div style={{color: T.textDim, fontSize: 13}}>{a.blurb}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop: 32, textAlign:'center'}}>
        <a href="https://www.linkedin.com/in/ogjones" style={{color: T.amber, fontFamily: TF.mono, fontSize: 13, textDecoration:'none', letterSpacing:'0.1em'}}>
          {`>> FULL ARCHIVE: LINKEDIN.COM/IN/OGJONES`}
        </a>
      </div>
    </TSection>
  )
}

const TerminalStudio = () => (
  <TSection>
    <div style={{background: T.bgPanel, padding: 24, border: `1px solid ${T.greenFaint}`, marginBottom: 24}}>
      <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
        [ STUDIO / ANCILLARY OUTPUT ]
      </div>
      <div style={{fontSize: 14, color: T.greenDim, lineHeight: 1.6}}>
        {`> The same operating principles, applied to different mediums.`}<br/>
        {`> Art, characters, instruments, systems.`}
      </div>
    </div>

    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 1, background: T.greenFaint}}>
      {STUDIO_ITEMS.map((s, i) => (
        <div key={i} style={{background: T.bgPanel, padding: 24}}>
          <div style={{color: T.amber, fontSize: 12, marginBottom: 12, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
            [ {s.n} / {s.cat} ]
          </div>
          <div style={{
            fontFamily: TF.monoDisplay, fontSize: 36, color: T.green,
            textShadow: `0 0 6px ${T.green}`, marginBottom: 16, textTransform:'uppercase',
          }}>
            {s.title}
          </div>
          <div style={{fontSize: 14, lineHeight: 1.6, color: T.text}}>{s.body}</div>
        </div>
      ))}
    </div>
  </TSection>
)

const TerminalAbout = ({setActive}) => (
  <TSection>
    <div style={{background: T.bgPanel, padding: 24, border: `1px solid ${T.greenFaint}`, marginBottom: 24}}>
      <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
        [ INFO / 452B / COLOPHON ]
      </div>
      <h1 style={{
        fontFamily: TF.monoDisplay, fontSize: 48, color: T.green,
        textShadow: `0 0 8px ${T.green}`, marginBottom: 16, lineHeight: 1, textTransform:'uppercase',
      }}>
        452b is built<br/>by operators.
      </h1>
      <div style={{fontSize: 14, color: T.greenDim, lineHeight: 1.6}}>
        {`> The practice is led by O.G. Jones.`}<br/>
        {`> The framework comes from the ground.`}
      </div>
    </div>

    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 1, background: T.greenFaint, marginBottom: 24}}>
      <div style={{background: T.bgPanel, padding: 24}}>
        <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
          [ CREDENTIALS ]
        </div>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize: 13}}>
          <tbody>
            {CREDS.map(([k, v]) => (
              <tr key={k} style={{borderBottom: `1px solid ${T.greenFaint}`}}>
                <td style={{padding:'10px 0', color: T.amber, width: 130, verticalAlign:'top', textTransform:'uppercase'}}>{k}</td>
                <td style={{padding:'10px 0', color: T.text, lineHeight: 1.5}}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{background: T.bgPanel, padding: 24}}>
        <div style={{color: T.amber, fontSize: 12, marginBottom: 16, letterSpacing:'0.15em', borderBottom: `1px solid ${T.greenFaint}`, paddingBottom: 8}}>
          [ WHY THIS FRAMEWORK ]
        </div>
        <div style={{fontSize: 14, lineHeight: 1.7, color: T.text, marginBottom: 16}}>
          We did not study leadership. We lived it. Then we lost a great deal, recovered, and rebuilt — and along the way we wrote about every step of it.
        </div>
        <div style={{fontSize: 14, lineHeight: 1.7, color: T.greenDim, marginBottom: 16}}>
          Most CEO advisory is built by people who studied frameworks. Ours is built from the floor of an operating company under real load.
        </div>
        <div style={{
          marginTop: 20, padding: 16, border: `1px solid ${T.amber}`,
          color: T.amber, fontSize: 16, lineHeight: 1.5, textAlign:'center',
        }}>
          ❝ We've been the people in the chair.<br/>That's the difference. ❞
        </div>
      </div>
    </div>

    <div style={{background: T.bgPanel, padding: 24, border: `1px solid ${T.green}`, textAlign:'center'}}>
      <div style={{fontSize: 16, color: T.green, marginBottom: 16}}>
        {`> IF ANY OF THIS RESONATES, NEXT STEP IS THE READ.`}
      </div>
      <button onClick={() => setActive('diagnostic')} style={{
        fontFamily: TF.mono, fontSize: 16, fontWeight: 700,
        color: T.bg, background: T.green, border: 'none',
        padding:'12px 24px', cursor:'pointer', letterSpacing:'0.1em', marginRight: 12,
      }}>
        {`[ EXECUTE: DIAGNOSTIC ]`}
      </button>
      <a href="mailto:og@452b.io?subject=advisory inquiry" style={{
        color: T.amber, fontFamily: TF.mono, fontSize: 13, textDecoration:'none', letterSpacing:'0.1em',
      }}>
        OR EMAIL: og@452b.io
      </a>
    </div>
  </TSection>
)

const TerminalFooter = () => (
  <footer style={{borderTop: `1px solid ${T.greenFaint}`, padding:'16px 24px', background: T.bgPanel}}>
    <div style={{maxWidth: 1120, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: 11, color: T.greenDim, letterSpacing:'0.1em'}}>
      <span>452B/v1.0 · STATE · SIGNAL · STRUCTURE · SEQUENCE · LANGUAGE</span>
      <span>og@452b.io</span>
    </div>
  </footer>
)

// ╔══════════════════════════════════════════════════════════╗
// ║              THEME 3: EDITORIAL (ORIGINAL)               ║
// ║          Dark, refined, Fraunces + EB Garamond           ║
// ╚══════════════════════════════════════════════════════════╝

const E = {
  bg: '#0a0907',
  bgSoft: '#13110d',
  bgCard: '#16140f',
  ink: '#e8dfcf',
  inkSoft: 'rgba(232,223,207,0.65)',
  inkFaint: 'rgba(232,223,207,0.35)',
  inkGhost: 'rgba(232,223,207,0.15)',
  gold: '#c9a961',
  goldDim: 'rgba(201,169,97,0.4)',
  border: 'rgba(232,223,207,0.08)',
  borderStrong: 'rgba(232,223,207,0.18)',
}
const EF = {
  serif: "'EB Garamond', Georgia, serif",
  display: "'Fraunces', 'EB Garamond', serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
}

const EditorialApp = ({active, setActive}) => {
  const [diagStep, setDiagStep] = useState(0)
  const [diagAnswers, setDiagAnswers] = useState({})
  const [fwActive, setFwActive] = useState('state')
  const [writingFilter, setWritingFilter] = useState('all')

  return (
    <div style={{minHeight:'100vh', background: E.bg, color: E.ink}}>
      <style>{`::selection { background: ${E.gold}; color: ${E.bg}; }`}</style>
      <EditorialNav active={active} setActive={setActive} />
      {active === 'home' && <EditorialHome setActive={setActive} />}
      {active === '4sl' && <EditorialFramework fwActive={fwActive} setFwActive={setFwActive} />}
      {active === 'diagnostic' && <EditorialDiagnostic step={diagStep} setStep={setDiagStep} answers={diagAnswers} setAnswers={setDiagAnswers} />}
      {active === 'writing' && <EditorialWriting filter={writingFilter} setFilter={setWritingFilter} />}
      {active === 'studio' && <EditorialStudio />}
      {active === 'about' && <EditorialAbout setActive={setActive} />}
      <EditorialFooter />
    </div>
  )
}

const ESection = ({children, narrow, style}) => (
  <section style={{padding:'80px 0', ...style}}>
    <div style={{maxWidth: narrow ? 720 : 1100, margin:'0 auto', padding:'0 32px'}}>{children}</div>
  </section>
)
const EMono = ({children, style, color, ...rest}) => (
  <span style={{fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase', color: color || E.ink, ...style}} {...rest}>{children}</span>
)
const EDisplay = ({children, style, ...rest}) => (
  <span style={{fontFamily: EF.display, fontWeight: 400, letterSpacing:'-0.02em', ...style}} {...rest}>{children}</span>
)
const ERule = ({style}) => <div style={{height: 1, background: E.border, width:'100%', ...style}}/>

const EditorialNav = ({active, setActive}) => (
  <nav style={{position:'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,9,7,0.85)', backdropFilter:'blur(12px)', borderBottom: `1px solid ${E.border}`}}>
    <div style={{maxWidth: 1100, margin:'0 auto', padding:'18px 32px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <button onClick={() => setActive('home')} style={{background:'none', border:'none', cursor:'pointer', padding: 0, fontFamily: EF.mono, fontSize: 13, color: E.ink, letterSpacing:'0.2em', fontWeight: 500}}>
        452b
      </button>
      <div style={{display:'flex', gap: 28}}>
        {['4sl', 'diagnostic', 'writing', 'studio', 'about'].map(item => (
          <button key={item} onClick={() => setActive(item)} style={{
            background:'none', border:'none', cursor:'pointer', padding: 0,
            fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.18em',
            color: active === item ? E.gold : E.inkSoft, transition:'color 0.2s',
          }}>
            {item}
          </button>
        ))}
      </div>
    </div>
  </nav>
)

const EditorialHome = ({setActive}) => (
  <>
    <ESection style={{paddingTop: 200, paddingBottom: 100}}>
      <EMono color={E.gold} style={{marginBottom: 48, display:'block'}}>452b · ceo advisory</EMono>
      <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 300, lineHeight: 0.95, letterSpacing:'-0.03em', color: E.ink, marginBottom: 48}}>
        most advisors<br/>
        <span style={{fontStyle:'italic', color: E.gold}}>start with strategy.</span><br/>
        we start with<br/>
        the operator.
      </h1>
      <div style={{maxWidth: 600, fontSize: 22, lineHeight: 1.55, color: E.inkSoft, marginBottom: 64}}>
        every company is a reflection of the person running it. fix the operator, the rest gets clearer. the leadership team aligns. the structure follows.
      </div>
      <div style={{display:'flex', gap: 16, flexWrap:'wrap'}}>
        <button onClick={() => setActive('diagnostic')} style={{
          padding:'18px 28px', background: E.gold, color: E.bg, border: 'none',
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase',
          cursor:'pointer', fontWeight: 600,
        }}>
          take the operator read →
        </button>
        <button onClick={() => setActive('4sl')} style={{
          padding:'18px 28px', background:'transparent', color: E.ink,
          border: `1px solid ${E.borderStrong}`,
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer',
        }}>
          how 4sl works
        </button>
      </div>
    </ESection>
    <ERule />

    <ESection>
      <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 32}}>
        <EMono color={E.gold}>01</EMono>
        <EMono color={E.inkFaint}>the framework</EMono>
      </div>
      <h2 style={{fontFamily: EF.display, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing:'-0.02em', marginBottom: 64, maxWidth: 800}}>
        4sl. <span style={{fontStyle:'italic', color: E.gold}}>four dimensions</span> for diagnosing where a ceo's operating issue actually sits.
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: E.border, marginBottom: 48}}>
        {DIMS.slice(0, 4).map((d, i) => (
          <div key={d.key} style={{background: E.bg, padding:'40px 32px'}}>
            <EMono color={E.gold} style={{marginBottom: 16, display:'block'}}>{String(i+1).padStart(2,'0')}</EMono>
            <EDisplay style={{fontSize: 32, color: E.ink, display:'block', marginBottom: 12}}>{d.label}</EDisplay>
            <div style={{fontSize: 15, color: E.inkSoft, lineHeight: 1.5}}>{d.blurb}</div>
          </div>
        ))}
      </div>
      <div style={{padding: 32, background: E.bgSoft, borderLeft: `2px solid ${E.gold}`, fontSize: 18, lineHeight: 1.6, color: E.ink, fontStyle:'italic', fontFamily: EF.serif}}>
        and language as the layer that shapes how all four are interpreted.
      </div>
    </ESection>
    <ERule />

    <ESection>
      <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 32}}>
        <EMono color={E.gold}>02</EMono>
        <EMono color={E.inkFaint}>the work</EMono>
      </div>
      <h2 style={{fontFamily: EF.display, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing:'-0.02em', marginBottom: 64, maxWidth: 800}}>
        two doors. <span style={{fontStyle:'italic', color: E.gold}}>start where it makes sense.</span>
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))', gap: 32}}>
        <div style={{padding: 40, background: E.bgSoft, border: `1px solid ${E.border}`}}>
          <EMono color={E.gold} style={{marginBottom: 24, display:'block'}}>door one</EMono>
          <EDisplay style={{fontSize: 36, display:'block', marginBottom: 8}}>the operator read</EDisplay>
          <EMono color={E.inkFaint} style={{marginBottom: 32, display:'block'}}>$5,000 · one session</EMono>
          <div style={{fontSize: 16, lineHeight: 1.65, color: E.inkSoft, marginBottom: 24}}>
            a 90-minute diagnostic call. a five-page written read delivered in 48 hours. the dimension that's broken, the sequence to fix it, the next 30 days.
          </div>
          <div style={{fontSize: 14, color: E.inkFaint, lineHeight: 1.6}}>
            no further commitment. no upsell. if it lands, you come back.
          </div>
        </div>
        <div style={{padding: 40, background: E.bgSoft, border: `1px solid rgba(201,169,97,0.15)`, position:'relative'}}>
          <div style={{position:'absolute', top: 0, left: 0, right: 0, height: 2, background: E.gold}}/>
          <EMono color={E.gold} style={{marginBottom: 24, display:'block'}}>door two</EMono>
          <EDisplay style={{fontSize: 36, display:'block', marginBottom: 8}}>the quarterly</EDisplay>
          <EMono color={E.inkFaint} style={{marginBottom: 32, display:'block'}}>$30,000 / quarter · renewable</EMono>
          <div style={{fontSize: 16, lineHeight: 1.65, color: E.inkSoft, marginBottom: 24}}>
            12 weeks of full engagement. bi-weekly deep sessions. weekly check-ins. ai system access. quarterly recalibration.
          </div>
          <div style={{fontSize: 14, color: E.inkFaint, lineHeight: 1.6}}>
            for ceos ready to upgrade the entire operating system.
          </div>
        </div>
      </div>
      <div style={{marginTop: 48}}>
        <button onClick={() => setActive('diagnostic')} style={{
          padding:'18px 28px', background: E.gold, color: E.bg, border:'none',
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontWeight: 600,
        }}>
          start with the read →
        </button>
      </div>
    </ESection>
    <ERule />

    <ESection>
      <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 32}}>
        <EMono color={E.gold}>03</EMono>
        <EMono color={E.inkFaint}>why this works</EMono>
      </div>
      <h2 style={{fontFamily: EF.display, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing:'-0.02em', marginBottom: 64, maxWidth: 900}}>
        we've been the people <span style={{fontStyle:'italic', color: E.gold}}>in the chair.</span>
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 64, marginBottom: 32}}>
        <div>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.inkSoft, marginBottom: 24}}>
            13 years scaling a manufacturing company from $28m to $114m. $250m managed institutionally. cfa charterholder. columbia mba. duke undergrad.
          </div>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.inkSoft}}>
            we didn't study this. we lived it. then we built a system from what worked.
          </div>
        </div>
        <div>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.inkSoft, marginBottom: 24}}>
            the difference between us and a deck is that we've actually run companies, managed real money under real pressure, and we start with the human, not the spreadsheet.
          </div>
          <button onClick={() => setActive('about')} style={{
            background:'none', border:'none', padding: 0, cursor:'pointer',
            color: E.gold, fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase',
          }}>
            full background →
          </button>
        </div>
      </div>
    </ESection>
    <ERule />

    <ESection style={{paddingBottom: 160}}>
      <div style={{display:'flex', alignItems:'baseline', gap: 12, marginBottom: 32}}>
        <EMono color={E.gold}>04</EMono>
        <EMono color={E.inkFaint}>proof of work</EMono>
      </div>
      <h2 style={{fontFamily: EF.display, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing:'-0.02em', marginBottom: 64, maxWidth: 900}}>
        the framework <span style={{fontStyle:'italic', color: E.gold}}>is published.</span> read it before you buy it.
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 32}}>
        <button onClick={() => setActive('writing')} style={{
          background: E.bgSoft, border: `1px solid ${E.border}`, padding: 40, textAlign:'left', cursor:'pointer', transition:'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = E.gold}
        onMouseLeave={e => e.currentTarget.style.borderColor = E.border}>
          <EMono color={E.gold} style={{marginBottom: 16, display:'block'}}>writing</EMono>
          <EDisplay style={{fontSize: 28, display:'block', marginBottom: 16}}>50+ articles on operating under load</EDisplay>
          <div style={{fontSize: 14, color: E.inkSoft, lineHeight: 1.6}}>
            every article maps to one of the four dimensions. read what you need. the system was built from these.
          </div>
          <div style={{marginTop: 24, color: E.inkFaint, fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase'}}>read →</div>
        </button>
        <button onClick={() => setActive('studio')} style={{
          background: E.bgSoft, border: `1px solid ${E.border}`, padding: 40, textAlign:'left', cursor:'pointer', transition:'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = E.gold}
        onMouseLeave={e => e.currentTarget.style.borderColor = E.border}>
          <EMono color={E.gold} style={{marginBottom: 16, display:'block'}}>studio</EMono>
          <EDisplay style={{fontSize: 28, display:'block', marginBottom: 16}}>the worn faded canon</EDisplay>
          <div style={{fontSize: 14, color: E.inkSoft, lineHeight: 1.6}}>
            we make things. art, characters, systems. the same operating principles applied to a different medium.
          </div>
          <div style={{marginTop: 24, color: E.inkFaint, fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase'}}>see →</div>
        </button>
      </div>
    </ESection>
  </>
)

const EditorialFramework = ({fwActive, setFwActive}) => {
  const dim = DIMS.find(d => d.key === fwActive)
  return (
    <>
      <ESection style={{paddingTop: 160, paddingBottom: 80}}>
        <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>the framework</EMono>
        <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 48}}>4sl</h1>
        <div style={{fontSize: 22, lineHeight: 1.55, color: E.inkSoft, maxWidth: 720, marginBottom: 16}}>
          state. signal. structure. sequence.
        </div>
        <div style={{fontSize: 18, lineHeight: 1.55, color: E.inkFaint, maxWidth: 720, fontStyle:'italic'}}>
          and language as the layer that shapes how all four are interpreted.
        </div>
      </ESection>
      <ERule />
      <ESection style={{paddingTop: 80, paddingBottom: 80}}>
        <div style={{display:'grid', gridTemplateColumns:'240px 1fr', gap: 64}}>
          <div style={{position:'sticky', top: 100, alignSelf:'start'}}>
            <EMono color={E.inkFaint} style={{marginBottom: 24, display:'block'}}>dimensions</EMono>
            <div style={{display:'flex', flexDirection:'column', gap: 4}}>
              {DIMS.map((d, i) => (
                <button key={d.key} onClick={() => setFwActive(d.key)} style={{
                  background:'none', border:'none', textAlign:'left', padding:'12px 0', cursor:'pointer',
                  borderLeft: `2px solid ${fwActive === d.key ? E.gold : 'transparent'}`,
                  paddingLeft: 16, transition:'all 0.2s',
                }}>
                  <EMono color={E.inkFaint} style={{marginRight: 12}}>{String(i+1).padStart(2,'0')}</EMono>
                  <EDisplay style={{fontSize: 22, color: fwActive === d.key ? E.gold : E.ink}}>{d.label}</EDisplay>
                </button>
              ))}
            </div>
          </div>
          <div>
            <EMono color={E.gold} style={{marginBottom: 16, display:'block'}}>{dim.sub}</EMono>
            <h2 style={{fontFamily: EF.display, fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.02em', marginBottom: 32}}>
              {dim.label}
            </h2>
            <div style={{fontSize: 22, lineHeight: 1.5, color: E.ink, marginBottom: 48, fontStyle:'italic', fontFamily: EF.serif}}>
              {dim.blurb}
            </div>
            <div style={{fontSize: 17, lineHeight: 1.7, color: E.inkSoft, marginBottom: 48}}>
              {dim.long}
            </div>
            <ERule style={{marginBottom: 32}}/>
            <EMono color={E.inkFaint} style={{marginBottom: 16, display:'block'}}>diagnostic question</EMono>
            <div style={{fontSize: 20, lineHeight: 1.5, color: E.gold, marginBottom: 48, fontStyle:'italic', fontFamily: EF.serif}}>
              {dim.diagnostic}
            </div>
            <ERule style={{marginBottom: 32}}/>
            <EMono color={E.inkFaint} style={{marginBottom: 24, display:'block'}}>operating principles</EMono>
            <div style={{display:'flex', flexDirection:'column', gap: 16}}>
              {dim.examples.map((ex, i) => (
                <div key={i} style={{display:'flex', gap: 20, fontSize: 17, lineHeight: 1.5, color: E.ink, fontFamily: EF.serif, fontStyle:'italic'}}>
                  <EMono color={E.gold} style={{flexShrink: 0}}>{String(i+1).padStart(2,'0')}</EMono>
                  <div>{ex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ESection>
      <ERule />
      <ESection style={{paddingBottom: 160}}>
        <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>the operating rule</EMono>
        <div style={{fontFamily: EF.display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, lineHeight: 1.3, letterSpacing:'-0.01em', color: E.ink, maxWidth: 900}}>
          read state first. <br/>
          check signal before reacting. <br/>
          inspect structure before optimizing. <br/>
          sequence before executing. <br/>
          <span style={{fontStyle:'italic', color: E.gold}}>audit language throughout.</span>
        </div>
      </ESection>
    </>
  )
}

const EditorialDiagnostic = ({step, setStep, answers, setAnswers}) => {
  const scores = useScores(answers)
  const lowest = useLowest(scores)

  const handleAnswer = (qIdx, score, tag) => {
    setAnswers(prev => ({...prev, [qIdx]: {score, tag}}))
    setTimeout(() => setStep(s => s + 1), 200)
  }

  if (step === 0) {
    return (
      <ESection style={{paddingTop: 160, minHeight: '90vh'}}>
        <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>the operator read</EMono>
        <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 48}}>
          nine questions.<br/>
          <span style={{fontStyle:'italic', color: E.gold}}>two minutes.</span><br/>
          a real read.
        </h1>
        <div style={{maxWidth: 640, fontSize: 18, lineHeight: 1.65, color: E.inkSoft, marginBottom: 48}}>
          this is not a survey. each question is designed to surface where your operating issue actually sits. you'll get a five-axis read at the end with the dimension that's most broken and what to do about it.
          <br/><br/>
          if the read lands, the next step is a 90-minute call and a written report. that's the operator read. $5,000.
        </div>
        <button onClick={() => setStep(1)} style={{
          padding:'20px 32px', background: E.gold, color: E.bg, border: 'none',
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontWeight: 600,
        }}>
          begin →
        </button>
      </ESection>
    )
  }

  if (step >= 1 && step <= 9) {
    const qIdx = step - 1
    const q = QUESTIONS[qIdx]
    const selected = answers[qIdx]?.score
    return (
      <ESection style={{paddingTop: 160, minHeight: '90vh'}}>
        <div style={{marginBottom: 64}}>
          <EMono color={E.gold} style={{marginBottom: 12, display:'block'}}>question {String(step).padStart(2,'0')} of 09 · {q.dim}</EMono>
          <div style={{height: 2, background: E.border, position:'relative'}}>
            <div style={{height: 2, background: E.gold, width: `${(step / 9) * 100}%`, transition:'width 0.3s'}}/>
          </div>
        </div>
        <h2 style={{fontFamily: EF.display, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, lineHeight: 1.2, letterSpacing:'-0.01em', color: E.ink, marginBottom: 64, maxWidth: 900}}>
          {q.q}
        </h2>
        <div style={{display:'flex', flexDirection:'column', gap: 12}}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(qIdx, opt.s, opt.tag)} style={{
              padding:'24px 28px', textAlign:'left',
              background: selected === opt.s ? E.bgCard : 'transparent',
              border: `1px solid ${selected === opt.s ? E.gold : E.border}`,
              cursor:'pointer', transition:'all 0.15s',
              fontFamily: EF.serif, fontSize: 19, color: E.ink,
              display:'flex', alignItems:'center', gap: 24,
            }}
            onMouseEnter={e => { if (selected !== opt.s) e.currentTarget.style.borderColor = E.borderStrong }}
            onMouseLeave={e => { if (selected !== opt.s) e.currentTarget.style.borderColor = E.border }}>
              <EMono color={E.inkFaint} style={{flexShrink: 0}}>{String.fromCharCode(97+i)}</EMono>
              <span>{opt.l}</span>
            </button>
          ))}
        </div>
        {step > 1 && (
          <div style={{marginTop: 48}}>
            <button onClick={() => setStep(s => s - 1)} style={{
              background:'none', border:'none', padding: 0, cursor:'pointer',
              color: E.inkFaint, fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.2em', textTransform:'uppercase',
            }}>
              ← back
            </button>
          </div>
        )}
      </ESection>
    )
  }

  return (
    <ESection style={{paddingTop: 160, paddingBottom: 160}}>
      <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>your read</EMono>
      <h1 style={{fontFamily: EF.display, fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 64}}>
        primary issue:<br/>
        <span style={{fontStyle:'italic', color: E.gold}}>{lowest}</span>
      </h1>
      <div style={{marginBottom: 64}}>
        <EMono color={E.inkFaint} style={{marginBottom: 32, display:'block'}}>the five-axis read</EMono>
        <div style={{display:'flex', flexDirection:'column', gap: 16}}>
          {Object.entries(scores).map(([dim, score]) => (
            <div key={dim}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8}}>
                <EDisplay style={{fontSize: 22, color: dim === lowest ? E.gold : E.ink}}>{dim}</EDisplay>
                <EMono color={dim === lowest ? E.gold : E.inkFaint}>{score.toFixed(1)} / 10</EMono>
              </div>
              <div style={{height: 4, background: E.border, position:'relative'}}>
                <div style={{height: 4, background: dim === lowest ? E.gold : E.inkSoft, width: `${(score/10)*100}%`, transition:'width 0.6s'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding: 40, background: E.bgSoft, borderLeft: `2px solid ${E.gold}`, marginBottom: 64}}>
        <EMono color={E.gold} style={{marginBottom: 16, display:'block'}}>the read</EMono>
        <div style={{fontSize: 22, lineHeight: 1.55, color: E.ink, fontFamily: EF.serif, fontStyle:'italic'}}>
          {READS[lowest]}
        </div>
      </div>
      <div style={{display:'flex', gap: 16, flexWrap:'wrap', marginBottom: 32}}>
        <a href="mailto:og@452b.io?subject=the operator read" style={{
          padding:'20px 32px', background: E.gold, color: E.bg, border:'none',
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase',
          cursor:'pointer', fontWeight: 600, textDecoration:'none',
        }}>
          book the operator read · $5,000 →
        </a>
        <button onClick={() => { setStep(0); setAnswers({}) }} style={{
          padding:'20px 32px', background:'transparent', color: E.ink,
          border: `1px solid ${E.borderStrong}`,
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer',
        }}>
          retake
        </button>
      </div>
      <div style={{fontSize: 14, color: E.inkFaint, lineHeight: 1.6, maxWidth: 600}}>
        this read is yours. use it however you want. if it landed, you know where to find us.
      </div>
    </ESection>
  )
}

const EditorialWriting = ({filter, setFilter}) => {
  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.dim === filter)
  return (
    <>
      <ESection style={{paddingTop: 160, paddingBottom: 80}}>
        <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>writing</EMono>
        <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 48}}>
          the framework<br/>
          <span style={{fontStyle:'italic', color: E.gold}}>came from these.</span>
        </h1>
        <div style={{maxWidth: 640, fontSize: 18, lineHeight: 1.65, color: E.inkSoft}}>
          50+ articles on operating under load. each one maps to a dimension of the framework. read what you need.
        </div>
      </ESection>
      <ERule />
      <ESection style={{paddingTop: 64}}>
        <div style={{display:'flex', gap: 4, marginBottom: 48, flexWrap:'wrap'}}>
          {['all', 'state', 'signal', 'structure', 'sequence', 'language'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'10px 16px',
              background: filter === f ? E.gold : 'transparent',
              color: filter === f ? E.bg : E.inkSoft,
              border: `1px solid ${filter === f ? E.gold : E.border}`,
              fontFamily: EF.mono, fontSize: 11, letterSpacing:'0.18em', textTransform:'uppercase',
              cursor:'pointer', transition:'all 0.15s',
            }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{display:'flex', flexDirection:'column'}}>
          {filtered.map((a, i) => (
            <div key={i} style={{
              padding:'32px 0', borderBottom: `1px solid ${E.border}`,
              display:'grid', gridTemplateColumns:'120px 1fr', gap: 32, alignItems:'baseline',
              cursor:'pointer', transition:'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(8px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
              <EMono color={E.gold}>{a.dim}</EMono>
              <div>
                <EDisplay style={{fontSize: 28, color: E.ink, display:'block', marginBottom: 8}}>{a.title}</EDisplay>
                <div style={{fontSize: 16, color: E.inkSoft, lineHeight: 1.5, fontStyle:'italic', fontFamily: EF.serif}}>{a.blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </ESection>
    </>
  )
}

const EditorialStudio = () => (
  <>
    <ESection style={{paddingTop: 160, paddingBottom: 80}}>
      <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>studio</EMono>
      <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 48}}>
        the same operating principles<br/>
        <span style={{fontStyle:'italic', color: E.gold}}>in a different medium.</span>
      </h1>
      <div style={{maxWidth: 640, fontSize: 18, lineHeight: 1.65, color: E.inkSoft}}>
        we make things. art, characters, systems. the framework is not just for the boardroom. it shows up in everything we build.
      </div>
    </ESection>
    <ERule />
    <ESection style={{paddingTop: 64, paddingBottom: 160}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap: 32}}>
        {STUDIO_ITEMS.map((s, i) => (
          <div key={i} style={{padding: 40, background: E.bgSoft, border: `1px solid ${E.border}`}}>
            <EMono color={E.gold} style={{marginBottom: 24, display:'block'}}>0{i+1} · {s.cat.toLowerCase()}</EMono>
            <EDisplay style={{fontSize: 32, display:'block', marginBottom: 16}}>{s.title}</EDisplay>
            <div style={{fontSize: 16, color: E.inkSoft, lineHeight: 1.65, marginBottom: 24, fontFamily: EF.serif, fontStyle:'italic'}}>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </ESection>
  </>
)

const EditorialAbout = ({setActive}) => (
  <>
    <ESection style={{paddingTop: 160, paddingBottom: 80}}>
      <EMono color={E.gold} style={{marginBottom: 32, display:'block'}}>about</EMono>
      <h1 style={{fontFamily: EF.display, fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing:'-0.03em', marginBottom: 48}}>
        452b is built<br/>by <span style={{fontStyle:'italic', color: E.gold}}>operators.</span>
      </h1>
      <div style={{maxWidth: 720, fontSize: 18, lineHeight: 1.65, color: E.inkSoft}}>
        the practice is led by og jones. the framework comes from the ground — companies actually scaled, money actually managed, decisions actually made under real load.
      </div>
    </ESection>
    <ERule />
    <ESection style={{paddingTop: 64, paddingBottom: 80}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 64}}>
        <div>
          <EMono color={E.inkFaint} style={{marginBottom: 32, display:'block'}}>credentials</EMono>
          <div style={{display:'flex', flexDirection:'column', gap: 24}}>
            {CREDS.map(([k, v]) => (
              <div key={k}>
                <EMono color={E.gold} style={{marginBottom: 6, display:'block'}}>{k}</EMono>
                <div style={{fontSize: 16, color: E.inkSoft, lineHeight: 1.5, fontFamily: EF.serif}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <EMono color={E.inkFaint} style={{marginBottom: 32, display:'block'}}>why this framework</EMono>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.inkSoft, marginBottom: 24, fontFamily: EF.serif}}>
            we didn't study leadership. we lived it. then we lost a lot of money, recovered, and rebuilt. and along the way we wrote about every step of it.
          </div>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.inkSoft, marginBottom: 24, fontFamily: EF.serif}}>
            most ceo advisory is built by people who studied frameworks. ours is built from the floor of an operating company under real load.
          </div>
          <div style={{fontSize: 18, lineHeight: 1.7, color: E.ink, fontFamily: EF.serif, fontStyle:'italic'}}>
            we've been the people in the chair. that's the difference.
          </div>
        </div>
      </div>
    </ESection>
    <ERule />
    <ESection style={{paddingTop: 80, paddingBottom: 160}}>
      <h2 style={{fontFamily: EF.display, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing:'-0.02em', marginBottom: 48, maxWidth: 800}}>
        if any of this <span style={{fontStyle:'italic', color: E.gold}}>resonates,</span><br/>
        the next step is the read.
      </h2>
      <div style={{display:'flex', gap: 16, flexWrap:'wrap'}}>
        <button onClick={() => setActive('diagnostic')} style={{
          padding:'20px 32px', background: E.gold, color: E.bg, border:'none',
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontWeight: 600,
        }}>
          take the operator read →
        </button>
        <a href="mailto:og@452b.io?subject=advisory inquiry" style={{
          padding:'20px 32px', background:'transparent', color: E.ink,
          border: `1px solid ${E.borderStrong}`,
          fontFamily: EF.mono, fontSize: 12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', textDecoration:'none',
        }}>
          email og →
        </a>
      </div>
    </ESection>
  </>
)

const EditorialFooter = () => (
  <footer style={{borderTop: `1px solid ${E.border}`, padding:'48px 32px'}}>
    <div style={{maxWidth: 1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap: 24}}>
      <EMono color={E.inkFaint}>452b · the ceo operating system</EMono>
      <EMono color={E.inkGhost}>state · signal · structure · sequence · language</EMono>
    </div>
  </footer>
)

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  const [active, setActive] = useState('home')
  // Persist theme choice across reloads
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('452b-theme') || 'broadsheet' } catch { return 'broadsheet' }
    }
    return 'broadsheet'
  })

  useEffect(() => {
    try { localStorage.setItem('452b-theme', theme) } catch {}
  }, [theme])

  useEffect(() => { window.scrollTo({top: 0, behavior: 'smooth'}) }, [active, theme])

  return (
    <>
      <ThemeSelector theme={theme} setTheme={setTheme} />
      {theme === 'broadsheet' && <BroadsheetApp active={active} setActive={setActive} />}
      {theme === 'terminal' && <TerminalApp active={active} setActive={setActive} />}
      {theme === 'editorial' && <EditorialApp active={active} setActive={setActive} />}
    </>
  )
}
