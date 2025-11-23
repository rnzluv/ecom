const BASE = 'http://localhost:5000';

async function api(path, opts = {}){
  const url = BASE + path;
  const res = await fetch(url, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch(e){ body = text; }
  return { status: res.status, ok: res.ok, body };
}

function log(tag, v){ console.log('---', tag, '---'); console.log(v); }

(async function(){
  try{
    const ts = Date.now();
    const adminEmail = `admin+${ts}@example.com`;
    const userEmail = `user+${ts}@example.com`;

    log('register admin', await api('/api/auth/register', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: 'Admin Test', email: adminEmail, password: 'Password123!', role: 'admin' })
    }));

    const adminLogin = await api('/api/auth/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: adminEmail, password: 'Password123!' })
    });
    log('admin login', adminLogin);
    const adminToken = adminLogin.body?.token;

    log('register user', await api('/api/auth/register', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: 'User Test', email: userEmail, password: 'Password123!', role: 'user' })
    }));

    const userLogin = await api('/api/auth/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: userEmail, password: 'Password123!' })
    });
    log('user login', userLogin);
    const userToken = userLogin.body?.token;

    // create product
    const prodName = `Smoke Product ${ts}`;
    const createProduct = await api('/api/products/add', {
      method: 'POST', headers: {
        'Content-Type':'application/json', Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: prodName, description: 'smoke test', price: 99.9, category: 'test', stock: 3 })
    });
    log('create product', createProduct);
    const prodId = createProduct.body?._id;

    // add to cart
    const addCart = await api('/api/cart/add', {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ productId: prodId, quantity: 1 })
    });
    log('add to cart', addCart);

    // add to wishlist
    const addWish = await api('/api/wishlist/add', {
      method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ productId: prodId })
    });
    log('add wishlist', addWish);

    // remove wishlist
    const removeWish = await api('/api/wishlist/remove', {
      method: 'DELETE', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ productId: prodId })
    });
    log('remove wishlist', removeWish);

    // clear wishlist
    const clearWish = await api('/api/wishlist/clear', {
      method: 'DELETE', headers: { Authorization: `Bearer ${userToken}` }
    });
    log('clear wishlist', clearWish);

    // admin delete product
    const del = await api(`/api/products/${prodId}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` }
    });
    log('delete product', del);

    console.log('\nSmoke test finished');

  } catch (err){
    console.error('Smoke test error', err);
  }
})();
