const userSession = JSON.parse(localStorage.getItem('currentUser') || 'null');
let cartData = JSON.parse(localStorage.getItem('cart') || '[]');
let selectedPayment = "";

        window.onload = () => {
            if (!userSession) {
                window.location.href = "../login/login.html";
                return;
            }
            document.getElementById('accName').innerText = userSession.displayName || userSession.username;
            renderOrderSummary();
        };

        function selectMethod(el, method) {
            document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            selectedPayment = method;
        }

        function renderOrderSummary() {
            const container = document.getElementById('orderItemsDisplay');
            let total = 0;
            
            if(cartData.length === 0) {
                container.innerHTML = `<div style="text-align:center; color:#444; padding: 20px;">Cart is empty</div>`;
                document.getElementById('totalDisplay').innerText = "₱0";
                return;
            }

            container.innerHTML = cartData.map((item, index) => {
                const qty = item.qty || 1;
                total += (item.price * qty);
                return `
                    <div class="order-item">
                        <div class="item-info">
                            <b>${item.name}</b>
                            <small>₱${item.price.toLocaleString()}</small>
                        </div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQty(${index},-1)">−</button>
                            <span class="qty-val">${qty}</span>
                            <button class="qty-btn" onclick="updateQty(${index},1)">+</button>
                        </div>
                        <div style="color:#4CAF50; font-weight:900; font-size: 14px;">₱${(item.price * qty).toLocaleString()}</div>
                    </div>`;
            }).join('');
            document.getElementById('totalDisplay').innerText = "₱" + total.toLocaleString();
        }

        function updateQty(index, change) {
            cartData[index].qty = (cartData[index].qty || 1) + change;
            if (cartData[index].qty <= 0) cartData.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartData));
            renderOrderSummary();
        }

        function processOrder() {
            if (!selectedPayment) return alert("Please select a payment method.");
            if (cartData.length === 0) return alert("Your cart is empty!");

            let masterInv = JSON.parse(localStorage.getItem('jm_master_inventory')) || [];
            let stockError = false;

            cartData.forEach(c => {
                let invItem = masterInv.find(p => p.name === c.name);
                if (invItem) {
                    if (invItem.stock < (c.qty || 1)) {
                        alert(`Sorry, not enough stock for ${c.name}`);
                        stockError = true;
                    }
                }
            });

            if(stockError) return;

            cartData.forEach(c => {
                let invItem = masterInv.find(p => p.name === c.name);
                if (invItem) invItem.stock -= (c.qty || 1);
            });
            localStorage.setItem('jm_master_inventory', JSON.stringify(masterInv));

            const oID = "ID-" + Math.floor(100000 + Math.random() * 900000);
            const total = cartData.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
            
            const newOrder = { 
                orderID: oID, 
                username: userSession.username, 
                customer: userSession.displayName || userSession.username,
                items: [...cartData], 
                total, 
                payment: selectedPayment, 
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                status: "On Process" 
            };

            let orders = JSON.parse(localStorage.getItem('jm_orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('jm_orders', JSON.stringify(orders));

            showReceipt(newOrder);
        }

        function showReceipt(order) {
            document.getElementById('rID').innerText = order.orderID;
            document.getElementById('rDate').innerText = order.date;
            document.getElementById('rCust').innerText = order.customer;
            document.getElementById('rPay').innerText = order.payment;
            document.getElementById('rTotal').innerText = "₱" + order.total.toLocaleString();
            document.getElementById('rStatus').innerText = order.status.toUpperCase();
            
            document.getElementById('rItems').innerHTML = order.items.map(i => `
                <div class="receipt-line" style="font-weight: normal; font-size: 12px;">
                    <span>${i.name} x${i.qty || 1}</span>
                    <span>₱${(i.price * (i.qty || 1)).toLocaleString()}</span>
                </div>
            `).join('');

            document.getElementById('receiptModal').style.display = 'flex';
        }

        function finishOrder() {
            localStorage.removeItem('cart');
            
            window.location.href = '../branding/brand.html';
        }