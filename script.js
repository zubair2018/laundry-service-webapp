// Scroll from hero button to booking section
const heroBookBtn = document.getElementById("hero-book-btn");
const servicesSection = document.getElementById("services");

if (heroBookBtn && servicesSection) {
  heroBookBtn.addEventListener("click", () => {
    servicesSection.scrollIntoView({ behavior: "smooth" });
  });
}

// Cart logic
const cartBody = document.getElementById("cart-body");
const totalAmountEl = document.getElementById("total-amount");
let cart = [];

function renderCart() {
  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;

    const tdName = document.createElement("td");
    tdName.textContent = item.name;

    const tdPrice = document.createElement("td");
    tdPrice.textContent = "\u20b9" + item.price.toFixed(2);

    tr.appendChild(tdIndex);
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);

    cartBody.appendChild(tr);

    total += item.price;
  });

  totalAmountEl.textContent = "\u20b9" + total.toFixed(2);
}

// Add and remove buttons
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  const name = card.getAttribute("data-name");
  const price = Number(card.getAttribute("data-price"));

  const addBtn = card.querySelector(".add-btn");
  const removeBtn = card.querySelector(".remove-btn");

  addBtn.addEventListener("click", () => {
    cart.push({ name, price });
    renderCart();
  });

  removeBtn.addEventListener("click", () => {
    // Remove the first matching item from cart
    const index = cart.findIndex((item) => item.name === name);
    if (index !== -1) {
      cart.splice(index, 1);
      renderCart();
    }
  });
});

// Booking form + EmailJS
const bookNowBtn = document.getElementById("book-now-btn");
const bookingMessage = document.getElementById("booking-message");

bookNowBtn.addEventListener("click", function () {
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullName || !email || !phone) {
    bookingMessage.style.color = "#dc2626";
    bookingMessage.textContent = "Please fill all the details before booking.";
    return;
  }

  if (cart.length === 0) {
    bookingMessage.style.color = "#dc2626";
    bookingMessage.textContent = "Please add at least one service to the cart.";
    return;
  }

  // Prepare order details for email
  const orderLines = cart
    .map((item, idx) => `${idx + 1}. ${item.name} - \u20b9${item.price}`)
    .join("\n");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const templateParams = {
    customer_name: fullName,
    customer_email: email,
    customer_phone: phone,
    order_details: orderLines,
    order_total: `\u20b9${total.toFixed(2)}`,
  };

  // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with actual EmailJS IDs
  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(
      function () {
        bookingMessage.style.color = "#16a34a";
        bookingMessage.textContent =
          "Thank you for booking the service. We will get back to you soon!";
        // Optionally clear cart and form
        cart = [];
        renderCart();
      },
      function (error) {
        bookingMessage.style.color = "#dc2626";
        bookingMessage.textContent =
          "Something went wrong while sending email. Please try again.";
        console.error("EmailJS error:", error);
      }
    );
});

// Newsletter subscribe (dummy front-end only)
const subscribeBtn = document.getElementById("subscribe-btn");
const subscribeMsg = document.getElementById("subscribe-message");

subscribeBtn.addEventListener("click", () => {
  const name = document.getElementById("newsletter-name").value.trim();
  const email = document.getElementById("newsletter-email").value.trim();

  if (!name || !email) {
    subscribeMsg.style.color = "#f97316";
    subscribeMsg.textContent = "Please enter your name and email to subscribe.";
    return;
  }

  subscribeMsg.style.color = "#16a34a";
  subscribeMsg.textContent = "Subscribed successfully! Thank you for joining.";
});
