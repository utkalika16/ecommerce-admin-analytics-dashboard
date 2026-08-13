/* ==========================================
   SHOPSPHERE - MAIN APPLICATION
   ========================================== */

const STORAGE_PRODUCTS = "shopsphere_products";
const STORAGE_ORDERS = "shopsphere_orders";
const STORAGE_THEME = "shopsphere_theme";
const STORAGE_LAYOUT = "shopsphere_layout";


/* ==========================================
   DEFAULT PRODUCTS
   ========================================== */

const defaultProducts = [

  {
    id: "P001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    stock: 8,
    description: "Premium wireless headphones with noise cancellation."
  },

  {
    id: "P002",
    name: "Smart Watch Pro",
    category: "Electronics",
    price: 5999,
    stock: 24,
    description: "Fitness tracking smartwatch with AMOLED display."
  },

  {
    id: "P003",
    name: "Running Shoes",
    category: "Sports",
    price: 3299,
    stock: 5,
    description: "Lightweight running shoes for everyday training."
  },

  {
    id: "P004",
    name: "Cotton Hoodie",
    category: "Fashion",
    price: 1899,
    stock: 32,
    description: "Comfortable premium cotton hoodie."
  },

  {
    id: "P005",
    name: "Desk Lamp",
    category: "Home",
    price: 1299,
    stock: 3,
    description: "Modern LED desk lamp with adjustable brightness."
  },

  {
    id: "P006",
    name: "Skincare Set",
    category: "Beauty",
    price: 2199,
    stock: 0,
    description: "Daily skincare essentials set."
  },

  {
    id: "P007",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 1799,
    stock: 17,
    description: "Portable speaker with powerful sound."
  },

  {
    id: "P008",
    name: "Travel Backpack",
    category: "Fashion",
    price: 2499,
    stock: 11,
    description: "Water-resistant backpack for travel and college."
  },

  {
    id: "P009",
    name: "Yoga Mat",
    category: "Sports",
    price: 999,
    stock: 4,
    description: "Non-slip exercise and yoga mat."
  },

  {
    id: "P010",
    name: "Coffee Maker",
    category: "Home",
    price: 4499,
    stock: 14,
    description: "Compact automatic coffee maker."
  }

];


/* ==========================================
   DEFAULT ORDERS
   ========================================== */

const defaultOrders = [

  {
    id: "ORD-1001",
    customer: "Aarav Sharma",
    date: "2026-08-13",
    items: 3,
    total: 7297,
    status: "Delivered"
  },

  {
    id: "ORD-1002",
    customer: "Ananya Rao",
    date: "2026-08-12",
    items: 1,
    total: 5999,
    status: "Processing"
  },

  {
    id: "ORD-1003",
    customer: "Rohan Mehta",
    date: "2026-08-11",
    items: 2,
    total: 4298,
    status: "Shipped"
  },

  {
    id: "ORD-1004",
    customer: "Priya Nair",
    date: "2026-08-10",
    items: 1,
    total: 1299,
    status: "Pending"
  },

  {
    id: "ORD-1005",
    customer: "Kabir Singh",
    date: "2026-08-09",
    items: 4,
    total: 9197,
    status: "Delivered"
  },

  {
    id: "ORD-1006",
    customer: "Ishita Das",
    date: "2026-08-08",
    items: 2,
    total: 2798,
    status: "Delivered"
  },

  {
    id: "ORD-1007",
    customer: "Arjun Patel",
    date: "2026-08-07",
    items: 1,
    total: 3299,
    status: "Cancelled"
  },

  {
    id: "ORD-1008",
    customer: "Meera Kapoor",
    date: "2026-08-06",
    items: 3,
    total: 5697,
    status: "Processing"
  }

];


/* ==========================================
   DATA HELPERS
   ========================================== */

function getProducts() {

  const stored =
    localStorage.getItem(STORAGE_PRODUCTS);

  if (stored) {

    try {
      return JSON.parse(stored);
    }

    catch (error) {
      console.error(error);
    }

  }

  localStorage.setItem(
    STORAGE_PRODUCTS,
    JSON.stringify(defaultProducts)
  );

  return [...defaultProducts];
}


function saveProducts(products) {

  localStorage.setItem(
    STORAGE_PRODUCTS,
    JSON.stringify(products)
  );

}


function getOrders() {

  const stored =
    localStorage.getItem(STORAGE_ORDERS);

  if (stored) {

    try {
      return JSON.parse(stored);
    }

    catch (error) {
      console.error(error);
    }

  }

  localStorage.setItem(
    STORAGE_ORDERS,
    JSON.stringify(defaultOrders)
  );

  return [...defaultOrders];
}


function saveOrders(orders) {

  localStorage.setItem(
    STORAGE_ORDERS,
    JSON.stringify(orders)
  );

}


/* ==========================================
   FORMATTERS
   ========================================== */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(value);

}


function formatNumber(value) {

  return new Intl.NumberFormat(
    "en-IN"
  ).format(value);

}


