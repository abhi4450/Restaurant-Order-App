axios.defaults.headers.post["Content-Type"] = "application/json";

window.addEventListener("DOMContentLoaded", function () {
  // Load initial data
  displayData();
});

document
  .getElementById("myform")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get values from the form
    const price = document.getElementById("price").value;
    const dish = document.getElementById("dish").value;
    const table = document.getElementById("table").value;

    // Create order object
    const order = {
      price: price,
      dish: dish,
      table: table,
    };

    try {
      await storeDataToBackend(order);
      await displayData();
    } catch (error) {
      console.error("Error:", error);
    }
  });

async function storeDataToBackend(data) {
  try {
    await axios.post(
      "https://crudcrud.com/api/a82b452f341447a8aeff82bc04cde1ff/restaurantOrder",
      data
    );
  } catch (error) {
    console.error("Error storing data:", error);
    throw error; // Propagate the error to the caller
  }
}

async function displayData() {
  try {
    const res = await axios.get(
      "https://crudcrud.com/api/a82b452f341447a8aeff82bc04cde1ff/restaurantOrder"
    );

    // Clear existing content in the ul outside of the loop
    document.getElementById("table-1").innerHTML = "";
    document.getElementById("table-2").innerHTML = "";
    document.getElementById("table-3").innerHTML = "";

    res.data.forEach((ele) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${ele.price} - ${ele.table} - ${ele.dish}`;
      listItem.dataset.orderId = ele._id;

      // Create a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete Order";
      deleteButton.className = "btn btn-outline-danger ms-2";
      deleteButton.addEventListener("click", function () {
        // Remove the li element when the delete button is clicked
        deleteOrderFromBackend(ele._id, listItem);
      });

      // Append the delete button to the li element
      listItem.appendChild(deleteButton);

      const targetUl = document.getElementById(ele.table);

      // Append the li element to the ul
      targetUl.appendChild(listItem);
    });

    console.log("Received data:", res.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function deleteOrderFromBackend(orderId, listItem) {
  try {
    await axios.delete(
      `https://crudcrud.com/api/a82b452f341447a8aeff82bc04cde1ff/restaurantOrder/${orderId}`
    );

    listItem.remove();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}
