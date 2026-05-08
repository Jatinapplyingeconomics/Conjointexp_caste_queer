// ================= LANGUAGE / TRANSLATIONS =================

let LANG = "en"; // default; set by language selection screen

const TRANSLATIONS = {
  en: {
    consent1_text: `
      <div class="instructions-box">
        <p>
          Suppose you work as an <strong>HR</strong> for a company. You have to recruit someone for an
          <strong>Office Admin Assistant</strong> role. In this form, you will see pairs of candidate profiles
          (CV/Resume). For each pair, choose the candidate you would like to give this job to.
          There will be <strong>8 rounds</strong> followed by a few optional background questions.
        </p>
        <h3>Confidentiality</h3>
        <p>This survey is completely anonymous and is conducted for academic research only.
           Your responses cannot be traced back to you. So please fill the form freely, without any judgement or hesitation.</p>
      </div>
    `,
    consent1_btn: ["Continue"],

    consent2_text: `
      <div class="instructions-box">
        <p>By clicking <strong>"I Agree"</strong> you confirm that you:</p>
        <ul style="text-align:left; max-width:500px; margin:0 auto;">
          <li>Are 18 years of age or older</li>
          <li>Understand that participation is voluntary</li>
          <li>Consent to your anonymised responses being used for research</li>
        </ul>
      </div>
    `,
    consent2_btns: ["I do not agree", "I Agree"],
    consent2_declined: "You declined to participate.",

    task_heading: (t, total) => `Task ${t} of ${total}`,
    task_question: "Which candidate is more likely to be hired?",
    candidate_A: "Candidate A",
    candidate_B: "Candidate B",
    choose_A: "Choose A",
    choose_B: "Choose B",

    demographics_preamble: `
      <div class="instructions-box">
        <h3>Optional Background Questions</h3>
        <p>These help us understand patterns across groups. All responses are optional.</p>
      </div>
    `,
    demo_html: `
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
    `,
    demo_submit: "Submit",

    end_text: `<p>Thank you for participating!</p>`,
    end_btn: ["Finish"]
  },

  hi: {
    consent1_text: `
      <div class="instructions-box">
        <p>
          मान लीजिए आप किसी कंपनी में <strong>HR</strong> के रूप में काम करते हैं। आपको
          <strong>Office Admin Assistant</strong> की भूमिका के लिए किसी एक व्यक्ति की भर्ती करनी है।
          इस form में, आपको हर round में 2 candidates के CV/Resume दिखाए जाएंगे। हर round में आपको
          उन दो candidates में से एक को चुनना है, जिसे आप यह job देना चाहेंगे।
          कुल <strong>8 rounds</strong> होंगे, जिसके बाद कुछ पृष्ठभूमिक सवाल पूछे जाएंगे।
        </p>
        <h3>गोपनीयता (Confidentiality)</h3>
        <p>यह survey पूरी तरह गोपनीय है और केवल अकादमिक शोध के लिए किया जा रहा है।
           आपके responses से हम यह पता नहीं लगा सकते कि कौन-सा response किस व्यक्ति ने भरा है।
           इसलिए बिना किसी judgement या झिझक के form भरें।</p>
      </div>
    `,
    consent1_btn: ["जारी रखें"],

    consent2_text: `
      <div class="instructions-box">
        <p><strong>"मैं सहमत हूँ"</strong> पर क्लिक करके आप पुष्टि करते हैं कि आप:</p>
        <ul style="text-align:left; max-width:500px; margin:0 auto;">
          <li>18 वर्ष या उससे अधिक आयु के हैं</li>
          <li>समझते हैं कि भागीदारी स्वैच्छिक है</li>
          <li>अपनी गोपनीय प्रतिक्रियाओं को अनुसंधान में उपयोग किए जाने की सहमति देते हैं</li>
        </ul>
      </div>
    `,
    consent2_btns: ["मैं सहमत नहीं हूँ", "मैं सहमत हूँ"],
    consent2_declined: "आपने भाग लेने से मना कर दिया।",

    task_heading: (t, total) => `कार्य ${t} / ${total}`,
    task_question: "किस उम्मीदवार को नौकरी मिलने की अधिक संभावना है?",
    candidate_A: "Candidate A",
    candidate_B: "Candidate B",
    choose_A: "A को चुनें",
    choose_B: "B को चुनें",

    demographics_preamble: `
      <div class="instructions-box">
        <h3>वैकल्पिक पृष्ठभूमि प्रश्न</h3>
        <p>ये हमें विभिन्न समूहों में पैटर्न समझने में मदद करते हैं। सभी उत्तर वैकल्पिक हैं।</p>
      </div>
    `,
    demo_html: `
      <label>लिंग</label><br>
      <select name="gender">
        <option value="">बताना नहीं चाहते</option>
        <option value="Male">पुरुष</option>
        <option value="Female">महिला</option>
        <option value="Non-binary">नॉन-बाइनरी</option>
        <option value="Gender queer">जेंडर क्वीयर</option>
      </select>
      <br><br>
      <label>यौन अभिविन्यास</label><br>
      <select name="orientation">
        <option value="">बताना नहीं चाहते</option>
        <option value="Heterosexual">विषमलैंगिक</option>
        <option value="LGBTQIA+">LGBTQIA+</option>
      </select>
      <br><br>
      <label>शिक्षा</label><br>
      <select name="education">
        <option value="">बताना नहीं चाहते</option>
        <option value="Undergraduate">स्नातक</option>
        <option value="Postgraduate">स्नातकोत्तर</option>
        <option value="PhD">पीएचडी</option>
      </select>
      <br><br>
      <label>पेशा</label><br>
      <select name="profession">
        <option value="">बताना नहीं चाहते</option>
        <option value="Student">छात्र</option>
        <option value="Working">कार्यरत</option>
        <option value="Self-employed">स्व-रोज़गार</option>
        <option value="Unemployed">बेरोज़गार</option>
      </select>
      <br><br>
      <label>जाति</label><br>
      <select name="caste">
        <option value="">बताना नहीं चाहते</option>
        <option>SC</option>
        <option>ST</option>
        <option>OBC</option>
        <option>General</option>
      </select>
    `,
    demo_submit: "जमा करें",

    end_text: `<p>भाग लेने के लिए धन्यवाद!</p>`,
    end_btn: ["समाप्त करें"]
  }
};

