// Initialise jsPsych
const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.get().localSave('csv', 'conjoint_experiment_data.csv');
  }
});

// Plugins
const htmlButtonResponse = jsPsychHtmlButtonResponse;
const instructionsPlugin = jsPsychInstructions;
const surveyHtmlForm = jsPsychSurveyHtmlForm;

// Google Sheets URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyiQluiJnjimSa6sFg5WSXAsOy4EUYdC82DajoPUqWYt2pT2mt0QnrEeKiPv31UCcW/exec";

// Respondent ID
const respondent_id = "resp_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();

// Send data
function sendToGoogleSheet(data) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).catch(error => console.error("Error:", error));
}

// Attributes
const qualifications = [
  "BA at Delhi University",
  "BA at Indira Gandhi Open University"
];

const experiences = ["2 years full-time", "3 years full-time"];

const scholarships = [
  "Awardee of National Scholarship (for SC/ST category students)",
  "Scholarship by the Ministry of Education (for general category)"
];

const volunteers = [
  "Member at DU Queer Collective",
  "Member at Equal Opportunity Cell"
];

// Generate profiles
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
            profile_id: id,
            qualification: q,
            experience: e,
            scholarship: s,
            volunteer: v,
            pronouns: pronoun
          });

          id++;
        });
      });
    });
  });

  return profiles;
}

const allProfiles = generateProfiles();

// Shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 8 tasks
function generateTasks(numTasks = 8) {
  const shuffled = shuffle(allProfiles);
  const tasks = [];

  for (let i = 0; i < numTasks; i++) {
    let left = shuffled[i * 2];
    let right = shuffled[i * 2 + 1];

    if (!left || !right) break;

    if (Math.random() < 0.5) {
      [left, right] = [right, left];
    }

    tasks.push({
      task_number: i + 1,
      profile_left: left,
      profile_right: right
    });
  }

  return tasks;
}

const conjointTasks = generateTasks(8);

// Render profile
function renderProfile(profile, label) {
  return `
    <div class="profile-card">
      <h3>${label}</h3>
      <ul>
        <li><strong>Pronouns:</strong> ${profile.pronouns}</li>
        <li><strong>Qualification:</strong> ${profile.qualification}</li>
        <li><strong>Experience:</strong> ${profile.experience}</li>
        <li><strong>Scholarship/Achievement:</strong> ${profile.scholarship}</li>
        <li><strong>Volunteer:</strong> ${profile.volunteer}</li>
      </ul>
    </div>
  `;
}

// ================= CONSENT =================

const consent_page_1 = {
  type: htmlButtonResponse,
  stimulus: `
  <div class="instructions-box">
    <h3>Purpose of the Study</h3>
    <p>You are invited to take part in research that studies the job market and decision making. The study involves viewing a series of candidate profiles and choosing between them.</p>

    <p>If you agree to participate, you will:</p>
    <ul>
      <li>View pairs of candidate profiles (think of them as CVs) in each round/task</li>
      <li>There will be a total of 8 rounds/tasks with randomly generated profiles and characteristics</li>
      <li>At the end, you will be asked a few optional demographic questions to help us better understand the results</li>
    </ul>

    <h3>Confidentiality and Data Protection</h3>
    <p>This is an anonymous survey. No personally identifying information will be collected.</p>
    <p>The anonymised data will be used solely for academic research purposes.</p>
    <p>Only aggregated results may be shared; no individual-level data will be made public.</p>

    <p>Your participation is entirely voluntary. You may withdraw at any time without giving a reason and without any consequences.</p>
  </div>
  `,
  choices: ["Continue"]
};

const consent_page_2 = {
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
  choices: ["I Agree", "I do not agree"],
  on_finish: function(data) {
    if (data.response === 1) {
      jsPsych.endExperiment("You chose not to participate. Thank you.");
    }
  }
};

// ================= TASK INSTRUCTIONS =================

