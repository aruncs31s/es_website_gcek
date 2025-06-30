const USER_STORAGE_KEY = 'google_user_profile';

// Function to update the UI based on login status
function updateUI(user) {
  const loginButton = document.getElementById('login-button');
  const userInfo = document.getElementById('user-info');

  if (loginButton && userInfo) {
    if (user) {
      loginButton.classList.add('hidden');
      userInfo.classList.remove('hidden');
      userInfo.innerHTML = `
        <span class="text-sm text-neutral-600 dark:text-neutral-400">Welcome, ${user.name}</span>
        <button id="logout-button" class="text-sm font-medium text-orange-400 hover:underline ml-2">Logout</button>
      `;
      document.getElementById('logout-button')?.addEventListener('click', logout);
    } else {
      loginButton.classList.remove('hidden');
      userInfo.classList.add('hidden');
    }
  }
}

// Handle the Google credential response
window.handleCredentialResponse = async (response) => {
  if (response.credential) {
    try {
      const backendResponse = await fetch('http://localhost:3000/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        if (data.user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          updateUI(data.user);
          // Optionally close the modal here if you have a modal closing mechanism
          // For example: HSOverlay.close(document.getElementById('hs-toggle-between-modals-login-modal'));
        }
      } else {
        console.error('Backend login failed:', backendResponse.statusText);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during backend login:', error);
      alert('An error occurred during login. Please try again.');
    }
  }
};

// Logout function
function logout() {
  localStorage.removeItem(USER_STORAGE_KEY);
  updateUI(null);
  alert('You have been logged out.');
  // Optionally refresh the page or redirect
  // window.location.reload();
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  updateUI(user);
});