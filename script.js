
const themeSwitch = document.getElementById("themeSwitch");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "night") {
  body.classList.add("night-mode");
  themeIcon.textContent = "🌙";
}

themeSwitch.addEventListener("click", () => {
  body.classList.toggle("night-mode");

  if (body.classList.contains("night-mode")) {
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "night");
    leftEye.classList.add("closed");
    rightEye.classList.add("closed");
  } else {
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "day");
    leftEye.classList.remove("closed");
    rightEye.classList.remove("closed");
  }
});

const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formHeader = document.querySelector(".form-header h2");
const formHeaderP = document.querySelector(".form-header p");

loginToggle.addEventListener("click", () => {
  loginToggle.classList.add("active");
  registerToggle.classList.remove("active");
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  formHeader.textContent = "Welcome Back!";
  formHeaderP.textContent = "Sign in to continue to your account";
  document.getElementById("forgotPassword").style.display = "block";
});

registerToggle.addEventListener("click", () => {
  registerToggle.classList.add("active");
  loginToggle.classList.remove("active");
  registerForm.style.display = "block";
  loginForm.style.display = "none";
  formHeader.textContent = "Create Account";
  formHeaderP.textContent = "Sign up to get started";
  document.getElementById("forgotPassword").style.display = "none";
});

const catContainer = document.getElementById("catContainer");
const catHead = document.querySelector(".cat-head");

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const handleMouseMove = throttle((e) => {
  if (body.classList.contains("night-mode")) return;

  const catRect = catHead.getBoundingClientRect();
  const catCenterX = catRect.left + catRect.width / 2;
  const catCenterY = catRect.top + catRect.height / 2;

  const angle = Math.atan2(e.clientY - catCenterY, e.clientX - catCenterX);
  const distance = Math.min(
    4,
    Math.hypot(e.clientX - catCenterX, e.clientY - catCenterY) / 25
  );

  const eyeX = Math.cos(angle) * distance;
  const eyeY = Math.sin(angle) * distance;

  leftEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
  rightEye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
}, 50);

if ("ontouchstart" in window) {
  document.addEventListener("touchmove", handleMouseMove, { passive: true });
} else {
  document.addEventListener("mousemove", handleMouseMove);
}

function closeEyes() {
  leftEye.classList.add("closed");
  rightEye.classList.add("closed");

  setTimeout(() => {
    if (!body.classList.contains("night-mode")) {
      leftEye.classList.remove("closed");
      rightEye.classList.remove("closed");
    }
  }, 1500);
}

function setupPasswordToggle(toggleElement) {
  const targetId = toggleElement.getAttribute("data-target");
  const passwordInput = document.getElementById(targetId);
  const eyeIcon = toggleElement.querySelector(".eye-icon");

  toggleElement.addEventListener("click", () => {
    closeEyes();

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.add("closed");
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("closed");
    }

    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  });
}

document.querySelectorAll(".password-toggle").forEach(setupPasswordToggle);

const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const successText = document.getElementById("successText");
const errorText = document.getElementById("errorText");

function showMessage(type, message) {
  if (type === "success") {
    successText.textContent = message;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  } else {
    errorText.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeEyes();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email && password) {
    setTimeout(() => {
      showMessage("success", `Welcome back, ${email.split("@")[0]}!`);
      loginForm.reset();
      document.getElementById("loginPassword").type = "password";
      document.getElementById("loginEyeIcon").classList.remove("closed");
    }, 800);
  } else {
    showMessage("error", "Please fill in all fields");
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeEyes();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    setTimeout(() => {
      showMessage("error", "Passwords do not match!");
    }, 800);
    return;
  }

  if (password.length < 6) {
    setTimeout(() => {
      showMessage("error", "Password must be at least 6 characters!");
    }, 800);
    return;
  }

  if (name && email && password) {
    setTimeout(() => {
      showMessage("success", `Account created successfully, ${name}!`);
      registerForm.reset();
      document.getElementById("registerPassword").type = "password";
      document.getElementById("registerEyeIcon").classList.remove("closed");
      document.getElementById("confirmPassword").type = "password";
      document.getElementById("confirmEyeIcon").classList.remove("closed");
      setTimeout(() => {
        loginToggle.click();
      }, 2000);
    }, 800);
  } else {
    showMessage("error", "Please fill in all fields");
  }
});

document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  closeEyes();
  showMessage("success", "Password reset link sent to your email!");
});

const inputs = document.querySelectorAll(
  'input[type="email"], input[type="password"], input[type="text"]'
);
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    catContainer.style.transform = "scale(1.05)";
  });

  input.addEventListener("blur", () => {
    catContainer.style.transform = "scale(1)";
  });
});

const cat = document.querySelector(".cat");
cat.addEventListener("click", () => {
  if (body.classList.contains("night-mode")) {
    return;
  }

  closeEyes();

  catContainer.style.animation = "jump 0.5s ease";
  setTimeout(() => {
    catContainer.style.animation = "";
  }, 500);
});

const style = document.createElement("style");
style.textContent = `
            @keyframes jump {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
        `;
document.head.appendChild(style);

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
}
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", vibrate);
});