const task_instructions = {
  type: instructionsPlugin,
  pages: [
    `
    <div class="instructions-box">
      <h3>Your Task</h3>
      <p>You will be shown profiles of candidates applying for a <strong>basic office administrative job role</strong>.</p>
      <p>Each profile contains information similar to a CV.</p>
    </div>
    `,
    `
    <div class="instructions-box">
      <h3>What you need to do</h3>
      <p>In each round, you will see <strong>two candidate profiles</strong>.</p>
      <p>Your task is to select the candidate who you think has a <strong>higher chance of being selected for the job</strong>.</p>
      <p>Please read both profiles carefully before making your choice.</p>
    </div>
    `
  ],
  show_clickable_nav: true
};

// Start
const start = {
  type: htmlButtonResponse,
  stimulus: `<div class="instructions-box"><p>You are about to begin.</p></div>`,
  choices: ["Start"]
};

// Timeline start
const timeline = [consent_page_1, consent_page_2, task_instructions, start];

// ================= TASKS =================

conjointTasks.forEach(task => {
  const choiceTrial = {
    type: htmlButtonResponse,
    stimulus: `
      <div class="instructions-box">
        <h3>Task ${task.task_number}</h3>
        <p><strong>Which candidate is more likely to be selected?</strong></p>
      </div>
      <div class="profile-container">
        ${renderProfile(task.profile_left, "Candidate A")}
        ${renderProfile(task.profile_right, "Candidate B")}
      </div>
    `,
    choices: ["Candidate A", "Candidate B"],
    data: {
      respondent_id: respondent_id,
      trial_type_custom: "choice",
      task_number: task.task_number
    },
    on_finish: function(data) {
      data.chosen_candidate = data.response === 0 ? "A" : "B";
      sendToGoogleSheet(data);
    }
  };

  timeline.push(choiceTrial);
});

// ================= DEMOGRAPHICS =================

const demographics = {
  type: surveyHtmlForm,
  preamble: `
    <div class="instructions-box">
      <h3>Demographic Questions (Optional)</h3>
      <p>The following questions are optional. Your responses will help us conduct better analysis.</p>
    </div>
  `,
  html: `
    <p>Gender:<br>
    <select name="gender">
      <option value="">Prefer not to say</option>
      <option>Male</option>
      <option>Female</option>
      <option>Non-binary</option>
      <option>Gender queer</option>
      <option>Other</option>
    </select></p>

    <p>Sexual Orientation:<br>
    <select name="sexual_orientation">
      <option value="">Prefer not to say</option>
      <option>Heterosexual</option>
      <option>Belong to LGBTQIA+ community</option>
    </select></p>

    <p>Qualification:<br>
    <select name="education">
      <option value="">Prefer not to say</option>
      <option>Never went to school</option>
      <option>10th passed</option>
      <option>12th passed</option>
      <option>Undergraduate</option>
      <option>Postgraduate</option>
      <option>PhD</option>
    </select></p>

    <p>Profession:<br>
    <select name="profession">
      <option value="">Prefer not to say</option>
      <option>Student</option>
      <option>Working</option>
      <option>Self-employed</option>
      <option>Unemployed (looking for job)</option>
    </select></p>

    <p>Which group do you belong to:<br>
    <select name="caste_group">
      <option value="">Prefer not to say</option>
      <option>Scheduled Caste (SC)</option>
      <option>Scheduled Tribe (ST)</option>
      <option>Other Backward Class (OBC)</option>
      <option>General</option>
    </select></p>
  `,
  button_label: "Submit",
  on_finish: function(data) {
    const responses = JSON.parse(data.response);
    Object.assign(data, responses);
    data.respondent_id = respondent_id;
    data.trial_type_custom = "demographics";

    sendToGoogleSheet(data);
  }
};

timeline.push(demographics);

// ================= END =================

const endMessage = {
  type: htmlButtonResponse,
  stimulus: `<div class="instructions-box"><h3>Thank you for participating!</h3></div>`,
  choices: ["Finish"]
};

timeline.push(endMessage);

// Run
jsPsych.run(timeline);
