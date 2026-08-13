/* ==========================================
   ANALYTICS
   ========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const revenueCanvas =
      document.getElementById(
        "analyticsRevenueChart"
      );


    if (!revenueCanvas) return;


    const orders =
      getOrders();


    const products =
      getProducts();


    let currentRange = 30;


    let revenueChart = null;

    let categoryChart = null;

    let statusChart = null;


    /* ======================================
       REVENUE DATA
       ====================================== */

    function generateData(
      days
    ) {

      const labels = [];

      const values = [];

      const today =
        new Date();


      for (
        let i = days - 1;
        i >= 0;
        i--
      ) {

        const date =
          new Date(today);


        date.setDate(
          today.getDate() - i
        );


        labels.push(
          date.toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short"
            }
          )
        );


        const actualDate =
          date
            .toISOString()
            .split("T")[0];


        const dayOrders =
          orders.filter(
            order =>
              order.date ===
                actualDate &&
              order.status !==
                "Cancelled"
          );


        let revenue =
          dayOrders.reduce(
            (sum, order) =>
              sum +
              Number(order.total),
            0
          );


        /*
          Since this is a static demo,
          generate realistic sample
          values for dates without
          orders.
        */

        if (revenue === 0) {

          revenue =
            Math.floor(
              4000 +
              Math.random() * 11000
            );

        }


        values.push(
          revenue
        );

      }


      return {
        labels,
        values
      };

    }


    /* ======================================
       REVENUE CHART
       ====================================== */

    function renderRevenueChart() {

      const data =
        generateData(
          currentRange
        );


      if (revenueChart) {

        revenueChart.destroy();

      }


      revenueChart =
        new Chart(
          revenueCanvas,
          {

            type: "line",

            data: {

              labels:
                data.labels,

              datasets: [

                {

                  label:
                    "Revenue",

                  data:
                    data.values,

                  borderColor:
                    "#635bff",

                  backgroundColor:
                    "rgba(99,91,255,0.12)",

                  fill: true,

                  tension: 0.4,

                  pointRadius:
                    currentRange > 90
                      ? 0
                      : 2

                }

              ]

            },


            options: {

              responsive: true,

              maintainAspectRatio:
                false,

              plugins: {

                legend: {
                  display: false
                },

                tooltip: {

                  callbacks: {

                    label:
                      context =>
                        formatCurrency(
                          context.raw
                        )

                  }

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
                          .toLocaleString(
                            "en-IN"
                          )

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


      updateAnalyticsStats(
        data.values
      );

    }


    /* ======================================
       ANALYTICS STATS
       ====================================== */

    function updateAnalyticsStats(
      values
    ) {

      const revenue =
        values.reduce(
          (sum, value) =>
            sum + value,
          0
        );


      const validOrders =
        orders.filter(
          order =>
            order.status !==
            "Cancelled"
        );


      const average =
        validOrders.length
          ? revenue /
            validOrders.length
          : 0;


      document.getElementById(
        "periodRevenue"
      ).textContent =
        formatCurrency(
          revenue
        );


      document.getElementById(
        "avgOrder"
      ).textContent =
        formatCurrency(
          average
        );

    }


    /* ======================================
       CATEGORY CHART
       ====================================== */

    function renderCategoryChart() {

      const categoryRevenue = {};


      products.forEach(
        product => {

          const estimatedSales =
            Math.max(
              1,
              15 - product.stock
            );


          categoryRevenue[
            product.category
          ] =
            (
              categoryRevenue[
                product.category
              ] || 0
            ) +
            product.price *
              estimatedSales;

        }
      );


      const canvas =
        document.getElementById(
          "analyticsCategoryChart"
        );


      categoryChart =
        new Chart(
          canvas,
          {

            type:
              "doughnut",

            data: {

              labels:
                Object.keys(
                  categoryRevenue
                ),

              datasets: [

                {

                  data:
                    Object.values(
                      categoryRevenue
                    )

                }

              ]

            },

            options: {

              responsive: true,

              maintainAspectRatio:
                false,

              plugins: {

                legend: {

                  position:
                    "bottom",

                  labels: {
                    boxWidth: 10
                  }

                }

              }

            }

          }
        );

    }


    /* ======================================
       STATUS CHART
       ====================================== */

    function renderStatusChart() {

      const statuses = [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled"

      ];


      const counts =
        statuses.map(
          status =>
            orders.filter(
              order =>
                order.status ===
                status
            ).length
        );


      const canvas =
        document.getElementById(
          "statusChart"
        );


      statusChart =
        new Chart(
          canvas,
          {

            type:
              "doughnut",

            data: {

              labels:
                statuses,

              datasets: [

                {

                  data:
                    counts

                }

              ]

            },

            options: {

              responsive: true,

              maintainAspectRatio:
                false,

              plugins: {

                legend: {

                  position:
                    "bottom",

                  labels: {
                    boxWidth: 10
                  }

                }

              }

            }

          }
        );

    }


    /* ======================================
       DATE RANGE BUTTONS
       ====================================== */

    document
      .querySelectorAll(
        ".range-btn"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  ".range-btn"
                )
                .forEach(
                  btn =>
                    btn.classList.remove(
                      "active"
                    )
                );


              button.classList.add(
                "active"
              );


              currentRange =
                Number(
                  button.dataset.range
                );


              renderRevenueChart();

            }
          );

        }
      );


    /* ======================================
       INITIALIZE
       ====================================== */

    renderRevenueChart();

    renderCategoryChart();

    renderStatusChart();

  }
);