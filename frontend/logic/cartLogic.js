// /logic/cartLogic.js
import { showConfirm } from "../components/cartModals.js";

export function renderCartPage() {
  const tbody = document.getElementById("cart-items");
  const subtotalEl = document.querySelector(".subtotal p");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Merge duplicate items
  cart = mergeDuplicates(cart);
  saveCart(cart);

  function saveCart(data) {
    localStorage.setItem("cart", JSON.stringify(data));
  }

  // ---------------------------
  // RENDER CART TABLE
  // ---------------------------
  function render() {
    tbody.innerHTML = "";

    if (cart.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6" class="cart-empty">Your Cart is Empty</td></tr>
      `;
      subtotalEl.textContent = `Subtotal : ₱0.00`;
      checkoutBtn.disabled = true;
      deleteSelectedBtn.disabled = true;
      clearCartBtn.disabled = true;
      return;
    }

    deleteSelectedBtn.disabled = false;
    clearCartBtn.disabled = false;

    cart.forEach(item => {
      const total = item.price * item.quantity;

      tbody.innerHTML += `
        <tr>
          <td><input type="checkbox" class="cart-checkbox" data-id="${item._id || item.name}"></td>
          <td class="text-start">
            <img src="${item.image}" width="50" class="me-2 rounded">
            <a href="${item.link || '#'}" class="cart-item-link">${item.name}</a>
          </td>
          <td>₱${format(item.price)}</td>
          <td><input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item._id || item.name}"></td>
          <td class="item-total">₱${format(total)}</td>
          <td>
            <button class="delete-item-btn btn btn-sm btn-danger" data-id="${item._id || item.name}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    attachEvents();
    updateSubtotal();
  }

  // ---------------------------
  // EVENTS
  // ---------------------------
  function attachEvents() {
    document.querySelectorAll(".qty-input").forEach(input => {
      input.addEventListener("input", e => {
        const id = e.target.dataset.id;
        const qty = parseInt(e.target.value);
        const item = cart.find(i => (i._id || i.name) == id);
        if (!item || qty < 1) return;

        item.quantity = qty;
        saveCart(cart);
        render();
      });
    });

    // DELETE ONE ITEM
    document.querySelectorAll(".delete-item-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const item = cart.find(i => (i._id || i.name) == id);

        const ok = await showConfirm(`Remove "${item.name}" from cart?`);
        if (!ok) return;

        cart = cart.filter(i => (i._id || i.name) != id);
        saveCart(cart);
        render();
      });
    });

    // DELETE SELECTED ITEMS
    deleteSelectedBtn.addEventListener("click", async () => {
      const selectedIds = [...document.querySelectorAll(".cart-checkbox:checked")]
        .map(cb => cb.dataset.id);

      if (selectedIds.length === 0) {
        alert("Select at least one item to delete.");
        return;
      }

      const ok = await showConfirm("Delete selected items?");
      if (!ok) return;

      cart = cart.filter(item => !selectedIds.includes(item._id || item.name));
      saveCart(cart);
      render();
    });

    // CLEAR CART
    clearCartBtn.addEventListener("click", async () => {
      const ok = await showConfirm("Clear your entire cart?");
      if (!ok) return;

      cart = [];
      saveCart(cart);
      render();
    });

    // CHECKOUT
    checkoutBtn.addEventListener("click", () => {
      const selectedIds = [...document.querySelectorAll(".cart-checkbox:checked")]
        .map(cb => cb.dataset.id);

      const selectedItems = cart.filter(item => selectedIds.includes(item._id || item.name));
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));

      window.location.href = "checkout.html";
    });

    document.querySelectorAll(".cart-checkbox").forEach(cb => {
      cb.addEventListener("change", updateSubtotal);
    });
  }

  // ---------------------------
  // HELPERS
  // ---------------------------
  function mergeDuplicates(arr) {
    return arr.reduce((acc, item) => {
      const existing = acc.find(i => i.name === item.name);
      if (existing) existing.quantity += item.quantity;
      else acc.push(item);
      return acc;
    }, []);
  }

  function updateSubtotal() {
    let total = 0;

    document.querySelectorAll(".cart-checkbox:checked").forEach(cb => {
      const item = cart.find(i => (i._id || i.name) == cb.dataset.id);
      if (item) total += item.price * item.quantity;
    });

    subtotalEl.textContent = `Subtotal : ₱${format(total)}`;
    checkoutBtn.disabled = total === 0;
  }

  function format(num) {
    return num.toLocaleString("en-PH", { minimumFractionDigits: 2 });
  }

  // INITIAL RENDER
  render();
}
