/* ==========================================
   PRODUCT MANAGEMENT
   ========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const table =
      document.getElementById(
        "productsTable"
      );

    if (!table) return;


    let products =
      getProducts();


    const search =
      document.getElementById(
        "productSearch"
      );

    const categoryFilter =
      document.getElementById(
        "categoryFilter"
      );

    const stockFilter =
      document.getElementById(
        "stockFilter"
      );


    const modal =
      document.getElementById(
        "productModal"
      );

    const form =
      document.getElementById(
        "productForm"
      );


    /* ======================================
       CATEGORY FILTER
       ====================================== */

    const categories =
      [
        ...new Set(
          products.map(
            product =>
              product.category
          )
        )
      ];


    categories.forEach(category => {

      const option =
        document.createElement(
          "option"
        );

      option.value = category;

      option.textContent = category;

      categoryFilter.appendChild(
        option
      );

    });


    /* ======================================
       RENDER PRODUCTS
       ====================================== */

    function renderProducts() {

      const searchText =
        search.value
          .trim()
          .toLowerCase();


      const category =
        categoryFilter.value;


      const stock =
        stockFilter.value;


      let filtered =
        products.filter(
          product => {

            const matchesSearch =
              product.name
                .toLowerCase()
                .includes(searchText) ||

              product.category
                .toLowerCase()
                .includes(searchText);


            const matchesCategory =
              category === "all" ||
              product.category === category;


            let matchesStock = true;


            if (stock === "in") {

              matchesStock =
                product.stock > 5;

            }


            if (stock === "low") {

              matchesStock =
                product.stock > 0 &&
                product.stock <= 5;

            }


            if (stock === "out") {

              matchesStock =
                product.stock === 0;

            }


            return (
              matchesSearch &&
              matchesCategory &&
              matchesStock
            );

          }
        );


      table.innerHTML =
        filtered
          .map(product => {

            let status;

            if (product.stock === 0) {

              status = "Out of Stock";

            }

            else if (
              product.stock <= 5
            ) {

              status = "Low Stock";

            }

            else {

              status = "In Stock";

            }


            return `

              <tr>

                <td>

                  <div class="product-cell">

                    <div class="product-image">
                      ${product.name.charAt(0)}
                    </div>

                    <div>

                      <strong>
                        ${escapeHTML(product.name)}
                      </strong>

                      <span>
                        ${product.id}
                      </span>

                    </div>

                  </div>

                </td>


                <td>
                  ${escapeHTML(product.category)}
                </td>


                <td>
                  ${formatCurrency(product.price)}
                </td>


                <td>
                  ${product.stock}
                </td>


                <td>
                  ${statusBadge(status)}
                </td>


                <td>

                  <div class="action-group">

                    <button
                      class="small-btn edit-product"
                      data-id="${product.id}"
                      title="Edit"
                    >
                      ✎
                    </button>


                    <button
                      class="small-btn delete-product"
                      data-id="${product.id}"
                      title="Delete"
                    >
                      🗑
                    </button>

                  </div>

                </td>

              </tr>

            `;

          })
          .join("");


      updateStats();

    }


    /* ======================================
       UPDATE PRODUCT STATS
       ====================================== */

    function updateStats() {

      const total =
        products.length;


      const inStock =
        products.filter(
          p => p.stock > 5
        ).length;


      const lowStock =
        products.filter(
          p =>
            p.stock > 0 &&
            p.stock <= 5
        ).length;


      const outStock =
        products.filter(
          p => p.stock === 0
        ).length;


      document.getElementById(
        "productTotal"
      ).textContent = total;


      document.getElementById(
        "inStockTotal"
      ).textContent = inStock;


      document.getElementById(
        "lowStockTotal"
      ).textContent = lowStock;


      document.getElementById(
        "outStockTotal"
      ).textContent = outStock;

    }


    /* ======================================
       OPEN ADD MODAL
       ====================================== */

    document.getElementById(
      "addProductBtn"
    ).addEventListener(
      "click",
      () => {

        openModal();

      }
    );


    /* ======================================
       OPEN MODAL
       ====================================== */

    function openModal(product = null) {

      modal.classList.add(
        "show"
      );


      document.getElementById(
        "modalTitle"
      ).textContent =
        product
          ? "Edit Product"
          : "Add Product";


      document.getElementById(
        "productId"
      ).value =
        product
          ? product.id
          : "";


      document.getElementById(
        "productName"
      ).value =
        product
          ? product.name
          : "";


      document.getElementById(
        "productCategory"
      ).value =
        product
          ? product.category
          : "Electronics";


      document.getElementById(
        "productPrice"
      ).value =
        product
          ? product.price
          : "";


      document.getElementById(
        "productStock"
      ).value =
        product
          ? product.stock
          : "";


      document.getElementById(
        "productDescription"
      ).value =
        product
          ? product.description || ""
          : "";

    }


    /* ======================================
       CLOSE MODAL
       ====================================== */

    function closeModal() {

      modal.classList.remove(
        "show"
      );

      form.reset();

    }


    document.getElementById(
      "closeModal"
    ).addEventListener(
      "click",
      closeModal
    );


    document.getElementById(
      "cancelModal"
    ).addEventListener(
      "click",
      closeModal
    );


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeModal();

        }

      }
    );


    /* ======================================
       SAVE PRODUCT
       ====================================== */

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const id =
          document.getElementById(
            "productId"
          ).value;


        const product = {

          id:
            id ||
            "P" +
              String(
                Date.now()
              ).slice(-5),

          name:
            document.getElementById(
              "productName"
            ).value.trim(),

          category:
            document.getElementById(
              "productCategory"
            ).value,

          price:
            Number(
              document.getElementById(
                "productPrice"
              ).value
            ),

          stock:
            Number(
              document.getElementById(
                "productStock"
              ).value
            ),

          description:
            document.getElementById(
              "productDescription"
            ).value.trim()

        };


        if (id) {

          products =
            products.map(
              existing =>
                existing.id === id
                  ? product
                  : existing
            );

        }

        else {

          products.unshift(
            product
          );

        }


        saveProducts(
          products
        );


        closeModal();

        renderProducts();

      }
    );


    /* ======================================
       EDIT / DELETE
       ====================================== */

    table.addEventListener(
      "click",
      event => {

        const editButton =
          event.target.closest(
            ".edit-product"
          );


        const deleteButton =
          event.target.closest(
            ".delete-product"
          );


        if (editButton) {

          const id =
            editButton.dataset.id;


          const product =
            products.find(
              p => p.id === id
            );


          if (product) {

            openModal(
              product
            );

          }

        }


        if (deleteButton) {

          const id =
            deleteButton.dataset.id;


          const product =
            products.find(
              p => p.id === id
            );


          if (!product) return;


          const confirmed =
            confirm(
              `Delete "${product.name}"?`
            );


          if (!confirmed) return;


          products =
            products.filter(
              p => p.id !== id
            );


          saveProducts(
            products
          );


          renderProducts();

        }

      }
    );


    /* ======================================
       FILTER EVENTS
       ====================================== */

    search.addEventListener(
      "input",
      renderProducts
    );


    categoryFilter.addEventListener(
      "change",
      renderProducts
    );


    stockFilter.addEventListener(
      "change",
      renderProducts
    );


    /* ======================================
       CSV EXPORT
       ====================================== */

    document.getElementById(
      "exportProducts"
    ).addEventListener(
      "click",
      () => {

        const rows = [

          [
            "ID",
            "Product",
            "Category",
            "Price",
            "Stock",
            "Description"
          ],

          ...products.map(
            product => [

              product.id,

              product.name,

              product.category,

              product.price,

              product.stock,

              product.description || ""

            ]
          )

        ];


        downloadCSV(
          rows,
          "shopsphere-products.csv"
        );

      }
    );


    /* ======================================
       INITIAL RENDER
       ====================================== */

    renderProducts();

  }
);


/* ==========================================
   SECURITY HELPER
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
   CSV DOWNLOAD
   ========================================== */

function downloadCSV(rows, filename) {

  const csv =
    rows
      .map(
        row =>
          row
            .map(
              value =>
                `"${String(value)
                  .replaceAll('"', '""')}"`
            )
            .join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
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