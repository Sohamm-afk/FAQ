const faqData = [
  {
    id: "about",
    name: "About MetaSkillGroup",
    questions: [
      ["what-is-msg", "What is MetaSkillGroup?", "MetaSkillGroup is a software development company based in Dehradun. It offers internships where students can build development skills through practical projects."],
      ["what-does-msg-do", "What services does MetaSkillGroup provide?", "MetaSkillGroup helps students gain practical development experience through internships, projects and ready-to-use templates."],
      ["where-is-msg", "Where is MetaSkillGroup located?", "MetaSkillGroup is based in Dehradun, Uttarakhand, India, and works with a remote-first team."],
      ["who-founded-msg", "Who founded MetaSkillGroup?", "MetaSkillGroup was founded by Ankul Agarwal, who has experience in web development."]
    ]
  },
  {
    id: "internships",
    name: "Internships",
    questions: [
      ["internship-available", "Does MetaSkillGroup offer internships?", "Yes. MetaSkillGroup offers a three-month online developer internship for college students, recent graduates and self-taught developers."],
      ["internship-free", "Is the internship free?", "The Unpaid Internship is free. The Mentored Internship is an optional ₹749 upgrade, and the Paid Internship offers a stipend to eligible interns."],
      ["internship-tracks", "Which internship tracks are available?", "You can choose from Frontend Development, Backend Development, Full Stack Web Development, MERN Stack, MEAN Stack and Python Development."],
      ["internship-remote", "Can I complete the internship from home?", "Absolutely. The internship is conducted online, so you can complete your assigned work from home."]
    ]
  },
  {
    id: "application",
    name: "Application & Exam",
    questions: [
      ["how-to-apply", "How can I apply for an internship?", "To apply, open the Careers page, select the internship track you’re interested in and fill out the application form."],
      ["who-can-apply", "Who is eligible to apply?", "College students in any year, recent graduates and self-taught developers can apply. It helps to have some basic knowledge of your chosen track."],
      ["entrance-exam", "Is there an entrance exam?", "Yes. The entrance exam has 50 questions and takes about 45 minutes. Your first attempt is free."],
      ["exam-device", "Can I take the exam on my phone?", "No. You’ll need a laptop or desktop with a working webcam. The exam also requires fullscreen mode and screen sharing."]
    ]
  },
  {
    id: "projects",
    name: "Projects & Benefits",
    questions: [
      ["intern-projects", "What kind of projects will I work on?", "During the internship, you’ll work on development tasks related to your chosen track. These may include building websites, creating UI components or working with APIs."],
      ["client-projects", "Will interns work on client projects?", "No. Client projects are handled by experienced developers. Interns work on MetaSkillGroup’s own platform and products."],
      ["certificate", "Will I receive an internship certificate?", "Yes. Certificates can be verified with a QR code. Unpaid interns need an average task rating of at least 3.0 out of 5 to receive one."],
      ["stipend", "Can I earn a stipend during the internship?", "The Paid Internship offers ₹500–₹3,000 per approved project. To qualify, you need to score at least 75% in the entrance exam."]
    ]
  },
  {
    id: "support",
    name: "Account & Support",
    questions: [
      ["create-account", "How do I create an account?", "Head over to the MetaSkillGroup website and click Sign Up. Enter the required details to create your account."],
      ["forgot-password", "What if I forget my password?", "Forgot your password? Click the Forgot Password option on the login page and follow the steps to reset it."],
      ["marketplace", "What is the MetaSkillGroup marketplace?", "It’s a place to explore ready-made source-code projects, website templates and reusable UI components."],
      ["contact-support", "How can I contact MetaSkillGroup?", "You can reach the support team at support@metaskillgroup.com or call +91 87088 67560."]
    ]
  }
];

const $ = selector => document.querySelector(selector);
const categoryList = $("#category-list");
const faqGroups = $("#faq-groups");
const helpfulList = $("#most-helpful-list");
const notice = $("#app-notice");

