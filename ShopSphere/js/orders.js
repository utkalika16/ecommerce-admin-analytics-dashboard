/* ==========================================
   ORDER MANAGEMENT
   ========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const table =
      document.getElementById(
        "ordersTable"
      );

    if (!table) return;


    let orders =
      getOrders();


    const search =
      document.getElementById(
        "orderSearch"
      );


    const statusFilter =
      document.getElementById(
        "orderStatusFilter"
      );


    const sort =
      document.getElementById(
        "orderSort"
      );


    /* ======================================
       RENDER ORDERS
       ====================================== */

    function renderOrders() {

      const query =
        search.value
          .trim()
          .toLowerCase();


      const status =
        statusFilter.value;


      let filtered =
        orders.filter(
          order => {

            const matchesSearch =
              order.id
                .toLowerCase()
                .includes(query) ||

              order.customer
                .toLowerCase()
                .includes(query);


            const matchesStatus =
              status === "all" ||
              order.status === status;


            return (
              matchesSearch &&
              matchesStatus
            );

          }
        );


      /* SORT */

      if (
        sort.value === "newest"
      ) {

        filtered.sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

      }


      if (
        sort.value === "oldest"
      ) {

        filtered.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

      }


      if (
        sort.value === "high"
      ) {

        filtered.sort(
          (a, b) =>
            b.total - a.total
        );

      }


      if (
        sort.value === "low"
      ) {

        filtered.sort(
          (a, b) =>
            a.total - b.total
        );

      }


      table.innerHTML =
        filtered
          .map(order => `

            <tr>

              <td>
                <strong>
                  ${order.id}
                </strong>
              </td>


              <td>
                ${escapeHTML(order.customer)}
              </td>


              <td>
                ${order.date}
              </td>


              <td>
                ${order.items}
              </td>


              <td>
                ${formatCurrency(order.total)}
              </td>


              <td>
                ${statusBadge(order.status)}
              </td>


              <td>

                <select
                  class="select order-status-select"
                  data-id="${order.id}"
                  style="height:32px;"
                >

                  ${getStatusOptions(
                    order.status
                  )}

                </select>

              </td>

            </tr>

          `)
          .join("");


      updateOrderStats();

    }


    /* ======================================
       STATUS OPTIONS
       ====================================== */

    function getStatusOptions(
      current
    ) {

      const statuses = [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled"

      ];


      return statuses
        .map(
          status => `

            <option
              value="${status}"
              ${status === current
                ? "selected"
                : ""}
            >
              ${status}
            </option>

          `
        )
        .join("");

    }


    /* ======================================
       UPDATE SUMMARY
       ====================================== */

    function updateOrderStats() {

      document.getElementById(
        "orderCount"
      ).textContent =
        orders.length;


      document.getElementById(
        "pendingCount"
      ).textContent =
        orders.filter(
          order =>
            order.status ===
            "Pending"
        ).length;


      document.getElementById(
        "processingCount"
      ).textContent =
        orders.filter(
          order =>
            order.status ===
              "Processing" ||
            order.status ===
              "Shipped"
        ).length;


      document.getElementById(
        "deliveredCount"
      ).textContent =
        orders.filter(
          order =>
            order.status ===
            "Delivered"
        ).length;

    }


    /* ======================================
       CHANGE ORDER STATUS
       ====================================== */

    table.addEventListener(
      "change",
      event => {

        const select =
          event.target.closest(
            ".order-status-select"
          );


        if (!select) return;


        const id =
          select.dataset.id;


        const order =
          orders.find(
            item =>
              item.id === id
          );


        if (!order) return;


        order.status =
          select.value;


        saveOrders(
          orders
        );


        renderOrders();

      }
    );


    /* ======================================
       FILTERS
       ====================================== */

    search.addEventListener(
      "input",
      renderOrders
    );


    statusFilter.addEventListener(
      "change",
      renderOrders
    );


    sort.addEventListener(
      "change",
      renderOrders
    );


    /* ======================================
       CSV EXPORT
       ====================================== */

    document.getElementById(
      "exportOrders"
    ).addEventListener(
      "click",
      () => {

        const rows = [

          [
            "Order ID",
            "Customer",
            "Date",
            "Items",
            "Total",
            "Status"
          ],

          ...orders.map(
            order => [

              order.id,

              order.customer,

              order.date,

              order.items,

              order.total,

              order.status

            ]
          )

        ];


        downloadCSV(
          rows,
          "shopsphere-orders.csv"
        );

      }
    );


    /* ======================================
       INITIALIZE
       ====================================== */

    renderOrders();

  }
);


/* ==========================================
   HTML ESCAPE
   ========================================== */

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* ==========================================
   CSV
   ========================================== */

function downloadCSV(
  rows,
  filename
) {

  const csv =
    rows
      .map(
        row =>
          row
            .map(
              value =>
                `"${String(value)
                  .replaceAll(
                    '"',
                    '""'
                  )}"`
            )
            .join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download = filename;

  link.click();

  URL.revokeObjectURL(
    url
  );

}