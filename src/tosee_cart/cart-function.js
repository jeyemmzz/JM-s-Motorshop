        function renderCart() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const list = document.getElementById('orderList');
            const summary = document.getElementById('cartSummary');

            if (cart.length === 0) { 
                list.innerHTML = `<div class="empty-msg">Your cart is empty.<br>Go pick some gear!</div>`; 
                summary.style.display = "none"; 
                return; 
            }

            summary.style.display = "block";
            let total = 0;

            list.innerHTML = cart.map((item, index) => {
                const subtotal = item.price * (item.qty || 1);
                total += subtotal;
                return `
                    <div class="order-card">
                        <button class="btn-remove" onclick="removeItem(${index})">✕</button>
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            <span class="item-price">₱${subtotal.toLocaleString()}</span>
                        </div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQty(${index}, -1)">−</button>
                            <span class="qty-val">${item.qty || 1}</span>
                            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                    </div>
                `;
            }).join('');
            
            document.getElementById('totalDisplay').innerText = "₱" + total.toLocaleString();
        }

        function updateQty(index, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!cart[index].qty) cart[index].qty = 1;
            
            cart[index].qty += change;

            if (cart[index].qty <= 0) {
                removeItem(index);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }

        function removeItem(index) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemName = cart[index].name;
            
            if(confirm("Remove " + itemName + " from cart?")) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }

        renderCart();