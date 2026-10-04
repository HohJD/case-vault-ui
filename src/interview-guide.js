// The whole MBB interview, beyond the case: what each part tests, the questions to expect, and a prep checklist.
// General guidance drawn from the introduction of Robert Mellon's “The Case Interview Workbook” (used with the
// owner's permission for non-case material) and written in Case Vault's own words. No cases from that book are used.
export const INTERVIEW_SOURCE = { title: 'The Case Interview Workbook (Robert Mellon, 2018), introduction', scope: 'General interview guidance only' }

export const INTERVIEW_PARTS = [
  {
    id: 'motivation', title: 'Motivation', tests: 'Whether you really want this job, and how your background leads to it.',
    about: [
      'Expect about three questions that get harder as they go. The first is meant to be easy so strong candidates build momentum.',
      'The second checks how well you have prepared beyond the obvious. The third may be blunt or negative, to see if you stay positive under pressure.',
    ],
    how: [
      'Have a 60-90 second story that links what you have done, why consulting is the next step, and why this firm in particular.',
      'Give specific reasons for the firm: people you met, practices or offices, projects you read about. Generic praise sounds unprepared.',
      'When a question is pointed, do not get defensive. Acknowledge it briefly and turn it toward what you bring.',
    ],
  },
  {
    id: 'experience', title: 'Personal experience', tests: 'How you have handled real challenges: leading, persuading, achieving and working with others.',
    about: [
      'You will be asked to describe specific moments in detail: the challenge, what you did, and what came of it.',
      'Leadership, influencing others and personal achievement are the most common themes, followed by team problems and difficult colleagues.',
    ],
    how: [
      'Prepare one or two stories for each theme, and know each one well enough to go two or three questions deeper.',
      'Tell it in order: the situation and what was at stake, the actions you took yourself, then the result, with a number if you have one.',
      'Say “I”, not “we”, for your part. The interviewer is assessing you, not the team.',
    ],
  },
  {
    id: 'case', title: 'Case questions', tests: 'How you structure an unfamiliar problem, work with numbers, and reach a recommendation.',
    about: [
      'This part takes by far the most preparation. It often starts with an estimate, such as sizing a market or counting something in a city, where you state assumptions and do mental maths.',
      'Then comes an open business problem: set out how you will tackle it, ask for the data you need, and finish with a summary and a recommendation.',
    ],
    how: [
      'For estimates, define the scope, write the equation before the numbers, and sanity-check the answer at human scale.',
      'For business cases, clarify the objective first, structure the problem around this client rather than a memorised template, and lead the analysis.',
      'Close with the answer first, then the numbers that support it, then the risks and next steps.',
    ],
    links: [['cases', 'Practise full cases'], ['maths', 'Brush up case maths'], ['frameworks', 'Drill frameworks']],
  },
  {
    id: 'questions', title: 'Your questions', tests: 'Whether you have done your homework and are genuinely curious about the work.',
    about: [
      'At the end you will be invited to ask your own questions. Having nothing to ask, or asking what a quick search would answer, leaves a weak last impression.',
    ],
    how: [
      'Prepare two or three questions that show you have researched the firm and want to understand the work, for example how projects are staffed or what the interviewer learned on a recent engagement.',
      'Ask about the interviewer’s own experience; people enjoy answering and you learn what the job is really like.',
    ],
  },
]

// Each item is something to prepare and rehearse out loud. Ticking it is the learner’s own record, synced like other progress.
export const INTERVIEW_CHECKLIST = [
  { id: 'why-consulting', part: 'motivation', label: 'Why consulting?' },
  { id: 'why-firm', part: 'motivation', label: 'Why this firm, with specific reasons' },
  { id: 'about-you', part: 'motivation', label: 'Tell us about yourself (60-90 seconds)' },
  { id: 'cv-walk', part: 'motivation', label: 'Walk us through your CV' },
  { id: 'strengths', part: 'motivation', label: 'Your strengths, each with an example' },
  { id: 'weakness', part: 'motivation', label: 'A real weakness and what you are doing about it' },
  { id: 'what-consultants-do', part: 'motivation', label: 'What do consultants actually do?' },
  { id: 'why-hire', part: 'motivation', label: 'Why should we hire you?' },
  { id: 'other-firms', part: 'motivation', label: 'Which other firms are you talking to, and why?' },
  { id: 'if-not-hired', part: 'motivation', label: 'What will you do if we do not hire you?' },
  { id: 'story-lead', part: 'experience', label: 'A time you led others' },
  { id: 'story-persuade', part: 'experience', label: 'A time you changed someone’s mind' },
  { id: 'story-achieve', part: 'experience', label: 'Your most significant personal achievement' },
  { id: 'story-team', part: 'experience', label: 'A time your team ran into problems, and what you did' },
  { id: 'story-difficult', part: 'experience', label: 'Working with someone you did not get along with' },
  { id: 'case-estimate', part: 'case', label: 'An estimate solved out loud in under five minutes' },
  { id: 'case-live', part: 'case', label: 'A full case given live by a partner, before seeing the answer' },
  { id: 'case-close', part: 'case', label: 'A 30-second recommendation: answer, evidence, risk' },
  { id: 'ask-1', part: 'questions', label: 'A question about how the firm works that research cannot answer' },
  { id: 'ask-2', part: 'questions', label: 'A question about the interviewer’s own experience' },
  { id: 'ask-3', part: 'questions', label: 'A back-up question in case yours get answered earlier' },
]

export const INTERVIEW_PREP = [
  'Top firms ask similar questions, so the interview is predictable. That rewards preparation, and it is how firms spot the candidates who are truly committed.',
  'Reading gets you ready for the motivation and experience parts; cases only improve with practice. Attempt every case before you look at the answer, ideally with a partner reading it to you.',
  'Spread practice over several weeks and come back to cases you have done. Revisiting is what makes the method stick, which is why cases here come back on a recall schedule.',
]
