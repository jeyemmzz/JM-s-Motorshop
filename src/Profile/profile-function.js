        let user = JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (!user) {
            window.location.replace('../login/login.html');
        } else {
            updateUI();
            renderReceipts();
        }

        function updateUI() {
            const nameToDisplay = user.displayName || user.username;
            document.getElementById('userName').innerText = nameToDisplay;
            document.getElementById('editNameInput').value = nameToDisplay;

            const initialText = document.getElementById('initialText');
            const profileImg = document.getElementById('profileImg');

            if (user.profilePic) {
                profileImg.src = user.profilePic;
                profileImg.style.display = 'block';
                initialText.style.display = 'none';
            } else {
                initialText.innerText = nameToDisplay.charAt(0).toUpperCase();
                profileImg.style.display = 'none';
                initialText.style.display = 'block';
            }
        }

        function openSettings() { document.getElementById('settingsModal').style.display = 'flex'; }
        function closeSettings() { document.getElementById('settingsModal').style.display = 'none'; }

        function saveSettings() {
            const newName = document.getElementById('editNameInput').value;
            const fileInput = document.getElementById('imageInput').files[0];

            user.displayName = newName;

            if (fileInput) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    user.profilePic = reader.result;
                    finalizeSave();
                }
                reader.readAsDataURL(fileInput);
            } else {
                finalizeSave();
            }
        }

        function finalizeSave() {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            let users = JSON.parse(localStorage.getItem('jm_users')) || [];
            const index = users.findIndex(u => u.username === user.username);
            if(index !== -1) {
                users[index] = user;
                localStorage.setItem('jm_users', JSON.stringify(users));
            }

            alert("Profile Updated!");
            location.reload();
        }

        function renderReceipts() {
            const container = document.getElementById('receiptsContainer');
            const allOrders = JSON.parse(localStorage.getItem('jm_orders')) || [];
            
            const myOrders = allOrders.filter(o => o.username === user.username || o.customer === user.username);

            if (myOrders.length === 0) {
                container.innerHTML = `<div class="empty-state">No purchase history found.<br>Your receipts will appear here after checkout.</div>`;
                return;
            }

            container.innerHTML = myOrders.reverse().map(order => `
                <div class="receipt-card">
                    <div class="receipt-header">
                        <span class="order-id">#${order.orderID || '0000'}</span>
                        <span>${order.date || 'No Date'}</span>
                    </div>
                    <div class="items-list">
                        ${order.items.map(item => `
                            <div class="item">
                                <span class="item-name">${item.name} <span class="item-qty">x${item.qty || 1}</span></span>
                                <span>₱${((item.price) * (item.qty || 1)).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="receipt-footer">
                        <span class="payment-method">${order.payment || 'CASH'}</span>
                        <span class="total-price">₱${order.total.toLocaleString()}</span>
                    </div>
                </div>
            `).join('');
        }

        function logout() {
            if (confirm("Logout from JM Motorshop?")) {
                localStorage.removeItem('currentUser');
                window.location.href = '../start/index.html'; 
            }
        }