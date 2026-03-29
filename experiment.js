const jsPsych = initJsPsych({
  override_safe_mode: true
});

const htmlButtonResponse = jsPsychHtmlButtonResponse;
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
    tasks.push({
      task_number: i + 1,
      left: shuffled[i * 2],
      right: shuffled[i * 2 + 1]
    });
  }

  return tasks;
}

const tasks = generateTasks();

// ================= CONSENT =================

const consent1 = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <p>
        You will see pairs of candidate profiles. Choose who is more likely to be hired.
        There will be 8 rounds followed by demographic questions.
      </p>

      <h3>Confidentiality</h3>
      <p>This survey is anonymous and for academic research only.</p>
    </div>
  `,
  choices: ["Continue"]
};

const consent2 = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <p>Do you agree to participate?</p>
    </div>
  `,
  choices: ["I do not agree", "I Agree"],
  on_finish: (data) => {
    if (data.response === 0) {
      jsPsych.endExperiment("You declined.");
    }
  }
};

// ================= TIMELINE =================

const timeline = [consent1, consent2];

// ================= TASKS =================

tasks.forEach(task => {

  timeline.push({
    type: htmlButtonResponse,

    stimulus: `
      <div class="instructions-box">
        <h3>Task ${task.task_number} of 8</h3>
        <p><strong>Which candidate is more likely to be hired?</strong></p>
      </div>

      <div class="profile-wrapper">

        <div class="profile-column">
          <div class="profile-card">
            <h3>Candidate A</h3>
            <ul>
              <li><strong>Pronouns:</strong> ${task.left.pronouns}</li>
              <li><strong>Qualification:</strong> ${task.left.qualification}</li>
              <li><strong>Experience:</strong> ${task.left.experience}</li>
              <li><strong>Scholarship:</strong> ${task.left.scholarship}</li>
              <li><strong>Volunteer:</strong> ${task.left.volunteer}</li>
            </ul>
          </div>
        </div>

        <div class="profile-column">
          <div class="profile-card">
            <h3>Candidate B</h3>
            <ul>
              <li><strong>Pronouns:</strong> ${task.right.pronouns}</li>
              <li><strong>Qualification:</strong> ${task.right.qualification}</li>
              <li><strong>Experience:</strong> ${task.right.experience}</li>
              <li><strong>Scholarship:</strong> ${task.right.scholarship}</li>
              <li><strong>Volunteer:</strong> ${task.right.volunteer}</li>
            </ul>
          </div>
        </div>

      </div>
    `,

    choices: ["Choose A", "Choose B"],

    data: {
      respondent_id: respondent_id,
      task_number: task.task_number
    },

    on_finish: function(data) {
      data.choice = data.response; // 0 = A, 1 = B
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

// ================= RUN =================

jsPsych.run(timeline);
