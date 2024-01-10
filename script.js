// Object containing hashed passwords for each clue
const correctPasswords = {
  1: '9e78b43ea00edcac8299e0cc8df7f6f913078171335f733a21d5d911b6999132',
  2: 'b16d7c3fce87a90f650627dba0ae2cec024a8b88f332f0964fe43dd2853b7fa1',
  3: '15078bc057fd9d0634bbabee689e8834a22aac9a32d8a173659a77b77b376413',
  4: '07f4d20c840126df94680d58b14920de42034670fa2bd0eda07ea95cbcf2f2de'
};

// Event listener for when the window finishes loading
window.onload = function () {
  // Hide all clues except the first one initially
  for (let i = 2; i <= 5; i++) {
    hideClue(`clue${i}`);
  }

  // Clear error message initially
  document.getElementById('errorMessage').textContent = '';
};

// Function to calculate SHA-256 hash of an input using the native Web Crypto API
async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Function to hide a clue by setting its display property to 'none'
function hideClue(clueId) {
  const clue = document.getElementById(clueId);
  if (clue) {
    clue.style.display = 'none';
  }
}

// Function to show a clue by setting its display property to 'block'
function showClue(clueId) {
  const clue = document.getElementById(clueId);
  if (clue) {
    clue.style.display = 'block';
  }
}

// Function to check the entered password and proceed accordingly
async function checkPasswordAndProceed(clueNumber) {
  // Get the entered password from the input field
  const passwordInput = document.getElementById(`passwordInput${clueNumber}`).value;

  try {
    // Calculate the SHA-256 hash of the entered password
    const hashedInput = await sha256(passwordInput);

    // Get the correct password for the current clue
    const currentCluePassword = correctPasswords[clueNumber];

    // Get references to HTML elements
    const errorMessage = document.getElementById('errorMessage');
    const imageContainer = document.getElementById('imageContainer');
    const hiddenTextContainer = document.getElementById('hiddenTextContainer');

    // Check if the entered password is correct
    if (hashedInput === currentCluePassword) {
      // Get references to the current and next clues
      const currentClue = document.getElementById(`clue${clueNumber}`);
      const nextClueNumber = clueNumber + 1;

      // If there is a next clue, hide the current clue and show the next one
      if (nextClueNumber <= 5) {
        hideClue(`clue${clueNumber}`);
        showClue(`clue${nextClueNumber}`);
      }

      // Clear error message, image container, and hidden text container
      errorMessage.textContent = '';
      imageContainer.innerHTML = '';
      hiddenTextContainer.innerHTML = '';
    } else {
      // Display image for incorrect password
      imageContainer.innerHTML = '<img src="./steg-granny.png" alt="Custom Image">';

      // Display error message for incorrect password
      errorMessage.textContent = 'Incorrect password. Try again, grandma.';

      // Add hidden text
      hiddenTextContainer.textContent = 'This is hidden text.';
    }
  } catch (error) {
    console.error('Error calculating hash:', error);
  }
}