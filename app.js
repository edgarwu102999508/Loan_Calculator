// Chart

document
  .getElementById("loan-form")
  .addEventListener("submit", calculateResults);

function calculateResults(e) {
  // UI Variables
  const loanAmount = document.querySelector("#amount").value;
  const annualInterest = document.querySelector("#interest").value;
  const repYear = document.querySelector("#years").value;
  const monthlyPayment = document.querySelector("#monthly-payment");
  const totalInterest = document.querySelector("#total-interest");
  const totalPayment = document.querySelector("#total-payment");

  // Convert currency format
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });

  // Calculation Formula
  const principal = parseFloat(loanAmount);
  const monthlyInterest = parseFloat(annualInterest) / 12 / 100;
  const numOfMonthlyPayment = parseFloat(repYear) * 12;
  const x = Math.pow(1 + monthlyInterest, numOfMonthlyPayment);
  const monthly = (principal * x * monthlyInterest) / (x - 1);

  if (isFinite(monthly)) {
    const loading = document.querySelector("#loading");
    const results = document.querySelector("#results");
    results.style.display = "none";
    loading.style.display = "block";
    setTimeout(function () {
      loading.style.display = "none";
      results.style.display = "block";
    }, 1000);

    monthlyPayment.innerHTML = formatter.format(monthly);
    totalPayment.innerHTML = formatter.format(monthly * numOfMonthlyPayment);
    totalInterest.innerHTML = formatter.format(
      monthly * numOfMonthlyPayment - principal
    );

    let ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [repYear + " Year " + "Total Payment"],
        datasets: [
          {
            label: ["Principal"],
            data: [principal],
            backgroundColor: ["rgba(255, 206, 86, 0.2)"],
            borderColor: ["rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
          {
            label: ["Interest"],
            data: [(monthly * numOfMonthlyPayment - principal).toFixed(2)],
            backgroundColor: ["rgba(255, 70, 86, 0.2)"],
            borderColor: ["rgba(255, 70, 86, 1)"],
            borderWidth: 1,
          },
        ],
      },

      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              stacked: true,
              ticks: {
                stepSize: 5,
              },
            },
          ],
          yAxes: [
            {
              gridLines: { display: false },
              stacked: true,
              ticks: {
                stepSize: 500000,
                beginAtZero: true,
                userCallback: function (value, index, values) {
                  // Convert the number to a string and splite the string every 3 charaters from the end
                  value = value.toString();
                  value = value.split(/(?=(?:...)*$)/);
                  // Convert the array to a string and format the output
                  value = value.join(",");
                  return "$" + value;
                },
              },
            },
          ],
        },
      },
    });
  } else {
    const alert = document.querySelector(".alert");
    alert.style.display = "block";
    setTimeout(function () {
      alert.style.display = "none";
    }, 3000);
  }

  e.preventDefault();
}

// Reset button
const resetForm = document
  .getElementById("resetBtn")
  .addEventListener("click", reset);
function reset(e) {
  location.reload();
  e.preventDefault();
}
