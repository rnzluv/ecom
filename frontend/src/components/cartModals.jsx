// /components/cartModals.js

export function showConfirm(message) {
    return new Promise(resolve => {
      // CONTAINER
      const modal = document.createElement("div");
      modal.className = "custom-confirm-backdrop";
      modal.innerHTML = `
        <div class="custom-confirm-box">
          <p>${message}</p>
  
          <div class="custom-confirm-buttons">
            <button class="confirm-yes">Yes</button>
            <button class="confirm-no">Cancel</button>
          </div>
        </div>
      `;
  
      document.body.appendChild(modal);
  
      // YES
      modal.querySelector(".confirm-yes").onclick = () => {
        modal.remove();
        resolve(true);
      };
  
      // NO
      modal.querySelector(".confirm-no").onclick = () => {
        modal.remove();
        resolve(false);
      };
    });
  }
  