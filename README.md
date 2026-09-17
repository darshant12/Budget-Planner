# 📊 SmartBudget — Monthly Budget Planner & Expense Analytics

A modern, responsive monthly budget planner and expense tracking web application. Built with vanilla **HTML5, CSS3, JavaScript (ES6+)**, and **Chart.js** for visualization.

![SmartBudget Preview](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

- **🎯 Category Budget Allocation**:
  - Set custom budget thresholds per category.
  - Choose customizable category icons and vibrant color palettes.
  - Easily add new custom categories or modify existing ones.

- **📈 Interactive Chart.js Visualizations**:
  - **Budget vs Actual Comparison**: Side-by-side grouped bar chart comparing planned budget against actual spending per category.
  - **Category Spending Share**: Interactive Doughnut chart showing percentage breakdown by expense category with custom center summaries.
  - **Daily Spending Velocity**: Cumulative spending trend line against linear monthly pace.

- **🚨 Real-Time Over-Budget Warning Indicators**:
  - Color-coded progress bars for each category:
    - 🟢 **Safe** (`< 75%` limit)
    - 🟡 **Near Limit** (`75% - 99.9%` limit)
    - 🔴 **Over Budget** (`≥ 100%` limit with glowing pulse indicators and striped animated fill).
  - Global dashboard alert banner showing count of exceeded budgets and total excess amounts.
  - Immediate toast notification warnings whenever a new expense causes a category to exceed its limit.

- **⚡ Core Data Aggregation with `Array.prototype.reduce`**:
  - Category spending aggregation: `expenses.reduce(...)`
  - Monthly budget calculations: `categories.reduce(...)`
  - Monthly total spend & deficit summaries: `expenses.reduce(...)`
  - Daily timeline breakdown for trajectory charts: `expenses.reduce(...)`

- **💾 LocalStorage & Data Management**:
  - Zero setup required — automatically persists all categories and transactions across sessions.
  - Pre-loaded with realistic sample dataset for the current month on first visit.
  - Export transactions to **CSV** format (compatible with Excel, Google Sheets).
  - Export & Import full database **JSON** backups.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic document structure, modal dialogs, and forms.
- **CSS3**: Modern dark-theme glassmorphism (`backdrop-filter`), CSS variables, flexible grid & flexbox layouts, micro-animations.
- **JavaScript (ES6+)**: OOP design (`AppState`, `ChartManager`, `UIController`), `Array.prototype.reduce` aggregations.
- **Chart.js 4.4+**: Responsive canvas data charts.
- **Lucide Icons**: Crisp SVG iconography.

---

## 🚀 Getting Started

1. Clone or download this project folder.
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, serve with any local HTTP server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
4. Start setting monthly budgets, logging daily expenses, and analyzing your financial trends!
