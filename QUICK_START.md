# 🚀 QUICK START CHECKLIST

## Before Running

- [ ] Node.js installed
- [ ] MongoDB Atlas account active
- [ ] `.env` file exists in backend folder with:
  ```
  PORT=5000
  MONGO_URI=your_mongodb_connection
  JWT_SECRET=supersecretkey
  ```

## Starting the Application

### Method 1: Auto Start (Easiest)
```bash
# Windows
.\start.bat

# Mac/Linux
bash start.sh
```

### Method 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm install  # (first time only)
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install  # (first time only)
npm start
```

## Verify Everything Works

1. **Backend Running?**
   - Go to `http://localhost:5000/api/products`
   - Should return JSON array of products

2. **Frontend Running?**
   - Go to `http://localhost:3000`
   - Should see login page

3. **Can Login?**
   - Register new account
   - Login with credentials

4. **Can See Products?**
   - Home page shows featured products
   - Shop page shows all products

5. **Can Add to Cart?**
   - Click "Add to Cart" button
   - Go to /cart and see item

6. **Can Checkout?**
   - Fill checkout form
   - Click "Place Order"
   - See success page

7. **Footer Appears?**
   - Check every page
   - Footer should be consistent

## Expected URLs

```
Frontend:     http://localhost:3000
Backend:      http://localhost:5000
Login Page:   http://localhost:3000/user/login
Home Page:    http://localhost:3000/home
Shop:         http://localhost:3000/shop
Cart:         http://localhost:3000/cart
Checkout:     http://localhost:3000/checkout
About:        http://localhost:3000/about
```

## If Something Breaks

### Backend won't start?
```bash
# Check if port 5000 is free
# Kill process on port 5000
# Check MongoDB connection
# Check .env file
```

### Frontend won't start?
```bash
# Check if port 3000 is free
# Delete node_modules and reinstall
npm install
npm start
```

### API not responding?
```bash
# Verify backend is running
# Check Network tab in browser (F12)
# Check browser console for errors
# Verify JWT token in localStorage
```

### Products not showing?
```bash
# Add test products to MongoDB
# Check MongoDB Atlas connection
# Verify MONGO_URI in .env
```

## Database Schema Hints

### User Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "user" or "admin"
}
```

### Product Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "description": "string",
  "price": number,
  "image": "url or path"
}
```

### Cart Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref to User),
  "items": [
    {
      "product": ObjectId (ref to Product),
      "quantity": number
    }
  ]
}
```

## File Locations to Know

```
Backend Setup:
- backend/.env              ← Your credentials
- backend/server.js         ← Main server file
- backend/routes/           ← API endpoints

Frontend Setup:
- frontend/src/App.js       ← Main app file
- frontend/src/api.js       ← API configuration
- frontend/package.json     ← Dependencies & proxy

Public URLs:
- frontend/public/index.html
- backend/uploads/          ← Uploaded images
```

## Common Commands

```bash
# Start backend in dev mode
npm run dev

# Start frontend
npm start

# Install dependencies
npm install

# Check running processes
netstat -ano | findstr :3000  (Windows)
netstat -ano | findstr :5000  (Windows)
lsof -i :3000                 (Mac/Linux)
lsof -i :5000                 (Mac/Linux)

# Kill process on port
taskkill /PID [PID] /F        (Windows)
kill -9 [PID]                 (Mac/Linux)
```

## Features to Test

- [ ] User registration
- [ ] User login
- [ ] View home page
- [ ] View products
- [ ] Search products
- [ ] Add to cart
- [ ] View cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Proceed to checkout
- [ ] Place order
- [ ] View order confirmation
- [ ] View about page
- [ ] Consistent footer on all pages
- [ ] Mobile responsive design
- [ ] Dark mode (if enabled)

## Success Indicators

✅ No console errors
✅ All pages load quickly
✅ API calls complete successfully
✅ Footer appears on every page
✅ Smooth navigation between pages
✅ Cart updates in real-time
✅ Orders save to database
✅ Responsive on mobile devices

## Getting Help

1. Check browser console (F12)
2. Check backend terminal
3. Check Network tab for API calls
4. Read error messages carefully
5. Check MongoDB connection
6. Verify all files are created

## Final Notes

- First run might take longer (dependencies install)
- MongoDB must be running before backend
- Frontend requires backend to be running first
- Clear browser cache if seeing old content
- Hard refresh (Ctrl+Shift+R) if UI looks wrong

---

**Everything is ready to go! Start the app and test it out.** ✨

Questions? Check SETUP_GUIDE.md for detailed information.