/* ==========================================
   STATUS BADGE
   ========================================== */

function statusBadge(status) {

  const map = {

    Delivered: "success",

    Processing: "info",

    Shipped: "info",

    Pending: "warning",

    Cancelled: "danger",

    "In Stock": "success",

    "Low Stock": "warning",

    "Out of Stock": "danger"

  };

  return `
    <span class="badge ${map[status] || "neutral"}">
      ${status}
    </span>
  `;

}


/* ==========================================
   THEME
   ========================================== */

function initTheme() {

  const savedTheme =
    localStorage.getItem(STORAGE_THEME);

  if (savedTheme === "dark") {

    document.body.classList.add("dark");

  }

  const themeButton =
    document.getElementById("themeBtn");

  if (!themeButton) return;

  updateThemeIcon(themeButton);

  themeButton.addEventListener(
    "click",
    () => {

      document.body.classList.toggle("dark");

      const dark =
        document.body.classList.contains("dark");

      localStorage.setItem(
        STORAGE_THEME,
        dark ? "dark" : "light"
      );

      updateThemeIcon(themeButton);

    }
  );

}


function updateThemeIcon(button) {

  button.textContent =
    document.body.classList.contains("dark")
      ? "🌙"
      : "☀️";

}


/* ==========================================
   MOBILE SIDEBAR
   ========================================== */

function initSidebar() {

  const menuBtn =
    document.getElementById("menuBtn");

  const sidebar =
    document.getElementById("sidebar");

  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle("open");

    }
  );

}


/* ==========================================
   DASHBOARD STATS
   ========================================== */

function initDashboard() {

  const revenue =
    document.getElementById("statRevenue");

  if (!revenue) return;

  const products = getProducts();

  const orders = getOrders();

  const totalRevenue =
    orders
      .filter(order => order.status !== "Cancelled")
      .reduce(
        (sum, order) =>
          sum + Number(order.total),
        0
      );

  const customers =
    new Set(
      orders.map(
        order => order.customer
      )
    ).size;

  revenue.textContent =
    formatCurrency(totalRevenue);

  document.getElementById(
    "statOrders"
  ).textContent =
    formatNumber(orders.length);

  document.getElementById(
    "statCustomers"
  ).textContent =
    formatNumber(customers);

  document.getElementById(
    "statProducts"
  ).textContent =
    formatNumber(products.length);


  const lowStock =
    products.filter(
      product =>
        product.stock > 0 &&
        product.stock <= 5
    ).length;

  document.getElementById(
    "lowStockCount"
  ).textContent =
    `${lowStock} items`;

  renderInventoryAlerts(products);

  renderRecentOrders(orders);

  createDashboardCharts(orders, products);

  initDashboardRange();

}


/* ==========================================
   INVENTORY ALERTS
   ========================================== */

function renderInventoryAlerts(products) {

  const container =
    document.getElementById(
      "inventoryAlerts"
    );

  if (!container) return;

  const alerts =
    products.filter(
      product =>
        product.stock <= 5
    );

  if (!alerts.length) {

    container.innerHTML = `
      <div class="alert-item">
        <div class="alert-icon low">✓</div>
        <div class="alert-info">
          <strong>Inventory looks healthy</strong>
          <span>No products require attention.</span>
        </div>
      </div>
    `;

    return;

  }


  container.innerHTML =
    alerts
      .slice(0, 5)
      .map(product => {

        const out =
          product.stock === 0;

        return `

          <div class="alert-item">

            <div class="alert-icon ${out ? "out" : "low"}">
              ${out ? "×" : "!"}
            </div>

            <div class="alert-info">

              <strong>
                ${product.name}
              </strong>

              <span>
                ${
                  out
                    ? "Out of stock"
                    : `${product.stock} units remaining`
                }
              </span>

            </div>

          </div>

        `;

      })
      .join("");

}


/* ==========================================
   RECENT ORDERS
   ========================================== */

function renderRecentOrders(orders) {

  const tbody =
    document.getElementById(
      "recentOrders"
    );

  if (!tbody) return;

  tbody.innerHTML =
    orders
      .slice(0, 5)
      .map(order => `

        <tr>

          <td>
            <strong>
              ${order.id}
            </strong>
          </td>

          <td>
            ${order.customer}
          </td>

          <td>
            ${formatCurrency(order.total)}
          </td>

          <td>
            ${statusBadge(order.status)}
          </td>

        </tr>

      `)
      .join("");

}


/* ==========================================
   CHART DATA
   ========================================== */

function generateRevenueData(days, orders) {

  const result = [];

  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {

    const date =
      new Date(today);

    date.setDate(
      today.getDate() - i
    );

    const dateString =
      date.toISOString().split("T")[0];

    const dayOrders =
      orders.filter(
        order =>
          order.date === dateString &&
          order.status !== "Cancelled"
      );

    let value =
      dayOrders.reduce(
        (sum, order) =>
          sum + Number(order.total),
        0
      );

    if (value === 0) {

      value =
        Math.floor(
          3000 +
          Math.random() * 9000
        );

    }

    result.push({
      date: date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short"
        }
      ),

      value
    });

  }

  return result;

}


