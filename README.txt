# FinTech Dashboard

Professional FinTech Dashboard built with **React.js + Bootstrap** for frontend, **Web API ASP.NET Core MVC + C#** for backend, and a background **worker** for scheduled tasks. The application allows users to track their income, expenses, and cashflow, with interactive charts and filters.

---

## Features

### Frontend
- Responsive design using **Bootstrap**.
- Modern typography with **Roboto** font.
- Interactive dashboards with **Line**, **Pie**, and **Vertical Bar charts** using **Chart.js**.
- Transaction filtering by `type` (Income/Expense) and `category`.
- Planned transactions, transaction and category management.
- Authentication

## Backend
- Built with **Web API ASP.NET** using **C#**.
- Secure authentication with **Identity** and JWT authentication.
- RESTful API endpoints for transactions, categories, and charts, planned transaction.
- Supports filtered queries by type and category and range period.
- Handles data persistence with a **SQL database**.

### Worker
- Background worker implemented C# 
- Handle scheduled task: create transaction from planned transactions.
- Integrates with the main database to ensure consistent data processing.
-if the task of creating past transaction based on planned transaction stop, it will be memorized the last lunch date of the worker and it will restart creating transaztion from that date

---

## Tech Stack

- **Frontend**: React.js, Axios, Chart.js
- **Backend**: ASP.NET Core Web API (C#), Entity Framework Core, JWT Authentication, SQL Server
- **Worker**: .NET Worker Service (C#)
- **Styling**: CSS Modules, Roboto Font, Theme.js

---

## 🧪 How to Run Locally

1. Clone the repo:
   git clone https://github.com/caporaliismaele/PersonalBudgetSystem.git
   cd PersonalBudgetSystem


2. Run migrations and start the project:
   Update-Database -Context BudgetDbContext
   dotnet run of BugetAPi and PlannedTransactionWorker
   npm install on personalbugetfrontend and npm run dev
	
---

## Notes
- The application uses a professional fintech design with focus on readability and usability.
- Charts are fully interactive and dynamically update based on the selected filters.
- The worker ensures that background tasks are processed efficiently.

## Author
Developed by Ismaele Caporali  
Feel free to reach out on LinkedIn or by email (ismaelecaporali@gmail.com)!