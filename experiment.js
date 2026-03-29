// Initialize jsPsych
const jsPsych = initJsPsych({
  override_safe_mode: true,
  on_finish: function () {
    jsPsych.data.get().localSave('csv', 'data.csv');
  }
});

// Plugins
const htmlButtonResponse = jsPsychHtmlButtonResponse;
const instructionsPlugin = jsPsychInstructions;
const surveyHtmlForm = jsPsychSurveyHtmlForm;

// Respondent ID
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

// ================= PROFILE GENERATION =================

function generateProfiles() {
  const profiles = [];
  let id = 1;

  qualifications.forEach(q => {
    experiences.forEach(e => {
      scholarships.forEach(s => {
        volunteers.forEach(v => {

          let pronoun;

          if (v === "Member at DU Queer Collective") {
            pronoun = "They/Them";
          } else {
            pronoun = Math.random() < 0.5 ? "He/Him" : "She/Her";
          }

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

// Shuffle
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Generate tasks
function generateTasks(num = 8) {
  const shuffled = shuffle([...allProfiles]);
  const tasks = [];

  for (let i = 0; i < num; i++) {
    let left = shuffled[i * 2];
    let right = shuffled[i * 2 + 1];

    if (Math.random() < 0.5) [left, right] = [right, left];

    tasks.push({
      task_number: i + 1,
      profile_left: left,
      profile_right: right
    });
  }

  return tasks;
}

const tasks = generateTasks(8);

// Render profile
function renderProfile(p, label) {
  return `
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
  `;
}

// ================= CONSENT =================

const consent1 = {
  type: htmlButtonResponse,
  stimulus: `
  <div class="instructions-box">
    <h3>Purpose</h3>
    <p>This study examines hiring decisions for an admin office job.</p>
    <p>You will choose between candidates across 8 tasks.</p>

    <h3>Confidentiality</h3>
    <p>This is anonymous and for research only.</p>
  </div>
  `,
  choices: ["Continue"]
};

const consent2 = {
  type: htmlButtonResponse,
  stimulus: `
  <div class="instructions-box">
    <p><strong>By selecting “I Agree” below, you confirm that:</strong></p>
    <ul>
      <li>You have read and understood the information above</li>
      <li>You agree to participate in this study</li>
    </ul>
  </div>
  `,
  choices: ["I do not agree", "I Agree"],
  on_finish: function(data) {
    if (data.response === 0) {
      jsPsych.endExperiment("You chose not to participate.");
    }
  }
};

// ================= INSTRUCTIONS =================

const instructions = {
  type: instructionsPlugin,
  pages: [
    `<div class="instructions-box">
      <p>You will see two CVs.</p>
      <p>Select who is more likely to be hired.</p>
    </div>`
  ],
  show_clickable_nav: true
};

// ================= TIMELINE =================

const timeline = [consent1, consent2, instructions];

// Tasks
tasks.forEach(task => {
  timeline.push({
    type: htmlButtonResponse,
    stimulus: `
      <div class="instructions-box">
        <h3>Task ${task.task_number} of 8</h3>
        <p><strong>Which candidate according to you is more likely to be hired?</strong></p>
      </div>
      <div class="profile-container">
        ${renderProfile(task.profile_left, "Candidate A")}
        ${renderProfile(task.profile_right, "Candidate B")}
      </div>
    `,
    choices: ["Candidate A", "Candidate B"],
    data: {
      respondent_id: respondent_id,
      task_number: task.task_number
    }
  });
});

// ================= DEMOGRAPHICS =================

timeline.push({
  type: surveyHtmlForm,
  preamble: `<div class="instructions-box">
    <h3>Optional Questions</h3>
  </div>`,
  html: `
    Gender:<br>
    <select name="gender">
      <option value="">Prefer not to say</option>
      <option>Male</option>
      <option>Female</option>
      <option>Non-binary</option>
    </select><br><br>

    Sexual Orientation:<br>
    <select name="orientation">
      <option value="">Prefer not to say</option>
      <option>Heterosexual</option>
      <option>LGBTQIA+</option>
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
