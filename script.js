let expenses = [];
let chartInstance = null;

function addExpense() {
    let amount = prompt("Enter expense amount:");
    let category = prompt("Enter category (Food, Rent, Shopping, etc.):");
    let date = new Date().toISOString().split('T')[0];

    if (amount && category) {
        amount = parseFloat(amount);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount! Please enter a valid number.");
            return;
        }
        expenses.push({ amount, category, date });

        console.log("Current Expenses: ", expenses);

        detectFraud(amount);
        updateChart();
        suggestSavingGoal();
    }
}

function detectFraud(amount) {
    if (amount > 5000) {
        alert("⚠️ Suspicious transaction detected! Amount: ₹" + amount);
    }
}

function updateChart() {
    let categories = {};

    expenses.forEach(expense => {
        if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
        } else {
            categories[expense.category] = expense.amount;
        }
    });

    let labels = Object.keys(categories);
    let data = Object.values(categories);

    if (chartInstance) {
        chartInstance.destroy();
    }

    let ctx = document.getElementById('expenseChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['red', 'blue', 'green', 'orange', 'purple']
            }]
        }
    });
}

function suggestSavingGoal() {
    let totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    let savingGoal = totalSpent * 0.2;  

    document.getElementById("savingGoal").innerText = 
        totalSpent > 0 
            ? "Recommended Saving: ₹" + savingGoal.toFixed(2)
            : "No expenses recorded yet!";
}

// 🔹 Predict Future Expenses (Simple AI-based Estimation)
function predictFutureExpenses() {
    if (expenses.length === 0) {
        document.getElementById("futureExpense").innerText = "No expenses recorded yet!";
        return;
    }

    let totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    let avgDailyExpense = totalSpent / expenses.length || 0;  
    let futureExpense = avgDailyExpense * 30;  

    document.getElementById("futureExpense").innerText = 
        "Estimated Expenses for Next Month: ₹" + futureExpense.toFixed(2);
}

// 🔹 AI-Based Investment Suggestion (Basic Logic)
function suggestInvestment() {
    let totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    let recommendedInvestment = totalSpent * 0.3;  

    document.getElementById("investmentSuggestion").innerText = 
        totalSpent > 0 
            ? "Recommended Investment Amount: ₹" + recommendedInvestment.toFixed(2)
            : "No expenses recorded yet!";
}

// 🔹 AI-Powered Bill Payment Reminder (Basic Logic)
function billPaymentReminder() {
    let today = new Date();
    let upcomingBills = expenses
        .filter(expense => ["Rent", "Electricity", "Subscription", "EMI"].includes(expense.category))
        .map(expense => {
            let dueDate = new Date(expense.date);
            let daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            return { name: expense.category, daysLeft };
        })
        .filter(exp => exp.daysLeft > 0)
        .sort((a, b) => a.daysLeft - b.daysLeft);

    let reminderText = upcomingBills.length
        ? upcomingBills.map(exp => `🔔 ${exp.name} is due in ${exp.daysLeft} days.`).join("\n")
        : "✅ No upcoming bills!";

    document.getElementById("billReminder").innerText = reminderText;
}

// 🔹 Attach event listeners to buttons
document.getElementById("predictButton").addEventListener("click", predictFutureExpenses);
document.getElementById("investmentButton").addEventListener("click", suggestInvestment);
document.getElementById("billReminderButton").addEventListener("click", billPaymentReminder);