function syncProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const nameToDisplay = user.displayName || user.username;
        document.getElementById('adminName').innerText = nameToDisplay;

        const adminImg = document.getElementById('adminImg');
        const adminInit = document.getElementById('adminInit');

        if (user.profilePic) {
            adminImg.src = user.profilePic;
            adminImg.style.display = 'block';
            adminInit.style.display = 'none';
        } else {
            adminInit.innerText = nameToDisplay.charAt(0).toUpperCase();
            adminImg.style.display = 'none';
            adminInit.style.display = 'block';
        }
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    
    const btnMap = {
        'inventory': 'btn-inv',
        'receipts': 'btn-rec',
        'users': 'btn-usr'
    };
    document.getElementById(btnMap[tabName]).classList.add('active');

    if (tabName === 'inventory') renderInventory();
    else if (tabName === 'receipts') renderReceipts();
    else if (tabName === 'users') displayUsers();
}

function filterInventory() {
    const query = document.getElementById('invSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? "flex" : "none";
    });
}

function renderInventory() {
    const display = document.getElementById('inventoryDisplay');
    const inv = JSON.parse(localStorage.getItem('jm_master_inventory')) || [];
    
    if (inv.length === 0) {
        display.innerHTML = "<p style='text-align:center; color:#333; padding:50px; font-weight:900;'>INVENTORY IS CURRENTLY EMPTY.</p>";
        return;
    }

    display.innerHTML = inv.map((p, i) => `
        <div class="item-row">
            <div>
                <b style="color:#ff4d4d; font-size:15px; font-weight:900;">${p.name}</b><br>
                <small style="color:#555; font-weight:700; text-transform:uppercase; font-size:10px;">${p.brand} | ${p.cat} | ₱${Number(p.price).toLocaleString()}</small><br>
                <div style="margin-top:8px; font-size:11px; font-weight:900; color:${p.stock < 10 ? '#ff4d4d' : '#4CAF50'};">
                    STOCK LEVEL: ${p.stock} ${p.stock < 10 ? '— RESTOCK NEEDED' : ''}
                </div>
            </div>
            <div>
                <button class="restock-btn" onclick="restockItem(${i})">Restock</button>
                <button class="del-btn" onclick="deleteItem(${i})">X</button>
            </div>
        </div>
    `).join('');
    filterInventory();
}

function renderReceipts() {
    const display = document.getElementById('receiptsDisplay');
    const orders = JSON.parse(localStorage.getItem('jm_orders')) || [];

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('totalRevenue').innerText = "₱" + revenue.toLocaleString();
    document.getElementById('totalOrders').innerText = orders.length;

    if (orders.length === 0) {
        display.innerHTML = "<p style='text-align:center; color:#333; padding:50px; font-weight:900;'>NO SALES RECORDED YET.</p>";
        return;
    }

    display.innerHTML = orders.slice().reverse().map(o => {
        const displayName = o.customer || o.username || 'Guest Customer';

        return `
        <div class="receipt-card">
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#444; margin-bottom:15px; font-weight: 900;">
                <span>ORDER ID: ${o.orderID}</span>
                <span>${o.date}</span>
            </div>
            <span class="customer-pill">👤 ${displayName}</span>
            <div style="background:#0a0a0a; padding:15px; border-radius:12px; margin-bottom:20px;">
                ${o.items.map(item => `
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                        <span>${item.name} <small style="color:#444;">x${item.qty || 1}</small></span>
                        <span style="font-weight:900;">₱${(item.price * (item.qty || 1)).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div style="text-align:right;">
                <small style="color:#444; display:block; font-size:9px; font-weight:900; text-transform:uppercase;">Grand Total</small>
                <b style="font-size:30px; color:#4CAF50; font-weight:900; letter-spacing:-1.5px;">₱${o.total.toLocaleString()}</b>
            </div>
        </div>
    `}).join('');
}

function addPart() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const stock = parseInt(document.getElementById('pStock').value); 
    
    if (!name || !price || isNaN(stock)) return alert("Fill all fields correctly!");

    if (stock > 50) {
        return alert("ERROR: Maximum stock limit is 50 only.");
    }

    let inv = JSON.parse(localStorage.getItem('jm_master_inventory')) || [];
    inv.push({
        name,
        brand: document.getElementById('pBrand').value,
        cat: document.getElementById('pCat').value,
        price: parseInt(price),
        stock: stock
    });
    
    localStorage.setItem('jm_master_inventory', JSON.stringify(inv));
    renderInventory();
    
    document.getElementById('pName').value = "";
    document.getElementById('pPrice').value = "";
    document.getElementById('pStock').value = "";
    alert("Success, part added to inventory!");
}

function restockItem(i) {
    let inv = JSON.parse(localStorage.getItem('jm_master_inventory'));
    let currentStock = inv[i].stock;
    
    let val = prompt(`Current stock for ${inv[i].name} is ${currentStock}. How many to add? (Max total: 50)`, "10");
    
    if (val && !isNaN(val)) {
        let addedQty = parseInt(val);
        let newTotal = currentStock + addedQty;

        if (newTotal > 50) {
            let allowable = 50 - currentStock;
            return alert(`FAILED: Stock limit exceeded. You can only add up to ${allowable} more for this item.`);
        }

        inv[i].stock = newTotal;
        localStorage.setItem('jm_master_inventory', JSON.stringify(inv));
        renderInventory();
        alert("Restock successful!");
    }
}

function displayUsers() {
    const userTableBody = document.getElementById('userTableBody');
    const users = JSON.parse(localStorage.getItem('jm_users')) || [];

    if (users.length === 0) {
        userTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:30px; color:#444;">No users registered yet.</td></tr>`;
        return;
    }

    userTableBody.innerHTML = users.map((u, i) => `
        <tr style="border-bottom: 1px solid #1a1a1a;">
            <td style="padding:15px; font-weight:700;">${u.username}</td>
            <td style="padding:15px; color:#555;">••••••••</td>
            <td style="padding:15px; text-align:right;">
                <button class="del-btn" onclick="deleteUser(${i})">Remove</button>
            </td>
        </tr>
    `).join('');
}

function deleteUser(index) {
    if (confirm("Permanently remove this user account?")) {
        let users = JSON.parse(localStorage.getItem('jm_users')) || [];
        users.splice(index, 1);
        localStorage.setItem('jm_users', JSON.stringify(users));
        displayUsers();
    }
}

function deleteItem(i) {
    if (confirm("Confirm deletion of this part?")) {
        let inv = JSON.parse(localStorage.getItem('jm_master_inventory'));
        inv.splice(i, 1);
        localStorage.setItem('jm_master_inventory', JSON.stringify(inv));
        renderInventory();
    } 
} 

function clearSales() {
    if (confirm("DANGER: This will erase all sales data. Proceed?")) {
        localStorage.removeItem('jm_orders');
        renderReceipts();
    }
}

function logout() {
    if (confirm("Logout from admin session?")) window.location.href = "../start/index.html";
}

window.onload = () => {
    syncProfile();
    renderInventory();
    renderReceipts();
};