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
        <div class="hs-dropdown relative inline-flex [--trigger:hover]">
          <button id="hs-dropdown-with-icons" type="button" class="hs-dropdown-toggle flex items-center gap-x-2 text-base md:text-sm font-medium text-neutral-600 ring-zinc-500 transition duration-300 focus-visible:ring-3 outline-hidden hover:text-orange-400 dark:hover:text-orange-300 dark:border-neutral-700 dark:text-neutral-400 dark:ring-zinc-200 dark:focus:outline-hidden md:my-6 md:border-s md:border-neutral-300 md:ps-6">
            ${user.name}
            <svg class="hs-dropdown-open:rotate-180 size-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700" aria-labelledby="hs-dropdown-with-icons">
            <div class="py-3 px-5 -m-2 bg-neutral-100 rounded-t-lg dark:bg-neutral-700">
              <p class="text-sm text-neutral-500 dark:text-neutral-400">Signed in as</p>
              <p class="text-sm font-medium text-neutral-800 dark:text-neutral-300">${user.email}</p>
            </div>
            <div class="mt-2 py-2 first:pt-0 last:pb-0">
              <a id="logout-button" class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-neutral-800 hover:bg-neutral-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300" href="#">
                <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </a>
            </div>
          </div>
        </div>
      `;
      document.getElementById('logout-button')?.addEventListener('click', logout);
      // Re-initialize Preline UI for the new dropdown
      if (window.HSStaticMethods) {
        setTimeout(() => window.HSStaticMethods.autoInit(), 100);
      }
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
      // For demonstration purposes, we'll decode the credential directly on the client-side.
      // IMPORTANT: In a production environment, you should always send the credential
      // to your backend server for secure verification and to prevent tampering.
      const id_token = response.credential;
      const payload = JSON.parse(atob(id_token.split('.')[1]));
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      updateUI(user);

      // Close the login modal
      const loginModalSelector = '#hs-toggle-between-modals-login-modal';
      if (document.querySelector(loginModalSelector) && window.HSOverlay) {
        window.HSOverlay.close(loginModalSelector);
      }

    } catch (error) {
      console.error('Error during login:', error);
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