const jsPsych = initJsPsych({
  override_safe_mode: true
});

const htmlButtonResponse = jsPsychHtmlButtonResponse;
const instructionsPlugin = jsPsychInstructions;
const surveyHtmlForm = jsPsychSurveyHtmlForm;

const respondent_id = "resp_" + Math.random().toString(36).substring(2, 10);

// ================= ATTRIBUTES =================

const qualifications = [
  "BA at Delhi University",
  "BA at Indira Gandhi Open University"
];

const experiences = ["2 years full-time", "3 years full-time"];

const scholarships = [
  "Awardee of SC Scholarship",
  "General Category Scholarship"
];

const volunteers = [
  "Member at DU Queer Collective",
  "Member at Equal Opportunity Cell"
];

// ================= PROFILES =================

function generateProfiles() {
  const profiles = [];
  let id = 1;

  qualifications.forEach(q => {
    experiences.forEach(e => {
      scholarships.forEach(s => {
        volunteers.forEach(v => {

          let pronoun = (v === "Member at DU Queer Collective")
            ? "They/Them"
            : (Math.random() < 0.5 ? "He/Him" : "She/Her");

          profiles.push({
            profile_id: id++,
            qualification: q,
            experience: e,
            scholarship: s,
            volunteer: v,
            pronouns: pronoun
          });

        });
      });
    });
  });

  return profiles;
}

const allProfiles = generateProfiles();

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateTasks(n = 8) {
  const shuffled = shuffle([...allProfiles]);
  const tasks = [];

  for (let i = 0; i < n; i++) {
    let left = shuffled[i * 2];
    let right = shuffled[i * 2 + 1];
    tasks.push({ task_number: i + 1, left, right });
  }

  return tasks;
}

const tasks = generateTasks();

// ================= RENDER =================

function renderProfile(p, label, choiceIndex) {
  return `
    <div class="profile-column">
      <div class="profile-card">
        <h3>${label}</h3>
        <ul>
          <li><strong>Pronouns:</strong> ${p.pronouns}</li>
          <li><strong>Qualification:</strong> ${p.qualification}</li>
          <li><strong>Experience:</strong> ${p.experience}</li>
          <li><strong>Scholarship:</strong> ${p.scholarship}</li>
          <li><strong>Volunteer:</strong> ${p.volunteer}</li>
        </ul>
      </div>

      <button class="choice-btn" onclick="jsPsych.finishTrial({choice: ${choiceIndex}})">
        Choose ${label}
      </button>
    </div>
  `;
}

// ================= CONSENT =================

const consent1 = {
  type: htmlButtonResponse,
  stimulus: `
  <div class="instructions-box">
    <p>
    View a pair profiles (think of them as CV) in each rounds/tasks with different characteristics.
    There will be a total of 8 rounds/tasks with random profiles and characteristics.
    At last there will be some demographic questions to help us understand the study better.
    </p>

    <h3>Confidentiality and Data Protection</h3>
    <p>
    Please note that this is anonymous survey.
    The anonymised data will be used solely for academic research purposes.
    Your participation is voluntary.
    </p>
  </div>
  `,
  choices: ["Continue"]
};

const consent2 = {
  type: htmlButtonResponse,
  stimulus: `<div class="instructions-box"><p>Do you agree to participate?</p></div>`,
  choices: ["I do not agree", "I Agree"],
  on_finish: d => { if (d.response === 0) jsPsych.endExperiment("You declined."); }
};

// ================= TIMELINE =================

const timeline = [consent1, consent2];

// TASKS
tasks.forEach(task => {
  timeline.push({
    type: htmlButtonResponse,
    stimulus: `
      <div class="instructions-box">
        <h3>Task ${task.task_number} of 8</h3>
        <p><strong>Which candidate do you think is more likely to be hired between the two profiles below?</strong></p>
      </div>

      <div class="profile-wrapper">
        ${renderProfile(task.left, "Candidate A", 0)}
        ${renderProfile(task.right, "Candidate B", 1)}
      </div>
    `,
    choices: [],
    on_finish: function(data){
      data.respondent_id = respondent_id;
      data.task_number = task.task_number;
    }
  });
});

// ================= DEMOGRAPHICS =================

timeline.push({
  type: surveyHtmlForm,
  preamble: `<div class="instructions-box"><h3>Optional Questions</h3></div>`,
  html: `
    Gender:<br>
    <select name="gender">
      <option value="">Prefer not to say</option>
      <option>Male</option>
      <option>Female</option>
      <option>Non-binary</option>
      <option>Gender queer</option>
    </select><br><br>

    Sexual Orientation:<br>
    <select name="orientation">
      <option value="">Prefer not to say</option>
      <option>Heterosexual</option>
      <option>LGBTQIA+</option>
    </select><br><br>

    Education:<br>
    <select name="education">
      <option value="">Prefer not to say</option>
      <option>Never went to school</option>
      <option>10th passed</option>
      <option>12th passed</option>
      <option>Undergraduate</option>
      <option>Postgraduate</option>
      <option>PhD</option>
    </select><br><br>

    Profession:<br>
    <select name="profession">
      <option value="">Prefer not to say</option>
      <option>Student</option>
      <option>Working</option>
      <option>Self-employed</option>
      <option>Unemployed</option>
    </select><br><br>

    Caste:<br>
    <select name="caste">
      <option value="">Prefer not to say</option>
      <option>SC</option>
      <option>ST</option>
      <option>OBC</option>
      <option>General</option>
    </select>
  `
});

// Run
jsPsych.run(timeline);
