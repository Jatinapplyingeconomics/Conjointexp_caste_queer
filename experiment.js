const jsPsych = initJsPsych({
  override_safe_mode: true
});

const htmlButtonResponse = jsPsychHtmlButtonResponse;
const surveyHtmlForm = jsPsychSurveyHtmlForm;

const respondent_id = "resp_" + Math.random().toString(36).substring(2, 10);

// ================= ATTRIBUTES =================

const ATTRIBUTES = {
  qualification: [
    "BA at Delhi University",
    "BA at SOL Open University"
  ],
  experience: [
    "2 years full-time",
    "3 years full-time"
  ],
  scholarship: [
    "Received national scholarship for scheduled caste (SC) students",
    "Received national scholarship for General category students"
  ]
};

function drawIdentityBundle() {
  const isQueer = Math.random() < 0.5;
  if (isQueer) {
    return {
      pronouns: "They/Them",
      volunteer: "Member at Queer/ LGBTQIA+ collective",
      identity_type: "queer"
    };
  } else {
    const pronoun = Math.random() < 0.5 ? "He/Him" : "She/Her";
    return {
      pronouns: pronoun,
      volunteer: "Member at Equal Opportunity Cell",
      identity_type: "straight"
    };
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProfile() {
  const identity = drawIdentityBundle();
  return {
    qualification: pickRandom(ATTRIBUTES.qualification),
    experience: pickRandom(ATTRIBUTES.experience),
    scholarship: pickRandom(ATTRIBUTES.scholarship),
    pronouns: identity.pronouns,
    volunteer: identity.volunteer,
    identity_type: identity.identity_type,
    caste_type: ""
  };
}

function labelProfile(profile) {
  profile.caste_type = profile.scholarship.includes("(SC)") ? "dalit" : "general";
  return profile;
}

// ================= ATTRIBUTE ORDER =================

const ATTRIBUTE_KEYS = ["pronouns", "qualification", "experience", "scholarship", "volunteer"];

const ATTRIBUTE_LABELS = {
  pronouns: "Pronouns",
  qualification: "Qualification",
  experience: "Experience",
  scholarship: "Scholarship",
  volunteer: "Volunteer"
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderProfileCard(profile, label, attributeOrder) {
  const rows = attributeOrder.map(key => `
    <li><strong>${ATTRIBUTE_LABELS[key]}:</strong> ${profile[key]}</li>
  `).join("");

  return `
    <div class="profile-card">
      <h3>${label}</h3>
      <ul>${rows}</ul>
    </div>
  `;
}

// ================= TASK GENERATION =================

const NUM_TASKS = 8;

function generateTask(taskNumber) {
  const left = labelProfile(generateProfile());
  const right = labelProfile(generateProfile());

  const attributeOrder = shuffleArray(ATTRIBUTE_KEYS);

  return { taskNumber, left, right, attributeOrder };
}

// ================= CONSENT =================

const consent1 = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <p>
        You will see pairs of candidate profiles. For each pair, choose who you think is
        <strong>more likely to be hired</strong> by a typical employer.
        There will be <strong>8 rounds</strong> followed by a few optional demographic questions.
      </p>
      <h3>Confidentiality</h3>
      <p>This survey is completely anonymous and is conducted for academic research only.
         Your responses cannot be traced back to you.</p>
    </div>
  `,
  choices: ["Continue"]
};

const consent2 = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <p>By clicking <strong>"I Agree"</strong> you confirm that you:</p>
      <ul style="text-align:left; max-width:500px; margin:0 auto;">
        <li>Are 18 years of age or older</li>
        <li>Understand that participation is voluntary</li>
        <li>Consent to your anonymised responses being used for research</li>
      </ul>
    </div>
  `,
  choices: ["I do not agree", "I Agree"],
  on_finish: (data) => {
    if (data.response === 0) {
      jsPsych.endExperiment("You declined to participate.");
    }
  }
};

// ================= TIMELINE =================

const timeline = [consent1, consent2];

// ================= TASK TRIALS =================

for (let t = 1; t <= NUM_TASKS; t++) {

  const taskTrial = {
    type: htmlButtonResponse,

    stimulus: function() {
      const task = generateTask(t);

      jsPsych.data.addProperties({ current_task: task });

      return `
        <div class="instructions-box">
          <h3>Task ${t} of ${NUM_TASKS}</h3>
          <p><strong>Which candidate is more likely to be hired?</strong></p>
        </div>

        <div class="profile-wrapper" style="display:flex; gap:20px;">
          <div style="flex:1;">
            ${renderProfileCard(task.left, "Candidate A", task.attributeOrder)}
          </div>
          <div style="flex:1;">
            ${renderProfileCard(task.right, "Candidate B", task.attributeOrder)}
          </div>
        </div>
      `;
    },

    choices: ["Choose A", "Choose B"],

    data: {
      respondent_id: respondent_id,
      task_number: t
    },

    on_finish: function(data) {
      const task = jsPsych.data.get().last(1).values()[0].current_task;

      data.choice = data.response;
      data.chosen = data.response === 0 ? "A" : "B";

      data.profile_A = JSON.stringify(task.left);
      data.profile_B = JSON.stringify(task.right);

      data.A_caste = task.left.caste_type;
      data.B_caste = task.right.caste_type;

      data.A_identity = task.left.identity_type;
      data.B_identity = task.right.identity_type;

      data.attr_order = task.attributeOrder.join(",");
    }
  };

  timeline.push(taskTrial);
}

// ================= DEMOGRAPHICS =================

timeline.push({
  type: surveyHtmlForm,
  preamble: `
    <div class="instructions-box">
      <h3>Optional Background Questions</h3>
      <p>These help us understand patterns across groups. All responses are optional.</p>
    </div>
  `,
  html: `
    <label>Gender</label><br>
    <select name="gender">
      <option value="">Prefer not to say</option>
      <option>Male</option>
      <option>Female</option>
      <option>Non-binary</option>
      <option>Gender queer</option>
    </select>

    <br><br>

    <label>Sexual Orientation</label><br>
    <select name="orientation">
      <option value="">Prefer not to say</option>
      <option>Heterosexual</option>
      <option>LGBTQIA+</option>
    </select>

    <br><br>

    <label>Education</label><br>
    <select name="education">
      <option value="">Prefer not to say</option>
      <option>Undergraduate</option>
      <option>Postgraduate</option>
      <option>PhD</option>
    </select>

    <br><br>

    <label>Profession</label><br>
    <select name="profession">
      <option value="">Prefer not to say</option>
      <option>Student</option>
      <option>Working</option>
      <option>Self-employed</option>
      <option>Unemployed</option>
    </select>

    <br><br>

    <label>Caste</label><br>
    <select name="caste">
      <option value="">Prefer not to say</option>
      <option>SC</option>
      <option>ST</option>
      <option>OBC</option>
      <option>General</option>
    </select>

    <br><br>

    <label>Are you involved in hiring?</label><br>
    <select name="hiring_experience">
      <option value="">Prefer not to say</option>
      <option>Yes</option>
      <option>No</option>
    </select>
  `,
  data: { respondent_id }
});

// ================= END =================

timeline.push({
  type: htmlButtonResponse,
  stimulus: `<p>Thank you for participating!</p>`,
  choices: ["Finish"]
});

jsPsych.run(timeline);