// Helper: get current translation
function T() { return TRANSLATIONS[LANG]; }

// ================= jsPsych INIT =================

const jsPsych = initJsPsych({
  override_safe_mode: true,
  on_finish: function() {
    const allTrials = jsPsych.data.get().values();

    // ---- Extract demographics from the survey-html-form trial ----
    const demoTrial = allTrials.find(t => t.trial_type === "survey-html-form");
    const demo = demoTrial && demoTrial.response ? demoTrial.response : {};

    // ---- Extract only task trials and stamp demographics + language onto each ----
    const taskRows = allTrials
      .filter(t => t.task_number !== undefined && t.trial_type === "html-button-response")
      .map(t => ({
        respondent_id:    t.respondent_id || "",
        language:         LANG,
        task_number:      t.task_number || "",
        chosen:           t.chosen || "",
        // Candidate A attributes
        A_qualification:  t.A_qualification || "",
        A_experience:     t.A_experience || "",
        A_scholarship:    t.A_scholarship || "",
        A_pronouns:       t.A_pronouns || "",
        A_volunteer:      t.A_volunteer || "",
        A_caste:          t.A_caste || "",
        A_identity:       t.A_identity || "",
        // Candidate B attributes
        B_qualification:  t.B_qualification || "",
        B_experience:     t.B_experience || "",
        B_scholarship:    t.B_scholarship || "",
        B_pronouns:       t.B_pronouns || "",
        B_volunteer:      t.B_volunteer || "",
        B_caste:          t.B_caste || "",
        B_identity:       t.B_identity || "",
        // Attribute display order
        attr_order:       t.attr_order || "",
        // Respondent demographics stamped on every row
        resp_gender:      demo.gender || "",
        resp_orientation: demo.orientation || "",
        resp_education:   demo.education || "",
        resp_profession:  demo.profession || "",
        resp_caste:       demo.caste || ""
      }));

    fetch("https://script.google.com/macros/s/AKfycbxJWjq0rerGIiK69uriAyPp8A6wsapeLrdpKkGHkA2gI9A7W_CtkqYMhAbBknHT0x7R/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(taskRows),
      headers: {
        "Content-Type": "text/plain"
      }
    })
    .catch(error => console.error("Submission error:", error));
  }
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
    experience:    pickRandom(ATTRIBUTES.experience),
    scholarship:   pickRandom(ATTRIBUTES.scholarship),
    pronouns:      identity.pronouns,
    volunteer:     identity.volunteer,
    identity_type: identity.identity_type,
    caste_type:    ""
  };
}

