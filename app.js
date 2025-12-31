// بيانات افتراضية
let categories = [
    {id: 1, name: 'عصائر'},
    {id: 2, name: 'سندوتشات'},
    {id: 3, name: 'حلويات'}
];

let products = [
    {id:1, categoryId:1, name:'عصير برتقال', price:10, image:'images/products/orange-juice.jpg', featured:true},
    {id:2, categoryId:1, name:'عصير تفاح', price:12, image:'images/products/apple-juice.jpg', featured:true},
    {id:3, categoryId:2, name:'سندوتش دجاج', price:20, image:'images/products/chicken-sandwich.jpg', featured:false},
    {id:4, categoryId:3, name:'كنافة', price:15, image:'images/products/kunafa.jpg', featured:true}
];

let cart = [];

// التحقق من لوحة تحكم المالك
const adminPassword = 'admin123'; // كلمة مرور تجريبية
function checkAdmin() {
    const password = prompt("ادخل كلمة مرور المالك:");
    if(password === adminPassword) {
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminData();
    } else {
        alert("كلمة المرور خاطئة!");
    }
}

// تحميل البيانات في لوحة التحكم
function loadAdminData() {
    document.getElementById('productsTab').innerHTML = products.map(p => `
        <div>
            <input type="text" value="${p.name}" onchange="updateProductName(${p.id}, this.value)">
            <input type="number" value="${p.price}" onchange="updateProductPrice(${p.id}, this.value)">
            <input type="file" onchange="updateProductImage(${p.id}, this)">
        </div>
    `).join('');
}

// تعديل البيانات
function updateProductName(id, name) {
    const product = products.find(p => p.id === id);
    if(product) product.name = name;
    renderProducts();
}

function updateProductPrice(id, price) {
    const product = products.find(p => p.id === id);
    if(product) product.price = parseFloat(price);
    renderProducts();
}

function updateProductImage(id, input) {
    const file = input.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e){
            const product = products.find(p=>p.id===id);
            if(product) product.image = e.target.result;
            renderProducts();
        }
        reader.readAsDataURL(file);
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display='none');
    document.getElementById(tab+'Tab').style.display = 'block';
}

function logoutAdmin() {
    document.getElementById('adminPanel').style.display='none';
}

// عرض التصنيفات
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(c=>`
        <div class="category-card">${c.name}</div>
    `).join('');
}

// عرض المنتجات
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" width="100%">
            <h3>${p.name}</h3>
            <p>${p.price} ريال</p>
            <button onclick="addToCart(${p.id})">أضف للسلة</button>
        </div>
    `).join('');

    const topGrid = document.getElementById('topProductsGrid');
    topGrid.innerHTML = products.filter(p=>p.featured).map(p => `
        <div class="top-product-card">
            <img src="${p.image}" alt="${p.name}" width="100%">
            <h3>${p.name}</h3>
            <p>${p.price} ريال</p>
            <button onclick="addToCart(${p.id})">أضف للسلة</button>
        </div>
    `).join('');
}

// إضافة للسلة
function addToCart(productId){
    const product = products.find(p=>p.id===productId);
    if(product){
        cart.push(product);
        renderCart();
    }
}

// عرض السلة
function renderCart(){
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.map((p,i)=>`
        <div>
            ${p.name} - ${p.price} ريال
            <button onclick="removeFromCart(${i})">حذف</button>
        </div>
    `).join('');
    document.getElementById('cartTotalPrice').innerText = cart.reduce((sum,p)=>sum+p.price,0);
    document.getElementById('cartModal').style.display='block';
}

function removeFromCart(index){
    cart.splice(index,1);
    renderCart();
}

function closeCart() {
    document.getElementById('cartModal').style.display='none';
}

function checkout() {
    if(cart.length === 0){
        alert("السلة فارغة!");
        return;
    }
    let message = "طلب جديد:\n";
    cart.forEach(p=>message+=`${p.name} - ${p.price} ريال\n`);
    const whatsappURL = `https://wa.me/967730528609?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
    cart = [];
    closeCart();
}

// تحميل البيانات عند البدء
window.onload = function() {
    renderCategories();
    renderProducts();
}
