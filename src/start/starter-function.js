        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, 3000);

        let adminClickCount = 0;
        let adminTimer;

        function handleAdminClick() {
            adminClickCount++;
            clearTimeout(adminTimer);

            if (adminClickCount === 5) {
                adminClickCount = 0; // Reset count
                
                let pinInput = prompt("Enter Admin PIN:");

                if (pinInput === "1234") { 
                    alert("Access Granted. Redirecting...");
                    window.location.href = '../admin/admin.html';
                } else if (pinInput !== null) {
                    alert("Incorrect PIN. Access Denied.");
                }
                
                return;
            } 

            adminTimer = setTimeout(() => {
                adminClickCount = 0;
            }, 1000); 
        }

        