/* ==========================================
   DASHBOARD CHARTS
   ========================================== */

let dashboardRevenueChart = null;
let dashboardCategoryChart = null;


function createDashboardCharts(
  orders,
  products,
  days = 30
) {

  const revenueCanvas =
    document.getElementById(
      "revenueChart"
    );

  if (!revenueCanvas) return;


  const revenueData =
    generateRevenueData(
      days,
      orders
    );


  if (dashboardRevenueChart) {

    dashboardRevenueChart.destroy();

  }


  dashboardRevenueChart =
    new Chart(
      revenueCanvas,
      {

        type: "line",

        data: {

          labels:
            revenueData.map(
              item => item.date
            ),

          datasets: [

            {

              label: "Revenue",

              data:
                revenueData.map(
                  item => item.value
                ),

              borderColor: "#635bff",

              backgroundColor:
                "rgba(99,91,255,0.10)",

              fill: true,

              tension: 0.4,

              pointRadius: 2

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }

          },

          scales: {

            y: {

              beginAtZero: true,

              ticks: {

                callback:
                  value =>
                    "₹" +
                    Number(value)
                      .toLocaleString("en-IN")

              }

            },

            x: {

              grid: {
                display: false
              }

            }

          }

        }

      }
    );


  /* CATEGORY */

  const categoryCanvas =
    document.getElementById(
      "categoryChart"
    );

  if (!categoryCanvas) return;


  const categoryData = {};

  products.forEach(product => {

    categoryData[
      product.category
    ] =
      (categoryData[
        product.category
      ] || 0) +
      product.price *
      Math.max(
        1,
        10 - product.stock
      );

  });


  if (dashboardCategoryChart) {

    dashboardCategoryChart.destroy();

  }


  dashboardCategoryChart =
    new Chart(
      categoryCanvas,
      {

        type: "doughnut",

        data: {

          labels:
            Object.keys(categoryData),

          datasets: [

            {

              data:
                Object.values(
                  categoryData
                )

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              position: "bottom",

              labels: {
                boxWidth: 10
              }

            }

          }

        }

      }
    );

}


/* ==========================================
   DASHBOARD DATE RANGE
   ========================================== */

function initDashboardRange() {

  const select =
    document.getElementById(
      "dashboardRange"
    );

  if (!select) return;

  select.addEventListener(
    "change",
    () => {

      const orders = getOrders();

      const products = getProducts();

      createDashboardCharts(
        orders,
        products,
        Number(select.value)
      );

    }
  );

}


/* ==========================================
   DRAG & DROP DASHBOARD
   ========================================== */

function initDragDrop() {

  const widgets =
    document.querySelectorAll(
      ".draggable-widget"
    );

  if (!widgets.length) return;


  let dragged = null;


  widgets.forEach(widget => {

    widget.addEventListener(
      "dragstart",
      () => {

        dragged = widget;

        widget.classList.add(
          "dragging"
        );

      }
    );


    widget.addEventListener(
      "dragend",
      () => {

        widget.classList.remove(
          "dragging"
        );

        saveDashboardLayout();

      }
    );


    widget.addEventListener(
      "dragover",
      event => {

        event.preventDefault();

        if (
          dragged &&
          dragged !== widget
        ) {

          const rect =
            widget.getBoundingClientRect();

          const after =
            event.clientY -
            rect.top >
            rect.height / 2;

          widget.parentNode.insertBefore(
            dragged,
            after
              ? widget.nextSibling
              : widget
          );

        }

      }
    );

  });

}


/* ==========================================
   SAVE LAYOUT
   ========================================== */

function saveDashboardLayout() {

  const widgets =
    document.querySelectorAll(
      ".draggable-widget"
    );

  const layout =
    [...widgets].map(
      widget =>
        widget.dataset.widget
    );

  localStorage.setItem(
    STORAGE_LAYOUT,
    JSON.stringify(layout)
  );

}


/* ==========================================
   RESTORE LAYOUT
   ========================================== */

function restoreDashboardLayout() {

  const saved =
    localStorage.getItem(
      STORAGE_LAYOUT
    );

  if (!saved) return;

  let layout;

  try {

    layout =
      JSON.parse(saved);

  }

  catch {

    return;

  }


  const container =
    document.querySelector(
      ".dashboard-grid"
    );

  if (!container) return;


  layout.forEach(id => {

    const element =
      document.querySelector(
        `[data-widget="${id}"]`
      );

    if (element) {

      container.appendChild(
        element
      );

    }

  });

}


/* ==========================================
   INITIALIZATION
   ========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    getProducts();

    getOrders();

    initTheme();

    initSidebar();

    initDashboard();

    initDragDrop();

    restoreDashboardLayout();

  }
);