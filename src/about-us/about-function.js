let adminClickCount = 0;
let adminTimer;

function handleAdminClick() {
    adminClickCount++;
    clearTimeout(adminTimer);

    if (adminClickCount === 5) {
        adminClickCount = 0; 

   
        let adminPin = prompt("SYSTEM RESTRICTED: Enter Administrator PIN to proceed:");

        if (adminPin === "1234") {
            alert("ACCESS GRANTED: Welcome back, Administrator.");
            window.location.href = '../admin/admin.html';
        } else if (adminPin !== null) {
            alert("INVALID PIN: Security protocols active. Access denied.");
        }
        return;
    }
    adminTimer = setTimeout(() => { 
        adminClickCount = 0; 
    }, 1000);
}

const observerOptions = { 
    threshold: 0.15, 
    rootMargin: "0px 0px -50px 0px" 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

function syncAboutHeader() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const profileImg = document.querySelector('.profile-circle img');
    
    if (user && user.profilePic && profileImg) {
        profileImg.src = user.profilePic;
        profileImg.style.filter = "none"; 
        profileImg.style.width = "100%";
        profileImg.style.height = "100%";
        profileImg.style.objectFit = "cover";
    }
}

window.onload = () => {
    syncAboutHeader();
};