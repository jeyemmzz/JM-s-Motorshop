let adminClickCount = 0;
let adminTimer;

    function handleAdminClick() {
        adminClickCount++;
        clearTimeout(adminTimer);

        if (adminClickCount === 5) {
            adminClickCount = 0; 

         
            let adminPin = prompt("Enter Administrator PIN:");

       
            if (adminPin === "1234") {
                alert("Access Granted. Redirecting...");
          
                window.location.href = '../admin/admin.html';
            } else if (adminPin !== null) {
               
                alert("Invalid PIN. Access Denied.");
            }
            return;
        }

        adminTimer = setTimeout(() => {
            adminClickCount = 0;
        }, 1000); 
    }

    function selectBrand(brand) {
        localStorage.setItem('selectedBrand', brand);
        triggerWipe('../all-about-parts/parts-categories.html');
    }

    function triggerWipe(url) {
        document.getElementById('wipe').classList.add('active');
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    function goToAccount() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            window.location.href = '../Profile/profile.html';
        } else {
            alert("Please login to view your profile.");
            window.location.href = '../login/login.html';
        }
    }

