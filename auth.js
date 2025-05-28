// // Auth.js - Separate file for authentication logic
// const Auth = {
//   // Store user data
//   currentUser: null,
  
//   // Sign up new user
//   signUp: (username, password) => {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
    
//     // Check if username already exists
//     if (users.some(user => user.username === username)) {
//       return { success: false, message: 'Username already exists' };
//     }
    
//     // Create new user
//     const newUser = {
//       id: Date.now().toString(),
//       username,
//       password, // In real app, hash this password!
//       createdAt: new Date().toISOString()
//     };
    
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));
//     Auth.currentUser = newUser;
    
//     return { success: true, user: newUser };
//   },
  
//   // Log in existing user
//   login: (username, password) => {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(u => u.username === username && u.password === password);
    
//     if (user) {
//       Auth.currentUser = user;
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       return { success: true, user };
//     }
    
//     return { success: false, message: 'Invalid credentials' };
//   },
  
//   // Log out current user
//   logout: () => {
//     Auth.currentUser = null;
//     localStorage.removeItem('currentUser');
//   },
  
//   // Check if user is logged in
//   isAuthenticated: () => {
//     return !!Auth.currentUser || !!localStorage.getItem('currentUser');
//   },
  
//   // Get current user
//   getCurrentUser: () => {
//     return Auth.currentUser || JSON.parse(localStorage.getItem('currentUser'));
//   }
// };

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', () => {
//   Auth.currentUser = Auth.getCurrentUser();
//   updateAuthUI();
// });

// function updateAuthUI() {
//   const user = Auth.getCurrentUser();
//   const loginLink = document.querySelector('a[href="login.html"]');
//   const navAuthSection = document.querySelector('.nav-auth');
  
//   if (user) {
//     // User is logged in
//     if (loginLink) loginLink.style.display = 'none';
//     if (navAuthSection) {
//       navAuthSection.innerHTML = `
//         <div class="user-greeting">Hi, ${user.username}!</div>
//         <button class="logout-btn">Logout</button>
//       `;
      
//       document.querySelector('.logout-btn').addEventListener('click', () => {
//         Auth.logout();
//         updateAuthUI();
//         showAlert('You have been logged out', 'success');
//       });
//     }
//   } else {
//     // User is not logged in
//     if (loginLink) loginLink.style.display = 'block';
//     if (navAuthSection) {
//       navAuthSection.innerHTML = `
//         <button class="login-btn" onclick="openModal('login-modal')">Login</button>
//         <button class="signup-btn" onclick="openModal('signup-modal')">Sign Up</button>
//       `;
//     }
//   }
// }

// function showAlert(message, type = 'info') {
//   const alert = document.createElement('div');
//   alert.className = `alert alert-${type}`;
//   alert.textContent = message;
  
//   document.body.appendChild(alert);
  
//   setTimeout(() => {
//     alert.classList.add('show');
//   }, 10);
  
//   setTimeout(() => {
//     alert.classList.remove('show');
//     setTimeout(() => alert.remove(), 300);
//   }, 3000);
// }

// // Add this to your JavaScript
// function setupLogout() {
//   const greetingElement = document.getElementById('user-greeting');
  
//   // Make greeting clickable for logout
//   greetingElement.addEventListener('click', function() {
//     if (confirm('Are you sure you want to logout?')) {
//       // Clear user data
//       localStorage.removeItem('isLoggedIn');
//       localStorage.removeItem('currentUsername');
      
//       // Update UI
//       updateUserGreeting(null);
//       showToast('You have been logged out');
//     }
//   });
  
//   // Add hover effect
//   greetingElement.style.cursor = 'pointer';
//   greetingElement.title = 'Click to logout';
// }

// // Call this in your DOMContentLoaded event
// document.addEventListener('DOMContentLoaded', function() {
//   checkLoginState();
//   setupLogout();
// });


// Auth.js - Authentication logic
const Auth = {
  currentUser: null,
  
  signUp: (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(user => user.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // Note: In production, hash this password!
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    Auth.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  },
  
  login: (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      Auth.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid credentials' };
  },
  
  logout: () => {
    Auth.currentUser = null;
    localStorage.removeItem('currentUser');
  },
  
  isAuthenticated: () => {
    return !!Auth.currentUser || !!localStorage.getItem('currentUser');
  },
  
  getCurrentUser: () => {
    return Auth.currentUser || JSON.parse(localStorage.getItem('currentUser'));
  }
};

// Alert/Toast System
function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// UI Update Functions
function updateAuthUI() {
  const user = Auth.getCurrentUser();
  const loginLink = document.getElementById('auth-link');
  const userSection = document.getElementById('user-section');
  
  if (user) {
    // User is logged in
    if (loginLink) loginLink.style.display = 'none';
    if (userSection) {
      userSection.style.display = 'flex';
      document.getElementById('username-display').textContent = user.username;
    }
  } else {
    // User is logged out
    if (loginLink) loginLink.style.display = 'block';
    if (userSection) userSection.style.display = 'none';
  }
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
        updateAuthUI();
        showToast('You have been logged out');
      }
    });
  }
}

// Form Handlers
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  
  if (username.length < 4) {
    showAlert('Username must be at least 4 characters', 'error');
    return;
  }
  
  if (password.length < 8) {
    showAlert('Password must be at least 8 characters', 'error');
    return;
  }
  
  const result = Auth.signUp(username, password);
  
  if (result.success) {
    showToast('Account created successfully!');
    closeModal('signup-modal');
    updateAuthUI();
  } else {
    showAlert(result.message, 'error');
  }
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  
  const result = Auth.login(username, password);
  
  if (result.success) {
    showToast(`Welcome back, ${username}!`);
    closeModal('login-modal');
    updateAuthUI();
  } else {
    showAlert(result.message, 'error');
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.currentUser = Auth.getCurrentUser();
  updateAuthUI();
  setupLogoutButton();
});

function requireAuth(actionCallback) {
  if (Auth.isAuthenticated()) {
    // User is logged in, proceed with the action
    if (actionCallback) actionCallback();
  } else {
    // User is not logged in, show login modal
    showAlert('Please login or sign up to continue', 'error');
    openModal('login-modal');
    
    // Optional: Set up a callback after successful login
    const originalForms = {
      login: document.getElementById('login-form').onsubmit,
      signup: document.getElementById('signup-form').onsubmit
    };
    
    // Temporarily override form submissions
    document.getElementById('login-form').onsubmit = function(e) {
      e.preventDefault();
      originalForms.login.call(this, e);
      if (Auth.isAuthenticated() && actionCallback) {
        actionCallback();
      }
    };
    
    document.getElementById('signup-form').onsubmit = function(e) {
      e.preventDefault();
      originalForms.signup.call(this, e);
      if (Auth.isAuthenticated() && actionCallback) {
        actionCallback();
      }
    };
  }
}