// Keep feedback saved when the page is refreshed.
const storageKey = "faq-feedback-v1";
let votes = {};

function showNotice(message = "") {
  notice.textContent = message;
  notice.hidden = !message;
}

try {
  const savedVotes = localStorage.getItem(storageKey);
  if (savedVotes) {
    votes = JSON.parse(savedVotes);
    if (!votes || typeof votes !== "object" || Array.isArray(votes)) {
      throw new Error("Saved feedback has an invalid format.");
    }
  }
} catch (error) {
  console.error("Could not load saved feedback.", error);
  showNotice("Could not load saved feedback.");
}

function saveVotes() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(votes));
    showNotice();
    return true;
  } catch (error) {
    console.error("Could not save feedback.", error);
    showNotice("Could not save feedback. Check your browser’s storage settings.");
    return false;
  }
}

function getVote(questionId) {
  const vote = votes[questionId];
  return vote?.vote === "up" || vote?.vote === "down" ? vote : null;
}

function scrollToElement(element) {
  element.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
}

function setActiveCategory(categoryId) {
  categoryList.querySelectorAll("[data-category-link]").forEach(link => {
    if (link.dataset.categoryLink === categoryId) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function renderCategoryLinks() {
  categoryList.innerHTML = faqData.map((category, index) => `
    <li>
      <a href="#${category.id}" class="category-link"
         data-category-link="${category.id}" ${index === 0 ? 'aria-current="true"' : ""}>
        <span>${category.name}</span>
        <span class="category-count">${category.questions.length}</span>
      </a>
    </li>
  `).join("");
}

function renderQuestion([questionId, question, answer]) {
  return `
    <details class="faq-item" id="question-${questionId}">
      <summary class="faq-question">
        <span>${question}</span>
        <i class="fa-solid fa-chevron-down faq-chevron" aria-hidden="true"></i>
      </summary>
      <div class="faq-answer">
        <p>${answer}</p>
        <div class="feedback" data-question-id="${questionId}">
          <p class="feedback-prompt">Was this helpful?</p>
          <button class="vote-button" type="button" data-vote="up"
            aria-pressed="false" aria-label="Helpful">
            <i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>
          </button>
          <button class="vote-button" type="button" data-vote="down"
            aria-pressed="false" aria-label="Not helpful">
            <i class="fa-solid fa-thumbs-down" aria-hidden="true"></i>
          </button>
          <span class="feedback-status" aria-live="polite"></span>
          <div class="feedback-followup" hidden>
            <label for="missing-${questionId}">What was missing?</label>
            <textarea id="missing-${questionId}" maxlength="280"
              placeholder="Tell us what could be improved."></textarea>
          </div>
        </div>
      </div>
    </details>
  `;
}

function renderCategoryGroup(category) {
  return `
    <section class="faq-group" id="${category.id}" data-category="${category.id}"
      aria-labelledby="heading-${category.id}">
      <h2 id="heading-${category.id}">${category.name}</h2>
      <div class="faq-items">${category.questions.map(renderQuestion).join("")}</div>
    </section>
  `;
}

function updateFeedback(questionId, saved = true) {
  const feedback = faqGroups.querySelector(`[data-question-id="${questionId}"]`);
  if (!feedback) return;

  const vote = getVote(questionId);
  feedback.querySelectorAll("[data-vote]").forEach(button => {
    button.setAttribute("aria-pressed", String(vote?.vote === button.dataset.vote));
  });

  const followup = feedback.querySelector(".feedback-followup");
  const textarea = feedback.querySelector("textarea");
  followup.hidden = vote?.vote !== "down";
  textarea.value = vote?.missing || "";
  feedback.querySelector(".feedback-status").textContent = vote
    ? saved ? "Thanks for the feedback!" : "Vote could not be saved."
    : "";
}

function renderHelpfulLink(question) {
  return `
    <li>
      <a href="#question-${question.id}" data-helpful-question="${question.id}">
        <i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>
        <span>${question.question}</span>
      </a>
    </li>
  `;
}

function renderHelpfulQuestions() {
  const helpfulQuestions = [];

  faqData.forEach(category => {
    category.questions.forEach(([questionId, question]) => {
      const vote = getVote(questionId);
      if (vote?.vote === "up") {
        helpfulQuestions.push({
          id: questionId,
          question,
          helpfulCount: Number(vote.vote === "up"),
          votedAt: vote.votedAt || 0
        });
      }
    });
  });

  // Votes are local to this browser, so the latest positive votes break ties.
  helpfulQuestions.sort((first, second) =>
    second.helpfulCount - first.helpfulCount || second.votedAt - first.votedAt
  );

  helpfulList.innerHTML = helpfulQuestions.length
    ? helpfulQuestions.slice(0, 3).map(renderHelpfulLink).join("")
    : '<li><p class="empty-helpful">Vote for an answer to see it here.</p></li>';
}

function renderSavedFeedback() {
  faqData.forEach(category => {
    category.questions.forEach(([questionId]) => {
      if (getVote(questionId)) updateFeedback(questionId);
    });
  });
}

renderCategoryLinks();
faqGroups.innerHTML = faqData.map(renderCategoryGroup).join("");
renderSavedFeedback();
renderHelpfulQuestions();

categoryList.addEventListener("click", event => {
  const link = event.target.closest("[data-category-link]");
  if (!link) return;

  event.preventDefault();
  const categoryId = link.dataset.categoryLink;
  setActiveCategory(categoryId);
  scrollToElement(document.getElementById(categoryId));
});

helpfulList.addEventListener("click", event => {
  const link = event.target.closest("[data-helpful-question]");
  if (!link) return;

  event.preventDefault();
  const question = document.getElementById(`question-${link.dataset.helpfulQuestion}`);
  question.open = true;
  scrollToElement(question);
  question.querySelector("summary").focus({ preventScroll: true });
});

faqGroups.addEventListener("click", event => {
  const button = event.target.closest("[data-vote]");
  if (!button) return;

  const feedback = button.closest("[data-question-id]");
  const questionId = feedback.dataset.questionId;
  const previousVote = getVote(questionId);
  const vote = button.dataset.vote;

  votes[questionId] = {
    vote,
    missing: vote === "down" ? previousVote?.missing || "" : "",
    votedAt: Date.now()
  };

  updateFeedback(questionId, saveVotes());
  renderHelpfulQuestions();
});

faqGroups.addEventListener("input", event => {
  if (!event.target.matches("textarea")) return;

  const feedback = event.target.closest("[data-question-id]");
  if (!feedback) return;

  const questionId = feedback.dataset.questionId;
  const vote = getVote(questionId);
  if (vote?.vote !== "down") return;

  votes[questionId].missing = event.target.value;
  const saved = saveVotes();
  feedback.querySelector(".feedback-status").textContent =
    saved ? "Thanks for the feedback!" : "Note could not be saved.";
});

function updateActiveCategory() {
  const groups = [...faqGroups.querySelectorAll(".faq-group")];
  const lastGroup = groups[groups.length - 1];

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    setActiveCategory(lastGroup.id);
    return;
  }

  // Use a point near the top of the viewport to decide which group is active.
  const activationLine = Math.min(120, window.innerHeight * 0.25);
  const activeGroup = groups.filter(group => group.getBoundingClientRect().top <= activationLine).pop();
  setActiveCategory(activeGroup?.id || groups[0].id);
}

const categoryObserver = new IntersectionObserver(updateActiveCategory, {
  rootMargin: "0px",
  threshold: 0
});

faqGroups.querySelectorAll(".faq-group").forEach(group => categoryObserver.observe(group));
window.addEventListener("scroll", updateActiveCategory, { passive: true });
window.addEventListener("resize", updateActiveCategory);
updateActiveCategory();
