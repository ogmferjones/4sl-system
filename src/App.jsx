import React, { useState, useEffect, useMemo, useRef } from 'react'

// ============================================================
// 452b — THE OPERATOR'S DIAGNOSTIC
// 1890s broadsheet × 1985 phosphor terminal.
// ============================================================

// PALETTE
const C = {
  paper: '#f0e9d8',
  paperDark: '#e6dec9',
  paperShadow: '#d8cfb7',
  ink: '#1a1614',
  inkSoft: '#3d3631',
  inkFaint: '#6b5f53',
  inkGhost: '#9a8d7e',
  rule: '#1a1614',
  red: '#8a2818',
  // terminal
  black: '#0a0a0a',
  green: '#33ff66',
  greenDim: '#1f9c3e',
  amber: '#ffb000',
  amberDim: '#a06c00',
}

const F = {
  serif: "'IM Fell DW Pica', 'Cormorant Garamond', Georgia, serif",
  smallcaps: "'IM Fell English SC', serif",
  mono: "'VT323', 'Space Mono', 'Courier New', monospace",
  body: "'Cormorant Garamond', Georgia, serif",
}

// ============================================================
// DATA
// ============================================================

const DIMS = [
  {
    key: 'state',
    roman: 'I',
    label: 'state',
    sub: 'the operator',
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
    key: 'signal',
    roman: 'II',
    label: 'signal',
    sub: 'the read',
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
    key: 'structure',
    roman: 'III',
    label: 'structure',
    sub: 'the architecture',
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
    key: 'sequence',
    roman: 'IV',
    label: 'sequence',
    sub: 'the order',
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
    key: 'language',
    roman: 'V',
    label: 'language',
    sub: 'the layer over all four',
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
  state: 'YOUR OPERATOR IS THE BOTTLENECK. nothing downstream of you will improve until your state does. start here: protect the first 90 minutes of your day from input. the rest can be mapped in a 90-minute call.',
  signal: 'YOU ARE REACTING TO NOISE AS IF IT WERE THREAT. the work is not more discipline. it is separating real signal from corrupted signal. the rest can be mapped in a 90-minute call.',
  structure: 'YOUR ARCHITECTURE IS FIGHTING YOUR MISSION. people, reporting lines, or decision rights are misaligned. the fix is not more effort. it is structural redesign. the rest can be mapped in a 90-minute call.',
  sequence: 'YOU ARE RUNNING THE RIGHT PLAYS IN THE WRONG ORDER. you do not need new plays. you need to resequence. the rest can be mapped in a 90-minute call.',
  language: 'THE STORY YOU ARE TELLING YOURSELF IS SHAPING WHAT YOU SEE. until the story changes, the system cannot update. the rest can be mapped in a 90-minute call.',
}

// ============================================================
// PRIMITIVES — 1890s BROADSHEET
// ============================================================

const SC = ({children, style, ...rest}) => (
  <span style={{fontFamily: F.smallcaps, letterSpacing: '0.18em', ...style}} {...rest}>{children}</span>
)

const Rule = ({type='single', style}) => {
  const styles = {
    single: { borderTop: `1px solid ${C.rule}`, height: 0 },
    double: { borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`, height: 4 },
    triple: { borderTop: `3px double ${C.rule}`, height: 0 },
    thin: { borderTop: `1px solid ${C.inkFaint}`, height: 0 },
  }
  return <div style={{...styles[type], width:'100%', ...style}} />
}

const Ornament = ({style}) => (
  <div style={{textAlign:'center', fontFamily: F.smallcaps, fontSize: 18, color: C.ink, letterSpacing:'0.4em', margin:'8px 0', ...style}}>
    ❦ ❦ ❦
  </div>
)

const Section = ({children, style, id}) => (
  <section id={id} style={{padding:'80px 0', position:'relative', ...style}}>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>{children}</div>
  </section>
)

const NarrowSection = ({children, style, id}) => (
  <section id={id} style={{padding:'80px 0', position:'relative', ...style}}>
    <div style={{maxWidth: 680, margin:'0 auto', padding:'0 32px'}}>{children}</div>
  </section>
)

// ============================================================
// MASTHEAD (1890s newspaper-style header)
// ============================================================

const Masthead = ({active, setActive}) => (
  <header style={{borderBottom: `3px double ${C.rule}`, paddingTop: 28, paddingBottom: 20, background: C.paper}}>
    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      {/* TOP RULE */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily: F.smallcaps, fontSize: 11, letterSpacing:'0.2em', color: C.inkFaint, marginBottom: 12}}>
        <span>VOL. I · NO. 1</span>
        <span>EST. ANNO ⅯⅯⅩⅩⅥ</span>
        <span>OPERATOR'S USE</span>
      </div>

      <Rule type="single" style={{marginBottom: 16}} />

      {/* MASTHEAD */}
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.5em', color: C.inkFaint, marginBottom: 8}}>
          ✦ FOUR-FIFTY-TWO-B ✦
        </div>
        <button onClick={() => setActive('home')} style={{
          background:'none', border:'none', cursor:'pointer', padding:0,
          fontFamily: F.serif, fontSize: 'clamp(48px, 9vw, 92px)', fontWeight: 400,
          color: C.ink, letterSpacing:'-0.02em', lineHeight: 0.95,
          fontStyle:'italic',
        }}>
          452b
        </button>
        <div style={{fontFamily: F.smallcaps, fontSize: 13, letterSpacing:'0.32em', color: C.ink, marginTop: 12, marginBottom: 8}}>
          THE OPERATOR'S DIAGNOSTIC
        </div>
        <div style={{fontFamily: F.serif, fontSize: 14, fontStyle:'italic', color: C.inkSoft}}>
          a system for the man in the chair
        </div>
      </div>

      <Rule type="double" style={{marginTop: 20, marginBottom: 16}} />

      {/* NAV */}
      <nav style={{display:'flex', justifyContent:'center', gap: 36, flexWrap:'wrap'}}>
        {[
          {k:'home', l:'masthead'},
          {k:'4sl', l:'the framework'},
          {k:'diagnostic', l:'diagnostic ▸'},
          {k:'writing', l:'dispatches'},
          {k:'studio', l:'studio'},
          {k:'about', l:'colophon'},
        ].map(item => (
          <button key={item.k} onClick={() => setActive(item.k)} style={{
            background:'none', border:'none', cursor:'pointer', padding:'4px 0',
            fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.2em',
            color: active === item.k ? C.red : C.ink,
            borderBottom: active === item.k ? `1px solid ${C.red}` : '1px solid transparent',
            textTransform:'lowercase',
          }}>
            {item.l}
          </button>
        ))}
      </nav>
    </div>
  </header>
)

// ============================================================
// HOMEPAGE — 1890s broadsheet
// ============================================================

const Home = ({setActive}) => (
  <>
    {/* HERO HEADLINE */}
    <Section style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center', marginBottom: 32}}>
        <div style={{fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.4em', color: C.red, marginBottom: 24}}>
          ❦ A NEW PRACTICE ❦
        </div>
        <h1 style={{
          fontFamily: F.serif,
          fontSize: 'clamp(40px, 6.5vw, 76px)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          color: C.ink,
          marginBottom: 24,
        }}>
          most advisors begin<br/>
          with strategy.<br/>
          <span style={{fontStyle:'italic'}}>we begin with</span><br/>
          <span style={{fontStyle:'italic'}}>the operator.</span>
        </h1>
        <Ornament />
        <div style={{fontFamily: F.serif, fontSize: 22, fontStyle:'italic', lineHeight: 1.5, color: C.inkSoft, maxWidth: 620, margin:'24px auto 0'}}>
          every company is a reflection of the man running it.
          fix the man, the rest grows clearer.
        </div>
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="triple" />
    </div>

    {/* TWO-COLUMN INTRODUCTION */}
    <Section style={{paddingTop: 40}}>
      <div style={{textAlign:'center', marginBottom: 48}}>
        <SC style={{fontSize: 13, color: C.inkFaint}}>BEING A NOTICE TO PROSPECTIVE CLIENTS</SC>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap: 48,
        fontSize: 17, lineHeight: 1.65, color: C.ink, fontFamily: F.serif,
      }} className="two-col">
        <div className="drop-cap">
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
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="double" />
    </div>

    {/* THE FRAMEWORK CARD GRID — broadsheet column layout */}
    <Section>
      <div style={{textAlign:'center', marginBottom: 48}}>
        <SC style={{fontSize: 14, color: C.inkFaint, display:'block', marginBottom: 8}}>ARTICLE I.</SC>
        <h2 style={{fontFamily: F.serif, fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.1, letterSpacing:'-0.01em'}}>
          The Framework, in Four Parts
        </h2>
        <Ornament style={{marginTop: 16}}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 0, border:`1px solid ${C.rule}`}}>
        {DIMS.slice(0, 4).map((d, i) => (
          <button key={d.key} onClick={() => setActive('4sl')}
            style={{
              padding: 32, textAlign:'left', cursor:'pointer',
              background: C.paper, border: 'none',
              borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
              borderBottom: i < 2 ? `1px solid ${C.rule}` : 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.paperDark}
            onMouseLeave={e => e.currentTarget.style.background = C.paper}
          >
            <div style={{display:'flex', alignItems:'baseline', gap: 16, marginBottom: 12}}>
              <SC style={{fontSize: 18, color: C.red}}>{d.roman}.</SC>
              <span style={{fontFamily: F.serif, fontSize: 32, fontStyle:'italic', color: C.ink}}>{d.label}</span>
            </div>
            <SC style={{fontSize: 11, color: C.inkFaint, display:'block', marginBottom: 16}}>—— {d.sub} ——</SC>
            <div style={{fontFamily: F.serif, fontSize: 16, lineHeight: 1.5, color: C.inkSoft, fontStyle:'italic'}}>
              {d.blurb}
            </div>
          </button>
        ))}
      </div>

      <div style={{
        marginTop: 24, padding: '24px 32px',
        textAlign: 'center', fontFamily: F.serif, fontSize: 18, fontStyle:'italic', color: C.ink,
        borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`,
      }}>
        & a fifth dimension — <SC style={{fontStyle:'normal', fontSize: 14, color: C.red}}>LANGUAGE</SC> — being the layer that shapes how all four are interpreted.
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="triple" />
    </div>

    {/* TWO DOORS — newspaper classified style */}
    <Section>
      <div style={{textAlign:'center', marginBottom: 48}}>
        <SC style={{fontSize: 14, color: C.inkFaint, display:'block', marginBottom: 8}}>ARTICLE II.</SC>
        <h2 style={{fontFamily: F.serif, fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.1, letterSpacing:'-0.01em'}}>
          Of the Engagement.
        </h2>
        <Ornament style={{marginTop: 16}}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border: `1px solid ${C.rule}`, background: C.paper}}>
        {/* DOOR ONE */}
        <div style={{padding: 40, borderRight: `1px solid ${C.rule}`}}>
          <div style={{textAlign:'center', marginBottom: 24}}>
            <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 12}}>—— DOOR THE FIRST ——</SC>
            <div style={{fontFamily: F.serif, fontSize: 38, fontStyle:'italic', color: C.ink, lineHeight: 1.05}}>
              The Operator's Read
            </div>
            <div style={{fontFamily: F.smallcaps, fontSize: 13, color: C.inkFaint, marginTop: 12, letterSpacing:'0.2em'}}>
              FIVE THOUSAND DOLLARS · ONE SESSION
            </div>
          </div>
          <Rule type="thin" style={{marginBottom: 24}}/>
          <div style={{fontFamily: F.serif, fontSize: 16, lineHeight: 1.65, color: C.inkSoft, marginBottom: 20}}>
            A <i>ninety-minute diagnostic</i> conducted by O.G. Jones, followed by a five-page written read delivered within forty-eight hours. The dimension that is broken, the sequence to fix it, the next thirty days.
          </div>
          <div style={{fontFamily: F.serif, fontSize: 14, fontStyle:'italic', color: C.inkFaint, lineHeight: 1.6}}>
            No further commitment. No upsell. Should the read prove useful, you may return.
          </div>
        </div>

        {/* DOOR TWO */}
        <div style={{padding: 40, position:'relative'}}>
          <div style={{position:'absolute', top:-1, left:0, right:0, borderTop: `2px solid ${C.red}`}} />
          <div style={{textAlign:'center', marginBottom: 24}}>
            <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 12}}>—— DOOR THE SECOND ——</SC>
            <div style={{fontFamily: F.serif, fontSize: 38, fontStyle:'italic', color: C.ink, lineHeight: 1.05}}>
              The Quarterly
            </div>
            <div style={{fontFamily: F.smallcaps, fontSize: 13, color: C.inkFaint, marginTop: 12, letterSpacing:'0.2em'}}>
              THIRTY THOUSAND PER QUARTER · RENEWABLE
            </div>
          </div>
          <Rule type="thin" style={{marginBottom: 24}}/>
          <div style={{fontFamily: F.serif, fontSize: 16, lineHeight: 1.65, color: C.inkSoft, marginBottom: 20}}>
            <i>Twelve weeks of full engagement.</i> Bi-weekly deep sessions. Weekly check-ins with our partner. Access to our diagnostic system. Quarterly recalibration of the framework against your actual conditions.
          </div>
          <div style={{fontFamily: F.serif, fontSize: 14, fontStyle:'italic', color: C.inkFaint, lineHeight: 1.6}}>
            For operators ready to upgrade the entire system.
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{textAlign:'center', marginTop: 48}}>
        <button onClick={() => setActive('diagnostic')} style={{
          fontFamily: F.mono, fontSize: 16, letterSpacing:'0.2em',
          color: C.green, background: C.black,
          border: `2px solid ${C.green}`,
          padding:'16px 32px', cursor:'pointer',
          textShadow: `0 0 4px ${C.green}`,
          textTransform: 'uppercase',
        }}>
          {`> ENTER DIAGNOSTIC`}
        </button>
        <div style={{fontFamily: F.smallcaps, fontSize: 11, color: C.inkFaint, marginTop: 12, letterSpacing:'0.2em'}}>
          OR READ ON
        </div>
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="triple" />
    </div>

    {/* WHY US — one column with drop cap */}
    <NarrowSection>
      <div style={{textAlign:'center', marginBottom: 32}}>
        <SC style={{fontSize: 14, color: C.inkFaint, display:'block', marginBottom: 8}}>ARTICLE III.</SC>
        <h2 style={{fontFamily: F.serif, fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.1}}>
          Of the Practitioner.
        </h2>
        <Ornament style={{marginTop: 16}}/>
      </div>

      <div className="drop-cap" style={{fontFamily: F.serif, fontSize: 18, lineHeight: 1.7, color: C.ink, marginBottom: 24}}>
        We've been the people in the chair. Thirteen years scaling a manufacturing concern from $28m to $114m in revenue. Two hundred and fifty million managed institutionally. CFA charter. Columbia MBA. Duke. We did not study this work. We lived it. Then we lost a great deal, recovered, and rebuilt — and along the way, we wrote about every step.
      </div>

      <div style={{fontFamily: F.serif, fontSize: 18, lineHeight: 1.7, color: C.inkSoft, fontStyle:'italic', textAlign:'center', marginTop: 32}}>
        Most CEO advisory is built by people who studied frameworks.<br/>
        Ours is built from the floor of an operating company under real load.
      </div>

      <div style={{textAlign:'center', marginTop: 32}}>
        <button onClick={() => setActive('about')} style={{
          background:'none', border:'none', padding:0, cursor:'pointer',
          fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.2em', color: C.red,
          borderBottom: `1px solid ${C.red}`, paddingBottom: 2,
        }}>
          THE FULL COLOPHON →
        </button>
      </div>
    </NarrowSection>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="triple" />
    </div>

    {/* RANGE — proof of life */}
    <Section style={{paddingBottom: 80}}>
      <div style={{textAlign:'center', marginBottom: 48}}>
        <SC style={{fontSize: 14, color: C.inkFaint, display:'block', marginBottom: 8}}>ARTICLE IV.</SC>
        <h2 style={{fontFamily: F.serif, fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.1}}>
          Further Evidences.
        </h2>
        <Ornament style={{marginTop: 16}}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, border: `1px solid ${C.rule}`}}>
        <button onClick={() => setActive('writing')} style={{
          padding: 32, textAlign:'left', cursor:'pointer',
          background: C.paper, border: 'none', borderRight: `1px solid ${C.rule}`,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.paperDark}
        onMouseLeave={e => e.currentTarget.style.background = C.paper}>
          <SC style={{fontSize: 11, color: C.red, display:'block', marginBottom: 12}}>DISPATCHES</SC>
          <div style={{fontFamily: F.serif, fontSize: 28, fontStyle:'italic', color: C.ink, marginBottom: 12, lineHeight: 1.1}}>
            Fifty essays on operating under load
          </div>
          <div style={{fontFamily: F.serif, fontSize: 15, fontStyle:'italic', color: C.inkSoft, lineHeight: 1.5}}>
            The framework came from these. Each piece maps to a dimension. Read what you need.
          </div>
          <div style={{marginTop: 24, fontFamily: F.smallcaps, fontSize: 11, color: C.inkFaint, letterSpacing:'0.2em'}}>
            READ →
          </div>
        </button>

        <button onClick={() => setActive('studio')} style={{
          padding: 32, textAlign:'left', cursor:'pointer',
          background: C.paper, border: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.paperDark}
        onMouseLeave={e => e.currentTarget.style.background = C.paper}>
          <SC style={{fontSize: 11, color: C.red, display:'block', marginBottom: 12}}>STUDIO</SC>
          <div style={{fontFamily: F.serif, fontSize: 28, fontStyle:'italic', color: C.ink, marginBottom: 12, lineHeight: 1.1}}>
            Worn faded, soft gods, & sundry
          </div>
          <div style={{fontFamily: F.serif, fontSize: 15, fontStyle:'italic', color: C.inkSoft, lineHeight: 1.5}}>
            Art, characters, instruments, systems. The same operating principles in a different medium.
          </div>
          <div style={{marginTop: 24, fontFamily: F.smallcaps, fontSize: 11, color: C.inkFaint, letterSpacing:'0.2em'}}>
            SEE →
          </div>
        </button>
      </div>
    </Section>
  </>
)

// ============================================================
// FRAMEWORK PAGE
// ============================================================

const Framework = () => {
  const [active, setActive] = useState('state')
  const dim = DIMS.find(d => d.key === active)

  return (
    <>
      <Section style={{paddingTop: 60, paddingBottom: 40}}>
        <div style={{textAlign:'center'}}>
          <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 16, letterSpacing:'0.4em'}}>
            ❦ THE FRAMEWORK, EXPOUNDED ❦
          </SC>
          <h1 style={{
            fontFamily: F.serif, fontSize: 'clamp(56px, 9vw, 120px)',
            fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 0.95,
            marginBottom: 16, letterSpacing:'-0.02em',
          }}>
            4sl
          </h1>
          <Ornament />
          <div style={{
            fontFamily: F.serif, fontSize: 22, fontStyle:'italic',
            color: C.inkSoft, marginTop: 16, lineHeight: 1.5,
          }}>
            <span style={{color: C.ink}}>state</span> · <span style={{color: C.ink}}>signal</span> · <span style={{color: C.ink}}>structure</span> · <span style={{color: C.ink}}>sequence</span>
            <br/>
            <span style={{fontSize: 16, color: C.inkFaint}}>and language as the layer that shapes how all four are interpreted</span>
          </div>
        </div>
      </Section>

      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
        <Rule type="triple" />
      </div>

      <Section style={{paddingTop: 60}}>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap: 64}}>
          {/* INDEX */}
          <div style={{position:'sticky', top: 100, alignSelf:'start'}}>
            <SC style={{fontSize: 11, color: C.inkFaint, display:'block', marginBottom: 16}}>—— INDEX ——</SC>
            <div style={{display:'flex', flexDirection:'column'}}>
              {DIMS.map((d, i) => (
                <button key={d.key} onClick={() => setActive(d.key)} style={{
                  background:'none', border:'none', textAlign:'left',
                  padding:'10px 0', cursor:'pointer',
                  borderTop: i === 0 ? `1px solid ${C.rule}` : 'none',
                  borderBottom: `1px solid ${active === d.key ? C.rule : 'rgba(26,22,20,0.15)'}`,
                  display:'flex', alignItems:'baseline', gap: 12,
                }}>
                  <SC style={{fontSize: 11, color: active === d.key ? C.red : C.inkFaint, width: 24}}>{d.roman}.</SC>
                  <span style={{
                    fontFamily: F.serif, fontSize: 20, fontStyle:'italic',
                    color: active === d.key ? C.red : C.ink,
                  }}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DETAIL */}
          <div>
            <SC style={{fontSize: 11, color: C.red, display:'block', marginBottom: 16, letterSpacing:'0.3em'}}>
              {dim.roman}. — {dim.sub}
            </SC>
            <h2 style={{
              fontFamily: F.serif, fontSize: 'clamp(48px, 7vw, 84px)',
              fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1,
              marginBottom: 24, letterSpacing:'-0.02em',
            }}>
              {dim.label}.
            </h2>

            <Rule type="single" style={{marginBottom: 32}} />

            <div className="drop-cap" style={{
              fontFamily: F.serif, fontSize: 18, lineHeight: 1.7,
              color: C.ink, marginBottom: 32,
            }}>
              {dim.long}
            </div>

            <Rule type="double" style={{marginBottom: 32}} />

            <SC style={{fontSize: 11, color: C.inkFaint, display:'block', marginBottom: 12}}>
              —— THE DIAGNOSTIC QUESTION ——
            </SC>
            <div style={{
              fontFamily: F.serif, fontSize: 24, fontStyle:'italic',
              color: C.red, marginBottom: 40, lineHeight: 1.4,
              textAlign:'center',
              padding:'24px 16px',
              borderTop: `1px solid ${C.rule}`,
              borderBottom: `1px solid ${C.rule}`,
            }}>
              ❝ {dim.diagnostic} ❞
            </div>

            <SC style={{fontSize: 11, color: C.inkFaint, display:'block', marginBottom: 16}}>
              —— OPERATING PRINCIPLES ——
            </SC>
            <ol style={{listStyle:'none', padding: 0, margin: 0}}>
              {dim.examples.map((ex, i) => (
                <li key={i} style={{
                  display:'flex', gap: 20, marginBottom: 16,
                  paddingBottom: 16, borderBottom: `1px solid rgba(26,22,20,0.15)`,
                }}>
                  <SC style={{fontSize: 13, color: C.red, flexShrink: 0, paddingTop: 4}}>
                    {String.fromCharCode(945 + i)}.
                  </SC>
                  <div style={{
                    fontFamily: F.serif, fontSize: 18, fontStyle:'italic',
                    color: C.ink, lineHeight: 1.5,
                  }}>
                    {ex}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
        <Rule type="triple" />
      </div>

      {/* OPERATING RULE */}
      <NarrowSection style={{paddingBottom: 80}}>
        <div style={{textAlign:'center', marginBottom: 32}}>
          <SC style={{fontSize: 14, color: C.inkFaint, display:'block', marginBottom: 12}}>—— THE OPERATING RULE ——</SC>
        </div>
        <div style={{
          fontFamily: F.serif, fontSize: 22, lineHeight: 1.7,
          color: C.ink, textAlign:'center', fontStyle:'italic',
          padding:'32px 0',
          borderTop: `3px double ${C.rule}`,
          borderBottom: `3px double ${C.rule}`,
        }}>
          Read state first.<br/>
          Check signal before reacting.<br/>
          Inspect structure before optimizing.<br/>
          Sequence before executing.<br/>
          <span style={{color: C.red}}>Audit language throughout.</span>
        </div>
      </NarrowSection>
    </>
  )
}

// ============================================================
// DIAGNOSTIC — FULL TERMINAL MODE
// ============================================================

const Diagnostic = ({setActive}) => {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [bootText, setBootText] = useState([])

  // Boot sequence on mount
  useEffect(() => {
    if (step !== 0) return
    const lines = [
      '',
      '> 452B SYSTEMS DIAGNOSTIC v1.0',
      '> COPYRIGHT (C) 452b OPERATIONS',
      '> ',
      '> INITIALIZING...',
      '> LOADING FRAMEWORK MODULES...',
      '>   STATE.......OK',
      '>   SIGNAL......OK',
      '>   STRUCTURE...OK',
      '>   SEQUENCE....OK',
      '>   LANGUAGE....OK',
      '> ',
      '> DIAGNOSTIC READY.',
      '> 9 QUESTIONS · ESTIMATED TIME: 2 MINUTES',
      '> ',
      '> PRESS [BEGIN] TO PROCEED',
      '',
    ]
    let i = 0
    const interval = setInterval(() => {
      if (i >= lines.length) { clearInterval(interval); return }
      setBootText(prev => [...prev, lines[i]])
      i++
    }, 80)
    return () => clearInterval(interval)
  }, [step])

  const handleAnswer = (qIdx, score, tag) => {
    setAnswers(prev => ({...prev, [qIdx]: {score, tag}}))
    setTimeout(() => setStep(s => s + 1), 250)
  }

  const scores = useMemo(() => {
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

  const lowest = useMemo(() => {
    const entries = Object.entries(scores)
    if (entries.every(([_, v]) => v === 0)) return null
    return entries.reduce((min, cur) => cur[1] < min[1] ? cur : min)[0]
  }, [scores])

  // INTRO / BOOT
  if (step === 0) {
    return (
      <div className="terminal terminal-bg" style={{
        minHeight: 'calc(100vh - 280px)',
        padding:'48px 32px 80px',
        fontFamily: F.mono,
      }}>
        <div style={{maxWidth: 720, margin:'0 auto', fontSize: 22, lineHeight: 1.4}}>
          {bootText.map((line, i) => (
            <div key={i} style={{minHeight: '1.4em'}}>
              {line.startsWith('>   ') && line.includes('OK') ? (
                <span>
                  <span>{line.replace(/OK$/, '')}</span>
                  <span className="terminal-amber">OK</span>
                </span>
              ) : line.startsWith('> 9 QUESTIONS') ? (
                <span className="terminal-amber">{line}</span>
              ) : (
                line
              )}
            </div>
          ))}
          {bootText.length >= 16 && (
            <div style={{marginTop: 24}}>
              <button onClick={() => setStep(1)} style={{
                fontFamily: F.mono, fontSize: 22, letterSpacing:'0.1em',
                background: 'transparent', color: C.green,
                border: `2px solid ${C.green}`, padding:'8px 24px', cursor:'pointer',
                textShadow: `0 0 6px ${C.green}`,
              }}>
                {`[ BEGIN ]`}
              </button>
              <span className="cursor-only" style={{marginLeft: 12, color: C.green}}>█</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // QUESTIONS
  if (step >= 1 && step <= 9) {
    const qIdx = step - 1
    const q = QUESTIONS[qIdx]
    const selected = answers[qIdx]?.score
    return (
      <div className="terminal terminal-bg" style={{
        minHeight: 'calc(100vh - 280px)',
        padding:'48px 32px 80px',
        fontFamily: F.mono,
      }}>
        <div style={{maxWidth: 720, margin:'0 auto', fontSize: 22, lineHeight: 1.4}}>
          {/* HEADER BAR */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            paddingBottom: 12, marginBottom: 24,
            borderBottom: `1px solid ${C.greenDim}`,
          }}>
            <span style={{color: C.greenDim}}>{`> 452B DIAGNOSTIC`}</span>
            <span className="terminal-amber" style={{fontSize: 18}}>
              [ Q{String(step).padStart(2,'0')}/09 · {q.dim.toUpperCase()} ]
            </span>
          </div>

          {/* PROGRESS BAR (ascii style) */}
          <div style={{marginBottom: 32, fontSize: 18, color: C.greenDim}}>
            {'['}
            <span style={{color: C.green}}>{'█'.repeat(step)}</span>
            <span>{'░'.repeat(9 - step)}</span>
            {']'} {Math.round((step/9)*100)}%
          </div>

          {/* QUESTION */}
          <div style={{marginBottom: 32}}>
            <div style={{color: C.greenDim, fontSize: 18, marginBottom: 8}}>{`> QUERY:`}</div>
            <div style={{fontSize: 26, lineHeight: 1.4, color: C.green, paddingLeft: 16, borderLeft: `2px solid ${C.green}`}}>
              {q.q}
            </div>
          </div>

          {/* OPTIONS */}
          <div style={{marginBottom: 32}}>
            <div style={{color: C.greenDim, fontSize: 18, marginBottom: 12}}>{`> SELECT ONE:`}</div>
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i)
              const isSelected = selected === opt.s
              return (
                <button key={i} onClick={() => handleAnswer(qIdx, opt.s, opt.tag)} style={{
                  display:'block', width:'100%', textAlign:'left',
                  padding:'10px 16px', marginBottom: 4,
                  background: isSelected ? 'rgba(51,255,102,0.15)' : 'transparent',
                  color: C.green,
                  border: `1px solid ${isSelected ? C.green : 'transparent'}`,
                  fontFamily: F.mono, fontSize: 22, cursor:'pointer',
                  textShadow: `0 0 4px ${C.green}`,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(51,255,102,0.05)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="terminal-amber" style={{marginRight: 16}}>[{letter}]</span>
                  {opt.l}
                </button>
              )
            })}
          </div>

          {/* BACK */}
          {step > 1 && (
            <div style={{marginTop: 32, paddingTop: 16, borderTop: `1px solid ${C.greenDim}`}}>
              <button onClick={() => setStep(s => s - 1)} style={{
                background:'none', border:'none', cursor:'pointer',
                color: C.greenDim, fontFamily: F.mono, fontSize: 18,
              }}>
                {`< BACK`}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // RESULTS
  return (
    <div className="terminal terminal-bg" style={{
      minHeight: 'calc(100vh - 280px)',
      padding:'48px 32px 80px',
      fontFamily: F.mono,
    }}>
      <div style={{maxWidth: 720, margin:'0 auto', fontSize: 20, lineHeight: 1.4}}>
        <div style={{color: C.greenDim, marginBottom: 8}}>{`> DIAGNOSTIC COMPLETE.`}</div>
        <div style={{color: C.greenDim, marginBottom: 32}}>{`> RENDERING READ...`}</div>

        {/* PRIMARY ISSUE */}
        <div style={{
          padding: 24, marginBottom: 32,
          border: `2px solid ${C.amber}`, background:'rgba(255,176,0,0.05)',
        }}>
          <div className="terminal-amber" style={{fontSize: 16, marginBottom: 8}}>{`>> PRIMARY OPERATING ISSUE:`}</div>
          <div className="terminal-amber" style={{fontSize: 56, fontWeight: 'bold', textTransform:'uppercase', lineHeight: 1}}>
            {lowest}
          </div>
        </div>

        {/* SCORES — ASCII BAR CHART */}
        <div style={{marginBottom: 32}}>
          <div style={{color: C.greenDim, marginBottom: 16}}>{`> FIVE-AXIS READ:`}</div>
          {Object.entries(scores).map(([dim, score]) => {
            const filled = Math.round(score)
            const isLowest = dim === lowest
            const color = isLowest ? C.amber : C.green
            return (
              <div key={dim} style={{
                display:'flex', alignItems:'center', gap: 12, marginBottom: 6,
                color, textShadow: `0 0 4px ${color}`,
              }}>
                <span style={{width: 90, textTransform:'uppercase'}}>{dim}</span>
                <span>[</span>
                <span>{'█'.repeat(filled)}</span>
                <span style={{color: C.greenDim, textShadow:'none'}}>{'░'.repeat(10 - filled)}</span>
                <span>]</span>
                <span style={{width: 50, textAlign:'right'}}>{score.toFixed(1)}</span>
              </div>
            )
          })}
        </div>

        {/* THE READ */}
        <div style={{
          padding: 24, marginBottom: 32,
          border: `1px solid ${C.green}`,
        }}>
          <div style={{color: C.greenDim, marginBottom: 12}}>{`>> THE READ:`}</div>
          <div style={{fontSize: 22, lineHeight: 1.5, color: C.green}}>
            {READS[lowest]}
          </div>
        </div>

        {/* CTA */}
        <div style={{marginTop: 32}}>
          <div style={{color: C.greenDim, marginBottom: 12}}>{`> NEXT ACTION:`}</div>
          <a href="mailto:og@452b.io?subject=the operator read" style={{
            display:'inline-block', padding:'12px 24px', marginBottom: 12,
            background: C.green, color: C.black,
            fontFamily: F.mono, fontSize: 22, fontWeight:'bold',
            textDecoration:'none', letterSpacing:'0.05em',
          }}>
            {`[ BOOK THE OPERATOR READ — $5,000 ]`}
          </a>
        </div>

        <div style={{marginTop: 32, color: C.greenDim, fontSize: 18}}>
          {`> THIS READ IS YOURS. USE IT HOWEVER YOU WANT.`}<br/>
          {`> IF IT LANDED, YOU KNOW WHERE TO FIND US.`}
        </div>

        <div style={{marginTop: 24}}>
          <button onClick={() => { setStep(0); setAnswers({}); setBootText([]) }} style={{
            background:'none', border: `1px solid ${C.greenDim}`, padding:'8px 16px',
            color: C.greenDim, fontFamily: F.mono, fontSize: 18, cursor:'pointer',
          }}>
            {`[ RETAKE ]`}
          </button>
          <span className="cursor-only" style={{marginLeft: 12, color: C.green}}>█</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// WRITING — broadsheet article index
// ============================================================

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

const Writing = () => {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.dim === filter)

  return (
    <>
      <Section style={{paddingTop: 60, paddingBottom: 40}}>
        <div style={{textAlign:'center'}}>
          <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 16, letterSpacing:'0.4em'}}>
            ❦ DISPATCHES ❦
          </SC>
          <h1 style={{
            fontFamily: F.serif, fontSize: 'clamp(40px, 6.5vw, 76px)',
            fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.05,
            letterSpacing:'-0.01em',
          }}>
            the framework<br/>came from these.
          </h1>
          <Ornament />
          <div style={{fontFamily: F.serif, fontSize: 18, fontStyle:'italic', color: C.inkSoft, maxWidth: 540, margin:'24px auto 0', lineHeight: 1.6}}>
            Fifty essays on operating under load. Each maps to a dimension of the framework. Read what you need.
          </div>
        </div>
      </Section>

      <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
        <Rule type="double" />
      </div>

      <Section style={{paddingTop: 40}}>
        {/* FILTER */}
        <div style={{display:'flex', gap: 8, marginBottom: 32, flexWrap:'wrap', justifyContent:'center'}}>
          {['all', 'state', 'signal', 'structure', 'sequence', 'language'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 16px',
              background: filter === f ? C.ink : 'transparent',
              color: filter === f ? C.paper : C.ink,
              border: `1px solid ${C.rule}`,
              fontFamily: F.smallcaps, fontSize: 11, letterSpacing:'0.2em',
              cursor:'pointer',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* ARTICLES — broadsheet listing */}
        <div>
          {filtered.map((a, i) => (
            <article key={i} style={{
              padding:'24px 0',
              borderBottom: `1px solid ${C.rule}`,
              display:'grid', gridTemplateColumns:'120px 1fr 80px', gap: 24, alignItems:'baseline',
              cursor:'pointer',
            }}>
              <SC style={{fontSize: 11, color: C.red}}>{a.dim}</SC>
              <div>
                <div style={{
                  fontFamily: F.serif, fontSize: 26, fontStyle:'italic',
                  color: C.ink, lineHeight: 1.15, marginBottom: 6,
                }}>
                  {a.title}
                </div>
                <div style={{fontFamily: F.serif, fontSize: 15, color: C.inkSoft, lineHeight: 1.5}}>
                  {a.blurb}
                </div>
              </div>
              <div style={{fontFamily: F.smallcaps, fontSize: 11, color: C.inkFaint, textAlign:'right', letterSpacing:'0.2em'}}>
                №.{String(i+1).padStart(2,'0')}
              </div>
            </article>
          ))}
        </div>

        <div style={{marginTop: 48, textAlign:'center'}}>
          <a href="https://www.linkedin.com/in/ogjones" style={{
            color: C.red, fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.2em',
            textDecoration:'none', borderBottom: `1px solid ${C.red}`, paddingBottom: 2,
          }}>
            FULL ARCHIVE ON LINKEDIN →
          </a>
        </div>
      </Section>
    </>
  )
}

// ============================================================
// STUDIO
// ============================================================

const Studio = () => (
  <>
    <Section style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center'}}>
        <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 16, letterSpacing:'0.4em'}}>
          ❦ STUDIO ❦
        </SC>
        <h1 style={{
          fontFamily: F.serif, fontSize: 'clamp(40px, 6.5vw, 76px)',
          fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.05,
          letterSpacing:'-0.01em',
        }}>
          the same principles,<br/>a different medium.
        </h1>
        <Ornament />
        <div style={{fontFamily: F.serif, fontSize: 18, fontStyle:'italic', color: C.inkSoft, maxWidth: 540, margin:'24px auto 0', lineHeight: 1.6}}>
          We make things. Art, characters, instruments. The framework holds because we live it across surfaces.
        </div>
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="double" />
    </div>

    <Section style={{paddingTop: 40, paddingBottom: 80}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 0, border:`1px solid ${C.rule}`}}>
        {[
          {n:'I', cat:'CANON', title:'worn faded', body:'Muted neons. Analog grain. Dissolving silhouettes. Kintsugi cracks. Impressionistic only, never photorealistic. An aesthetic system: rules locked, outputs varied.'},
          {n:'II', cat:'COLLECTION', title:'soft gods', body:'Sixty-nine worn bears. One master. A trait system layered over a fixed identity — the ceo problem in plush form. Demonstrates the structure principle.'},
          {n:'III', cat:'CHARACTER', title:'paper hands herbert', body:'The down bad bear. Hope, loss, timing, humor, presence. A daily practice in five-word systems. Character bible locked: every output reflects the constitution.'},
          {n:'IV', cat:'OTHER', title:'sundry pursuits', body:'Beekeeper. Brewer. Martial artist. Comic collector. Weather Alpha trading systems. A father-son app called Dingus HQ. The framework lives across surfaces.'},
        ].map((s, i) => (
          <div key={i} style={{
            padding: 32,
            borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : 'none',
            borderBottom: i < 2 ? `1px solid ${C.rule}` : 'none',
          }}>
            <div style={{display:'flex', alignItems:'baseline', gap: 16, marginBottom: 12}}>
              <SC style={{fontSize: 14, color: C.red}}>{s.n}.</SC>
              <SC style={{fontSize: 11, color: C.inkFaint}}>—— {s.cat} ——</SC>
            </div>
            <div style={{
              fontFamily: F.serif, fontSize: 30, fontStyle:'italic',
              color: C.ink, marginBottom: 12, lineHeight: 1.05,
            }}>
              {s.title}
            </div>
            <div style={{fontFamily: F.serif, fontSize: 15, lineHeight: 1.6, color: C.inkSoft}}>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </Section>
  </>
)

// ============================================================
// ABOUT (COLOPHON)
// ============================================================

const About = ({setActive}) => (
  <>
    <Section style={{paddingTop: 60, paddingBottom: 40}}>
      <div style={{textAlign:'center'}}>
        <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 16, letterSpacing:'0.4em'}}>
          ❦ COLOPHON ❦
        </SC>
        <h1 style={{
          fontFamily: F.serif, fontSize: 'clamp(40px, 6.5vw, 76px)',
          fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.05,
          letterSpacing:'-0.01em',
        }}>
          452b is built<br/>by operators.
        </h1>
        <Ornament />
        <div style={{fontFamily: F.serif, fontSize: 18, fontStyle:'italic', color: C.inkSoft, maxWidth: 580, margin:'24px auto 0', lineHeight: 1.6}}>
          The practice is led by O.G. Jones. The framework comes from the ground — companies actually scaled, money actually managed, decisions actually made under real load.
        </div>
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="double" />
    </div>

    <Section style={{paddingTop: 40}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 64}}>
        {/* CREDENTIALS */}
        <div>
          <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 24, letterSpacing:'0.3em'}}>—— CREDENTIALS ——</SC>
          <table style={{width:'100%', borderCollapse:'collapse', fontFamily: F.serif}}>
            <tbody>
              {[
                ['IFS', '$28m → $114m revenue · 13 years scaling a manufacturing concern'],
                ['Institutional', '$250m managed · SAC Capital'],
                ['CFA', 'Chartered Financial Analyst'],
                ['Columbia', 'MBA · Columbia Business School'],
                ['Duke', 'Undergraduate · Duke University'],
                ['452b', 'Managing Partner'],
                ['Writing', '50+ essays, public, on operating under load'],
              ].map(([k, v]) => (
                <tr key={k} style={{borderBottom: `1px solid ${C.rule}`}}>
                  <td style={{
                    padding:'12px 16px 12px 0',
                    verticalAlign:'top',
                    fontFamily: F.smallcaps, fontSize: 11, color: C.red,
                    letterSpacing:'0.2em', width: 130,
                  }}>{k}</td>
                  <td style={{padding:'12px 0', fontSize: 16, fontStyle:'italic', color: C.ink, lineHeight: 1.5}}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WHY */}
        <div>
          <SC style={{fontSize: 12, color: C.red, display:'block', marginBottom: 24, letterSpacing:'0.3em'}}>—— WHY THIS FRAMEWORK ——</SC>
          <div className="drop-cap" style={{fontFamily: F.serif, fontSize: 17, lineHeight: 1.7, color: C.ink, marginBottom: 24}}>
            We did not study leadership. We lived it. Then we lost a great deal, recovered, and rebuilt — and along the way we wrote about every step of it.
          </div>
          <div style={{fontFamily: F.serif, fontSize: 17, lineHeight: 1.7, color: C.inkSoft, marginBottom: 24, fontStyle:'italic'}}>
            Most CEO advisory is built by people who studied frameworks. Ours is built from the floor of an operating company under real load.
          </div>
          <div style={{
            fontFamily: F.serif, fontSize: 22, fontStyle:'italic',
            color: C.red, lineHeight: 1.4, paddingTop: 24,
            borderTop: `3px double ${C.rule}`, textAlign:'center',
          }}>
            ❝ We've been the people in the chair. <br/>That's the difference. ❞
          </div>
        </div>
      </div>
    </Section>

    <div style={{maxWidth: 920, margin:'0 auto', padding:'0 32px'}}>
      <Rule type="triple" />
    </div>

    {/* CTA */}
    <NarrowSection style={{paddingBottom: 80, textAlign:'center'}}>
      <h2 style={{
        fontFamily: F.serif, fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: 400, fontStyle:'italic', color: C.ink, lineHeight: 1.2,
        marginBottom: 32,
      }}>
        if any of this resonates,<br/>the next step is the read.
      </h2>
      <button onClick={() => setActive('diagnostic')} style={{
        fontFamily: F.mono, fontSize: 16, letterSpacing:'0.15em',
        color: C.green, background: C.black,
        border: `2px solid ${C.green}`,
        padding:'16px 32px', cursor:'pointer',
        textShadow: `0 0 4px ${C.green}`,
        marginRight: 16,
      }}>
        {`> ENTER DIAGNOSTIC`}
      </button>
      <a href="mailto:og@452b.io?subject=advisory inquiry" style={{
        fontFamily: F.smallcaps, fontSize: 12, letterSpacing:'0.2em',
        color: C.ink, textDecoration:'none',
        borderBottom: `1px solid ${C.ink}`, paddingBottom: 2,
        display:'inline-block', marginTop: 16,
      }}>
        OR EMAIL DIRECTLY →
      </a>
    </NarrowSection>
  </>
)

// ============================================================
// FOOTER
// ============================================================

const Footer = () => (
  <footer style={{borderTop: `3px double ${C.rule}`, padding:'40px 32px', background: C.paper}}>
    <div style={{maxWidth: 920, margin:'0 auto', textAlign:'center'}}>
      <SC style={{fontSize: 11, color: C.inkFaint, letterSpacing:'0.3em'}}>
        452b · the operator's diagnostic
      </SC>
      <Ornament style={{marginTop: 16, marginBottom: 16, fontSize: 14}}/>
      <div style={{fontFamily: F.smallcaps, fontSize: 11, color: C.inkGhost, letterSpacing:'0.3em'}}>
        STATE · SIGNAL · STRUCTURE · SEQUENCE · LANGUAGE
      </div>
      <div style={{fontFamily: F.serif, fontSize: 13, fontStyle:'italic', color: C.inkFaint, marginTop: 24}}>
        printed at the end of the workday · email: og@452b.io
      </div>
    </div>
  </footer>
)

// ============================================================
// APP
// ============================================================

export default function App() {
  const [active, setActive] = useState('home')
  useEffect(() => { window.scrollTo({top: 0, behavior: 'smooth'}) }, [active])

  return (
    <div style={{minHeight:'100vh', background: C.paper, color: C.ink}}>
      <Masthead active={active} setActive={setActive} />
      {active === 'home' && <Home setActive={setActive} />}
      {active === '4sl' && <Framework />}
      {active === 'diagnostic' && <Diagnostic setActive={setActive} />}
      {active === 'writing' && <Writing />}
      {active === 'studio' && <Studio />}
      {active === 'about' && <About setActive={setActive} />}
      <Footer />
    </div>
  )
}
