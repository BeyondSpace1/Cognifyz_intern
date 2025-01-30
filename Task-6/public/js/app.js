document.getElementById('register-form')?.addEventListener('submit', registerUser);
document.getElementById('login-form')?.addEventListener('submit', loginUser);
document.getElementById('submit-comment')?.addEventListener('click', submitComment);

let authToken = '';

// async function registerUser(event) {
//     event.preventDefault();
//     const username = document.getElementById('register-username').value;
//     const password = document.getElementById('register-password').value;

//     const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//     });

//     const data = await response.json();
//     alert(data.message);
// }

// async function loginUser(event) {
//     event.preventDefault();
//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;

//     const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//     });

//     const data = await response.json();
//     if (data.token) {
//         authToken = data.token;
//         alert('Login successful!');
//     } else {
//         alert('Login failed!');
//     }
// }
async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.message === 'User registered successfully') {
        alert('Registration successful! Redirecting to login page...');
        
        // Redirect to the login page after successful registration
        window.location.href = '/login';
    } else {
        alert('Registration failed!');
    }
}

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        authToken = data.token;
        localStorage.setItem('token', authToken); // Store the token in localStorage
        alert('Login successful!');
        
        // Redirect to the comment submission page
        window.location.href = '/submit-comment';
    } else {
        alert('Login failed!');
    }
}


// async function submitComment() {
//     if (!authToken) {
//         alert('You must be logged in to submit a comment.');
//         return;
//     }

//     const commentText = document.getElementById('comment-text').value;
//     const response = await fetch('/api/submit-comment', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`
//         },
//         body: JSON.stringify({ comment: commentText })
//     });

//     const data = await response.json();
//     alert(data.message);
// }
async function submitComment() {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) {
        alert('You must be logged in to submit a comment.');
        return;
    }

    const commentText = document.getElementById('comment-text').value;
    const response = await fetch('/api/submit-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in Authorization header
        },
        body: JSON.stringify({ comment: commentText })
    });

    const data = await response.json();
    alert(data.message);

    if (data.message === 'Comment submitted successfully!') {
        // Redirect to the homepage after submitting the comment
        window.location.href = '/';
    }
}
