// Initialize jsPsych
const jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.get().localSave('csv', 'conjoint_experiment_data.csv');
  }
});

// Shortcut plugin names
const htmlButtonResponse = jsPsychHtmlButtonResponse;
const instructionsPlugin = jsPsychInstructions;

// Google Sheets Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyiQluiJnjimSa6sFg5WSXAsOy4EUYdC82DajoPUqWYt2pT2mt0QnrEeKiPv31UCcW/exec";

// Respondent ID
const respondent_id = "resp_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();

// Track chosen candidate for each task
const chosenCandidates = {};

// Send data to Google Sheets
function sendToGoogleSheet(data) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).catch(error => console.error("Error sending data:", error));
}

// Candidate attributes
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

// Generate all possible profiles
function generateProfiles() {
  const profiles = [];
  let id = 1;

  qualifications.forEach(q => {
    experiences.forEach(e => {
      scholarships.forEach(s => {
        volunteers.forEach(v => {
          let allowedPronouns = [];

          if (v === "Member at DU Queer Collective") {
            allowedPronouns = ["They/Them"];
          } else if (v === "Member at Equal Opportunity Cell") {
            allowedPronouns = ["He/Him", "She/Her"];
          }

          allowedPronouns.forEach(p => {
            profiles.push({
              profile_id: id,
              qualification: q,
              experience: e,
              scholarship: s,
              volunteer: v,
              pronouns: p
            });
            id++;
          });
        });
      });
    });
  });

  return profiles;
}

const allProfiles = generateProfiles();

// Shuffle function
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate tasks
function generateTasks(numTasks = 6) {
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

const conjointTasks = generateTasks(6);

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

// Welcome
const welcome = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <h2>Welcome</h2>
      <p>Thank you for taking part in this study. The aim of this study is to understand how decisions are made in the job market.</p>
      <p>You will be shown pairs of candidate profiles and you have to choose the one you think would be suitable for an admin assistant office job.</p>
      <p>For each pair, please choose one candidate and then rate the one you selected.</p>
    </div>
  `,
  choices: ["Continue"]
};

// Instructions
const instructions = {
  type: instructionsPlugin,
  pages: [
    `
    <div class="instructions-box">
      <h3>Instructions</h3>
      <p>In each task, you will see two candidate profiles side by side.</p>
      <p>After choosing a candidate in every task, rate only that candidate whom you selected.</p>
      <p>Read both carefully before responding.</p>
    </div>
    `,
    `
    <div class="instructions-box">
      <h3>Your task</h3>
      <p>First, choose which candidate you would select.</p>
      <p>Then, rate the selected candidate from 1 (Not suitable) to 7 (Extremely suitable).</p>
    </div>
    `
  ],
  show_clickable_nav: true
};

// Start
const practice = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <h3>Start</h3>
      <p>You are about to begin the main task.</p>
    </div>
  `,
  choices: ["Start"]
};

// Timeline
const timeline = [welcome, instructions, practice];

// Add tasks
conjointTasks.forEach(task => {
  const choiceTrial = {
    type: htmlButtonResponse,
    stimulus: `
      <div class="instructions-box">
        <h3>Task ${task.task_number}</h3>
        <p><strong>Which candidate would you choose?</strong></p>
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
      task_number: task.task_number,
      left_profile_id: task.profile_left.profile_id,
      right_profile_id: task.profile_right.profile_id,
      left_pronouns: task.profile_left.pronouns,
      right_pronouns: task.profile_right.pronouns,
      left_volunteer: task.profile_left.volunteer,
      right_volunteer: task.profile_right.volunteer
    },
    on_finish: function(data) {
      data.chosen_candidate = data.response === 0 ? "A" : "B";
      data.chosen_profile_id = data.response === 0
        ? task.profile_left.profile_id
        : task.profile_right.profile_id;

      chosenCandidates[task.task_number] = data.chosen_candidate;
      sendToGoogleSheet(data);
    }
  };

  const ratingTrial = {
    type: htmlButtonResponse,
    stimulus: function() {
      const chosen = chosenCandidates[task.task_number];

      let selectedProfile;
      let selectedLabel;

      if (chosen === "A") {
        selectedProfile = task.profile_left;
        selectedLabel = "Candidate A";
      } else {
        selectedProfile = task.profile_right;
        selectedLabel = "Candidate B";
      }

      return `
        <div class="instructions-box">
          <h3>Rate the selected candidate</h3>
          <div class="profile-container">
            ${renderProfile(selectedProfile, selectedLabel)}
          </div>
          <p>Choose a rating (1 = Not at all suitable, 7 = Extremely suitable)</p>
        </div>
      `;
    },
    choices: ["1", "2", "3", "4", "5", "6", "7"],
    data: {
      respondent_id: respondent_id,
      trial_type_custom: "rating",
      task_number: task.task_number,
      left_profile_id: task.profile_left.profile_id,
      right_profile_id: task.profile_right.profile_id
    },
    on_finish: function(data) {
      const chosen = chosenCandidates[task.task_number];
      data.chosen_candidate = chosen;
      data.rating = data.response + 1;

      sendToGoogleSheet(data);
    }
  };

  timeline.push(choiceTrial);
  timeline.push(ratingTrial);
});

// End
const endMessage = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <h2>Thank you</h2>
      <p>You have completed the study.</p>
    </div>
  `,
  choices: ["Finish"]
};

timeline.push(endMessage);

// Run
jsPsych.run(timeline);