function labelProfile(profile) {
  profile.caste_type = profile.scholarship.includes("(SC)") ? "dalit" : "general";
  return profile;
}

// ================= ATTRIBUTE ORDER =================

const ATTRIBUTE_KEYS = ["pronouns", "qualification", "experience", "scholarship", "volunteer"];

const ATTRIBUTE_LABELS = {
  pronouns:      "Pronouns",
  qualification: "Qualification",
  experience:    "Experience",
  scholarship:   "Scholarship",
  volunteer:     "Volunteer"
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
  const left  = labelProfile(generateProfile());
  const right = labelProfile(generateProfile());
  const attributeOrder = shuffleArray(ATTRIBUTE_KEYS);
  return { taskNumber, left, right, attributeOrder };
}

// ================= LANGUAGE SELECTION =================

const languageSelect = {
  type: htmlButtonResponse,
  stimulus: `
    <div class="instructions-box">
      <h2>Select Language / भाषा चुनें</h2>
      <p style="font-size:15px; color:#666;">Please select the language you prefer for this survey.</p>
    </div>
  `,
  choices: ["English", "हिन्दी"],
  on_finish: function(data) {
    LANG = data.response === 0 ? "en" : "hi";
    jsPsych.data.addProperties({ language: LANG });
  }
};

// ================= CONSENT =================

const consent1 = {
  type: htmlButtonResponse,
  stimulus: function() { return T().consent1_text; },
  choices: function() { return T().consent1_btn; }
};

const consent2 = {
  type: htmlButtonResponse,
  stimulus: function() { return T().consent2_text; },
  choices: function() { return T().consent2_btns; },
  on_finish: function(data) {
    if (data.response === 0) {
      jsPsych.endExperiment(T().consent2_declined);
    }
  }
};

// ================= TIMELINE =================

const timeline = [languageSelect, consent1, consent2];

// ================= TASK TRIALS =================

for (let t = 1; t <= NUM_TASKS; t++) {
  const taskTrial = {
    type: htmlButtonResponse,
    stimulus: function() {
      const task = generateTask(t);
      jsPsych.data.addProperties({ current_task: task });
      const tr = T();
      return `
        <div class="instructions-box">
          <h3>${tr.task_heading(t, NUM_TASKS)}</h3>
          <p><strong>${tr.task_question}</strong></p>
        </div>
        <div class="profile-wrapper" style="display:flex; gap:20px;">
          <div style="flex:1;">
            ${renderProfileCard(task.left, tr.candidate_A, task.attributeOrder)}
          </div>
          <div style="flex:1;">
            ${renderProfileCard(task.right, tr.candidate_B, task.attributeOrder)}
          </div>
        </div>
      `;
    },
    choices: function() { return [T().choose_A, T().choose_B]; },
    data: {
      respondent_id: respondent_id,
      task_number:   t
    },
    on_finish: function(data) {
      const task = jsPsych.data.get().last(1).values()[0].current_task;

      data.chosen = data.response === 0 ? "A" : "B";

      // Store each attribute flat — no JSON blobs
      data.A_qualification = task.left.qualification;
      data.A_experience    = task.left.experience;
      data.A_scholarship   = task.left.scholarship;
      data.A_pronouns      = task.left.pronouns;
      data.A_volunteer     = task.left.volunteer;
      data.A_caste         = task.left.caste_type;
      data.A_identity      = task.left.identity_type;

      data.B_qualification = task.right.qualification;
      data.B_experience    = task.right.experience;
      data.B_scholarship   = task.right.scholarship;
      data.B_pronouns      = task.right.pronouns;
      data.B_volunteer     = task.right.volunteer;
      data.B_caste         = task.right.caste_type;
      data.B_identity      = task.right.identity_type;

      data.attr_order = task.attributeOrder.join(",");
    }
  };
  timeline.push(taskTrial);
}

// ================= DEMOGRAPHICS =================

timeline.push({
  type: surveyHtmlForm,
  preamble:     function() { return T().demographics_preamble; },
  html:         function() { return T().demo_html; },
  button_label: function() { return T().demo_submit; },
  data: { respondent_id }
});

// ================= END =================

timeline.push({
  type: htmlButtonResponse,
  stimulus: function() { return T().end_text; },
  choices:  function() { return T().end_btn; }
});

jsPsych.run(timeline);
