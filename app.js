/**
 * SmartBudget — Monthly Budget Planner & Expense Analytics
 * Comprehensive state management, data aggregation with Array.prototype.reduce,
 * Chart.js visualization, and LocalStorage persistence.
 */

// ============================================================================
// DEFAULT STATE & SAMPLE DATA
// ============================================================================

const STORAGE_KEYS = {
  CATEGORIES: 'smartbudget_categories_v1',
  EXPENSES: 'smartbudget_expenses_v1',
  ACTIVE_MONTH: 'smartbudget_active_month_v1'
};

const DEFAULT_CATEGORIES = [
  { id: 'cat_housing', name: 'Housing & Rent', budget: 1400, icon: 'home', color: '#6366f1' },
  { id: 'cat_food', name: 'Food & Groceries', budget: 600, icon: 'utensils', color: '#10b981' },
  { id: 'cat_transport', name: 'Transportation', budget: 350, icon: 'car', color: '#06b6d4' },
  { id: 'cat_utilities', name: 'Utilities & Bills', budget: 280, icon: 'zap', color: '#f59e0b' },
  { id: 'cat_entertainment', name: 'Entertainment', budget: 200, icon: 'film', color: '#ec4899' },
  { id: 'cat_shopping', name: 'Shopping & Misc', budget: 250, icon: 'shopping-bag', color: '#8b5cf6' },
  { id: 'cat_health', name: 'Health & Fitness', budget: 180, icon: 'heart-pulse', color: '#3b82f6' },
  { id: 'cat_savings', name: 'Savings & Goals', budget: 500, icon: 'piggy-bank', color: '#14b8a6' }
];

/**
 * Generates sample transactions for a given month (YYYY-MM).
 */
function generateSampleExpenses(yearMonth) {
  return [
    { id: 'exp_1', categoryId: 'cat_housing', amount: 1400, description: 'Monthly Apartment Rent', date: `${yearMonth}-01`, paymentMethod: 'Bank Transfer', createdAt: Date.now() - 86400000 * 16 },
    { id: 'exp_2', categoryId: 'cat_food', amount: 165.50, description: 'Whole Foods Market', date: `${yearMonth}-03`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 14 },
    { id: 'exp_3', categoryId: 'cat_transport', amount: 65.00, description: 'Gas Station Refill', date: `${yearMonth}-05`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 12 },
    { id: 'exp_4', categoryId: 'cat_utilities', amount: 145.20, description: 'Electric & Gas Utility', date: `${yearMonth}-06`, paymentMethod: 'Debit Card', createdAt: Date.now() - 86400000 * 11 },
    { id: 'exp_5', categoryId: 'cat_food', amount: 84.30, description: 'Weekend Dinner & Drinks', date: `${yearMonth}-08`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 9 },
    { id: 'exp_6', categoryId: 'cat_entertainment', amount: 19.99, description: 'Netflix & Spotify Streaming', date: `${yearMonth}-10`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 7 },
    { id: 'exp_7', categoryId: 'cat_shopping', amount: 285.00, description: 'New Running Shoes & Jacket', date: `${yearMonth}-11`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 6 },
    { id: 'exp_8', categoryId: 'cat_food', amount: 210.40, description: 'Costco Wholesale Haul', date: `${yearMonth}-12`, paymentMethod: 'Debit Card', createdAt: Date.now() - 86400000 * 5 },
    { id: 'exp_9', categoryId: 'cat_food', amount: 185.00, description: 'Gourmet Dinner with Friends', date: `${yearMonth}-14`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 3 },
    { id: 'exp_10', categoryId: 'cat_transport', amount: 120.00, description: 'Car Maintenance & Oil Change', date: `${yearMonth}-15`, paymentMethod: 'Debit Card', createdAt: Date.now() - 86400000 * 2 },
    { id: 'exp_11', categoryId: 'cat_health', amount: 95.00, description: 'Gym Membership & Supplements', date: `${yearMonth}-16`, paymentMethod: 'Credit Card', createdAt: Date.now() - 86400000 * 1 },
    { id: 'exp_12', categoryId: 'cat_savings', amount: 500.00, description: 'Automatic Roth IRA Deposit', date: `${yearMonth}-01`, paymentMethod: 'Bank Transfer', createdAt: Date.now() - 86400000 * 16 }
  ];
}

// ============================================================================
// APP STATE CLASS
// ============================================================================

class AppState {
  constructor() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    this.activeMonth = `${currentYear}-${currentMonth}`; // e.g. "2026-09"
    this.categories = [];
    this.expenses = [];
    this.activeCategoryFilter = 'all'; // 'all', 'over', 'near'
    this.activeChartTab = 'bar'; // 'bar', 'doughnut', 'line'
    this.init();
  }

  init() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const storedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      const storedMonth = localStorage.getItem(STORAGE_KEYS.ACTIVE_MONTH);

      if (storedCategories) {
        this.categories = JSON.parse(storedCategories);
      } else {
        this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
        this.saveCategories();
      }

      if (storedExpenses) {
        this.expenses = JSON.parse(storedExpenses);
      } else {
        this.expenses = generateSampleExpenses(this.activeMonth);
        this.saveExpenses();
      }

      if (storedMonth) {
        this.activeMonth = storedMonth;
      }
    } catch (e) {
      console.error('Error loading data from localStorage, falling back to defaults', e);
      this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
      this.expenses = generateSampleExpenses(this.activeMonth);
    }
  }

  saveCategories() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
  }

  saveExpenses() {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(this.expenses));
  }

  saveActiveMonth() {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MONTH, this.activeMonth);
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_MONTH);
    this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    this.expenses = generateSampleExpenses(this.activeMonth);
    this.saveCategories();
    this.saveExpenses();
    this.saveActiveMonth();
  }

  loadSampleData() {
    this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    this.expenses = generateSampleExpenses(this.activeMonth);
    this.saveCategories();
    this.saveExpenses();
  }

  // --- Category Actions ---
  addCategory(category) {
    const newCategory = {
      id: 'cat_' + Date.now(),
      name: category.name,
      budget: parseFloat(category.budget) || 0,
      icon: category.icon || 'folder',
      color: category.color || '#6366f1'
    };
    this.categories.push(newCategory);
    this.saveCategories();
    return newCategory;
  }

  updateCategory(id, updatedFields) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        ...updatedFields,
        budget: parseFloat(updatedFields.budget) || this.categories[index].budget
      };
      this.saveCategories();
      return this.categories[index];
    }
    return null;
  }

  deleteCategory(id) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
  }

  // --- Expense Actions ---
  addExpense(expense) {
    const newExpense = {
      id: 'exp_' + Date.now(),
      categoryId: expense.categoryId,
      amount: parseFloat(expense.amount),
      description: expense.description.trim(),
      date: expense.date, // 'YYYY-MM-DD'
      paymentMethod: expense.paymentMethod || 'Credit Card',
      createdAt: Date.now()
    };
    this.expenses.unshift(newExpense);
    this.saveExpenses();
    return newExpense;
  }

  deleteExpense(id) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.saveExpenses();
  }

  // ==========================================================================
  // DATA AGGREGATIONS (Utilizing Array.prototype.reduce)
  // ==========================================================================

  /**
   * Filter expenses that belong to the currently active month.
   */
  getMonthExpenses() {
    return this.expenses.filter(e => e.date && e.date.startsWith(this.activeMonth));
  }

  /**
   * Sum of all category budgets for the active month using reduce.
   */
  getTotalBudget() {
    return this.categories.reduce((total, cat) => total + (Number(cat.budget) || 0), 0);
  }

  /**
   * Sum of all actual expenses for the active month using reduce.
   */
  getTotalSpent() {
    const monthExpenses = this.getMonthExpenses();
    return monthExpenses.reduce((total, exp) => total + (Number(exp.amount) || 0), 0);
  }

  /**
   * Aggregate spending grouped by categoryId using reduce.
   */
  getSpendingByCategory() {
    const monthExpenses = this.getMonthExpenses();
    return monthExpenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + Number(exp.amount);
      return acc;
    }, {});
  }

  /**
   * Detailed breakdown per category with budget, spent, remaining, percentage, and warning status.
   */
  getCategoryBreakdown() {
    const spendingMap = this.getSpendingByCategory();

    return this.categories.map(cat => {
      const spent = spendingMap[cat.id] || 0;
      const budget = Number(cat.budget) || 0;
      const remaining = budget - spent;
      const percentUsed = budget > 0 ? (spent / budget) * 100 : (spent > 0 ? 100 : 0);
      const isOverBudget = spent > budget && budget > 0;
      const isNearLimit = spent >= budget * 0.75 && spent <= budget && budget > 0;

      let status = 'safe';
      if (isOverBudget) status = 'danger';
      else if (isNearLimit) status = 'warning';

      return {
        ...cat,
        spent,
        budget,
        remaining,
        percentUsed,
        isOverBudget,
        isNearLimit,
        status,
        excessAmount: isOverBudget ? spent - budget : 0
      };
    });
  }

  /**
   * Summary calculation of over-budget categories using reduce.
   */
  getOverBudgetSummary() {
    const breakdown = this.getCategoryBreakdown();
    return breakdown.reduce(
      (summary, cat) => {
        if (cat.isOverBudget) {
          summary.overBudgetCount += 1;
          summary.totalExcess += cat.excessAmount;
          summary.overBudgetCategories.push(cat);
        }
        if (cat.isNearLimit) {
          summary.nearLimitCount += 1;
          summary.nearLimitCategories.push(cat);
        }
        return summary;
      },
      { overBudgetCount: 0, totalExcess: 0, overBudgetCategories: [], nearLimitCount: 0, nearLimitCategories: [] }
    );
  }

  /**
   * Daily cumulative spend series for the line velocity chart using reduce.
   */
  getDailySpendSeries() {
    const [yearStr, monthStr] = this.activeMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const monthExpenses = this.getMonthExpenses();

    // Group expenses by day of month using reduce
    const dailyMap = monthExpenses.reduce((acc, exp) => {
      const parts = exp.date.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10);
        if (day) {
          acc[day] = (acc[day] || 0) + Number(exp.amount);
        }
      }
      return acc;
    }, {});

    const labels = [];
    const dailyData = [];
    const cumulativeData = [];
    const linearBudgetPace = [];
    const totalBudget = this.getTotalBudget();
    const dailyBudgetIncrement = totalBudget / daysInMonth;

    let cumulative = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      labels.push(`Day ${day}`);
      const spentToday = dailyMap[day] || 0;
      dailyData.push(spentToday);
      cumulative += spentToday;
      cumulativeData.push(cumulative);
      linearBudgetPace.push(parseFloat((dailyBudgetIncrement * day).toFixed(2)));
    }

    return {
      labels,
      dailyData,
      cumulativeData,
      linearBudgetPace,
      daysInMonth
    };
  }
}

// ============================================================================
// CHART MANAGER (Chart.js Controller)
// ============================================================================

class ChartManager {
  constructor(appState) {
    this.state = appState;
    this.barChart = null;
    this.doughnutChart = null;
    this.lineChart = null;
    this.init();
  }

  init() {
    // Set global Chart.js defaults for modern dark UI
    if (typeof Chart !== 'undefined') {
      Chart.defaults.color = '#9ca3af';
      Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
      Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
      Chart.defaults.plugins.tooltip.titleColor = '#f9fafb';
      Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
      Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.12)';
      Chart.defaults.plugins.tooltip.borderWidth = 1;
      Chart.defaults.plugins.tooltip.padding = 12;
      Chart.defaults.plugins.tooltip.cornerRadius = 8;
      Chart.defaults.plugins.tooltip.boxPadding = 6;
      Chart.defaults.plugins.tooltip.usePointStyle = true;

      this.initBarChart();
      this.initDoughnutChart();
      this.initLineChart();
    }
  }

  // --- 1. Grouped Budget vs Actual Bar Chart ---
  initBarChart() {
    const ctx = document.getElementById('budgetBarChart');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Monthly Budget',
            data: [],
            backgroundColor: 'rgba(99, 102, 241, 0.35)',
            borderColor: '#6366f1',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          },
          {
            label: 'Actual Spent',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutQuart'
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#9ca3af',
              font: { weight: 500 }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#9ca3af',
              callback: val => `$${val}`
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 16,
              color: '#d1d5db'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.raw || 0;
                return `${context.dataset.label}: $${val.toFixed(2)}`;
              },
              afterBody: (tooltipItems) => {
                if (tooltipItems.length >= 2) {
                  const budget = tooltipItems[0].raw;
                  const spent = tooltipItems[1].raw;
                  const diff = spent - budget;
                  const pct = budget > 0 ? ((spent / budget) * 100).toFixed(1) : 100;
                  if (diff > 0) {
                    return `⚠️ Over budget by +$${diff.toFixed(2)} (${pct}% used)`;
                  } else {
                    return `✓ Remaining: $${Math.abs(diff).toFixed(2)} (${pct}% used)`;
                  }
                }
                return '';
              }
            }
          }
        }
      }
    });
  }

  // --- 2. Category Share Doughnut Chart ---
  initDoughnutChart() {
    const ctx = document.getElementById('categoryDoughnutChart');
    if (!ctx) return;

    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: '#111827',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        animation: {
          duration: 600
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` Spent: $${val.toFixed(2)} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // --- 3. Daily Velocity Line Chart ---
  initLineChart() {
    const ctx = document.getElementById('spendingLineChart');
    if (!ctx) return;

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Cumulative Spent',
            data: [],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 6
          },
          {
            label: 'Linear Budget Target',
            data: [],
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
            ticks: { color: '#9ca3af' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
            ticks: {
              color: '#9ca3af',
              callback: val => `$${val}`
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              color: '#d1d5db'
            }
          },
          tooltip: {
            callbacks: {
              label: context => `${context.dataset.label}: $${Number(context.raw).toFixed(2)}`
            }
          }
        }
      }
    });
  }

  /**
   * Updates all chart data and re-renders smoothly.
   */
  updateCharts() {
    const breakdown = this.state.getCategoryBreakdown();
    const totalSpent = this.state.getTotalSpent();

    // 1. Update Bar Chart
    if (this.barChart) {
      const labels = breakdown.map(c => c.name);
      const budgetData = breakdown.map(c => c.budget);
      const spentData = breakdown.map(c => c.spent);
      
      const spentColors = breakdown.map(c => {
        if (c.isOverBudget) return 'rgba(244, 63, 94, 0.85)'; // Crimson
        if (c.isNearLimit) return 'rgba(245, 158, 11, 0.85)'; // Amber
        return 'rgba(16, 185, 129, 0.85)'; // Emerald
      });

      const spentBorderColors = breakdown.map(c => {
        if (c.isOverBudget) return '#f43f5e';
        if (c.isNearLimit) return '#f59e0b';
        return '#10b981';
      });

      this.barChart.data.labels = labels;
      this.barChart.data.datasets[0].data = budgetData;
      this.barChart.data.datasets[1].data = spentData;
      this.barChart.data.datasets[1].backgroundColor = spentColors;
      this.barChart.data.datasets[1].borderColor = spentBorderColors;
      this.barChart.update();
    }

    // 2. Update Doughnut Chart
    if (this.doughnutChart) {
      const spentCategories = breakdown.filter(c => c.spent > 0);

      const labels = spentCategories.length > 0 ? spentCategories.map(c => c.name) : ['No Expenses Yet'];
      const data = spentCategories.length > 0 ? spentCategories.map(c => c.spent) : [1];
      const colors = spentCategories.length > 0 ? spentCategories.map(c => c.color) : ['rgba(255, 255, 255, 0.1)'];

      this.doughnutChart.data.labels = labels;
      this.doughnutChart.data.datasets[0].data = data;
      this.doughnutChart.data.datasets[0].backgroundColor = colors;
      this.doughnutChart.update();

      const centerTotalEl = document.getElementById('doughnutCenterTotal');
      if (centerTotalEl) {
        centerTotalEl.textContent = `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      this.renderDoughnutLegend(spentCategories, totalSpent);
    }

    // 3. Update Line Velocity Chart
    if (this.lineChart) {
      const dailySeries = this.state.getDailySpendSeries();
      this.lineChart.data.labels = dailySeries.labels;
      this.lineChart.data.datasets[0].data = dailySeries.cumulativeData;
      this.lineChart.data.datasets[1].data = dailySeries.linearBudgetPace;
      this.lineChart.update();
    }
  }

  renderDoughnutLegend(spentCategories, totalSpent) {
    const legendEl = document.getElementById('customDoughnutLegend');
    if (!legendEl) return;

    if (spentCategories.length === 0) {
      legendEl.innerHTML = '<p class="text-muted" style="font-size:0.8125rem; text-align:center; padding: 20px;">No expenses logged for this month.</p>';
      return;
    }

    legendEl.innerHTML = spentCategories
      .sort((a, b) => b.spent - a.spent)
      .map(cat => {
        const pct = totalSpent > 0 ? ((cat.spent / totalSpent) * 100).toFixed(1) : 0;
        return `
          <div class="legend-item">
            <div class="legend-info">
              <span class="legend-color-dot" style="background-color: ${cat.color}"></span>
              <span class="legend-name">${escapeHTML(cat.name)}</span>
            </div>
            <span class="legend-amount">$${cat.spent.toFixed(2)} (${pct}%)</span>
          </div>
        `;
      }).join('');
  }
}

// ============================================================================
// UI CONTROLLER & EVENT HANDLERS
// ============================================================================

class UIController {
  constructor(appState, chartManager) {
    this.state = appState;
    this.charts = chartManager;
    this.init();
  }

  init() {
    this.bindEvents();
    this.populateCategorySelects();
    this.render();
    this.refreshIcons();
  }

  refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  bindEvents() {
    // --- Month Selector Events ---
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthBtn = document.getElementById('currentMonthBtn');
    const monthPicker = document.getElementById('monthPicker');
    const monthDisplay = document.getElementById('monthDisplay');

    if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => this.shiftMonth(-1));
    if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => this.shiftMonth(1));
    if (currentMonthBtn) currentMonthBtn.addEventListener('click', () => this.jumpToCurrentMonth());

    if (monthPicker) {
      monthPicker.addEventListener('change', (e) => {
        if (e.target.value) {
          this.state.activeMonth = e.target.value;
          this.state.saveActiveMonth();
          this.render();
        }
      });
    }

    if (monthDisplay && monthPicker) {
      monthDisplay.addEventListener('click', () => {
        monthPicker.showPicker ? monthPicker.showPicker() : monthPicker.click();
      });
    }

    // --- Chart Tab Switcher ---
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        chartTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const chartType = tab.dataset.chart;
        this.state.activeChartTab = chartType;

        const barEl = document.getElementById('barChartContainer');
        const doughnutEl = document.getElementById('doughnutChartContainer');
        const lineEl = document.getElementById('lineChartContainer');

        if (barEl) barEl.classList.toggle('hidden', chartType !== 'bar');
        if (doughnutEl) doughnutEl.classList.toggle('hidden', chartType !== 'doughnut');
        if (lineEl) lineEl.classList.toggle('hidden', chartType !== 'line');
      });
    });

    // --- Category Filter Pills ---
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.activeCategoryFilter = pill.dataset.filter;
        this.renderCategoryCards();
      });
    });

    // --- Quick Expense Form ---
    const quickExpenseForm = document.getElementById('quickExpenseForm');
    if (quickExpenseForm) {
      quickExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuickExpenseSubmit();
      });
    }

    // Set default date to today
    const quickDateInput = document.getElementById('quickDate');
    if (quickDateInput) {
      quickDateInput.value = new Date().toISOString().split('T')[0];
    }

    // --- Transaction Search & Filter ---
    const transactionSearch = document.getElementById('transactionSearch');
    const transactionCatFilter = document.getElementById('transactionCategoryFilter');

    if (transactionSearch) transactionSearch.addEventListener('input', () => this.renderTransactions());
    if (transactionCatFilter) transactionCatFilter.addEventListener('change', () => this.renderTransactions());

    // --- Alert Banner Dismiss ---
    const dismissAlertBtn = document.getElementById('dismissAlertBtn');
    if (dismissAlertBtn) {
      dismissAlertBtn.addEventListener('click', () => {
        const banner = document.getElementById('overBudgetBanner');
        if (banner) banner.classList.add('hidden');
      });
    }

    // --- Modals Handlers ---
    this.bindModalEvents();

    // --- Data Management & Export Events ---
    this.bindDataEvents();
  }

  bindModalEvents() {
    // Category Modal
    const categoryModal = document.getElementById('categoryModal');
    const openCategoryModalBtn = document.getElementById('openCategoryModalBtn');
    const addCategoryQuickBtn = document.getElementById('addCategoryQuickBtn');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');

    const openCatModal = () => {
      this.resetCategoryForm();
      this.renderCategoryManageList();
      if (categoryModal) categoryModal.classList.remove('hidden');
      this.refreshIcons();
    };

    if (openCategoryModalBtn) openCategoryModalBtn.addEventListener('click', openCatModal);
    if (addCategoryQuickBtn) addCategoryQuickBtn.addEventListener('click', openCatModal);

    if (closeCategoryModalBtn && categoryModal) {
      closeCategoryModalBtn.addEventListener('click', () => categoryModal.classList.add('hidden'));
      categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) categoryModal.classList.add('hidden');
      });
    }

    // Color swatches in Category Modal
    const swatches = document.querySelectorAll('.color-swatch');
    const selectedColorInput = document.getElementById('selectedColor');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        if (selectedColorInput) selectedColorInput.value = swatch.dataset.color;
      });
    });

    // Category Form Submit
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
      categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCategoryFormSubmit();
      });
    }

    const cancelEditCatBtn = document.getElementById('cancelEditCatBtn');
    if (cancelEditCatBtn) {
      cancelEditCatBtn.addEventListener('click', () => this.resetCategoryForm());
    }

    // Data Modal
    const dataModal = document.getElementById('dataModal');
    const openDataMenuBtn = document.getElementById('openDataMenuBtn');
    const closeDataModalBtn = document.getElementById('closeDataModalBtn');

    if (openDataMenuBtn && dataModal) openDataMenuBtn.addEventListener('click', () => dataModal.classList.remove('hidden'));
    if (closeDataModalBtn && dataModal) closeDataModalBtn.addEventListener('click', () => dataModal.classList.add('hidden'));
    if (dataModal) {
      dataModal.addEventListener('click', (e) => {
        if (e.target === dataModal) dataModal.classList.add('hidden');
      });
    }

    // Quick Expense Modal open button
    const openExpenseModalBtn = document.getElementById('openExpenseModalBtn');
    if (openExpenseModalBtn) {
      openExpenseModalBtn.addEventListener('click', () => {
        const formCard = document.querySelector('.quick-expense-panel');
        if (formCard) {
          formCard.scrollIntoView({ behavior: 'smooth' });
          const desc = document.getElementById('quickDescription');
          if (desc) desc.focus();
        }
      });
    }
  }

  bindDataEvents() {
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportCsvModalBtn = document.getElementById('exportCsvModalBtn');
    const doExportCsv = () => this.exportMonthlyExpensesCSV();
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', doExportCsv);
    if (exportCsvModalBtn) exportCsvModalBtn.addEventListener('click', doExportCsv);

    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this.exportFullDataJSON());
    }

    const importJsonFile = document.getElementById('importJsonFile');
    if (importJsonFile) {
      importJsonFile.addEventListener('change', (e) => this.handleImportJSON(e));
    }

    const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    const loadSampleModalBtn = document.getElementById('loadSampleModalBtn');
    const doLoadSample = () => {
      if (confirm('Load fresh realistic sample data for the active month? Existing data will be reset.')) {
        this.state.loadSampleData();
        this.populateCategorySelects();
        this.render();
        this.showToast('Sample dataset loaded successfully!', 'success');
        const dm = document.getElementById('dataModal');
        if (dm) dm.classList.add('hidden');
      }
    };
    if (loadSampleDataBtn) loadSampleDataBtn.addEventListener('click', doLoadSample);
    if (loadSampleModalBtn) loadSampleModalBtn.addEventListener('click', doLoadSample);

    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('⚠️ Warning: Are you sure you want to reset all data and categories?')) {
          this.state.resetAllData();
          this.populateCategorySelects();
          this.render();
          this.showToast('All budget data has been reset to defaults.', 'warning');
        }
      });
    }
  }

  shiftMonth(offset) {
    const [yearStr, monthStr] = this.state.activeMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + offset;

    if (month > 12) {
      month = 1;
      year += 1;
    } else if (month < 1) {
      month = 12;
      year -= 1;
    }

    this.state.activeMonth = `${year}-${String(month).padStart(2, '0')}`;
    this.state.saveActiveMonth();
    this.render();
  }

  jumpToCurrentMonth() {
    const today = new Date();
    this.state.activeMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    this.state.saveActiveMonth();
    this.render();
  }

  populateCategorySelects() {
    const quickCategorySelect = document.getElementById('quickCategory');
    const filterCatSelect = document.getElementById('transactionCategoryFilter');

    if (quickCategorySelect) {
      quickCategorySelect.innerHTML = this.state.categories.map(cat => `
        <option value="${cat.id}">${escapeHTML(cat.name)}</option>
      `).join('');
    }

    if (filterCatSelect) {
      const currentVal = filterCatSelect.value || 'all';
      filterCatSelect.innerHTML = `
        <option value="all">All Categories</option>
        ${this.state.categories.map(cat => `
          <option value="${cat.id}">${escapeHTML(cat.name)}</option>
        `).join('')}
      `;
      filterCatSelect.value = currentVal;
    }
  }

  render() {
    this.renderHeaderMonth();
    this.renderKPIs();
    this.renderAlertBanner();
    this.renderCategoryCards();
    this.renderTransactions();
    this.charts.updateCharts();
    this.refreshIcons();
  }

  renderHeaderMonth() {
    const [yearStr, monthStr] = this.state.activeMonth.split('-');
    const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    const monthName = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const txtEl = document.getElementById('currentMonthText');
    const pickerEl = document.getElementById('monthPicker');
    if (txtEl) txtEl.textContent = monthName;
    if (pickerEl) pickerEl.value = this.state.activeMonth;
  }

  renderKPIs() {
    const totalBudget = this.state.getTotalBudget();
    const totalSpent = this.state.getTotalSpent();
    const remaining = totalBudget - totalSpent;
    const spentPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const overSummary = this.state.getOverBudgetSummary();
    const monthExpenses = this.state.getMonthExpenses();

    // 1. Total Budget
    const bEl = document.getElementById('kpiTotalBudget');
    if (bEl) bEl.textContent = `$${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const cEl = document.getElementById('kpiCategoryCount');
    if (cEl) cEl.textContent = `${this.state.categories.length} active categories`;

    // 2. Total Spent
    const sEl = document.getElementById('kpiTotalSpent');
    if (sEl) sEl.textContent = `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const spentBadge = document.getElementById('kpiSpentPercentBadge');
    if (spentBadge) {
      spentBadge.textContent = `${spentPercent.toFixed(1)}% of budget`;
      if (spentPercent > 100) {
        spentBadge.className = 'badge badge-danger';
      } else if (spentPercent >= 80) {
        spentBadge.className = 'badge badge-warning';
      } else {
        spentBadge.className = 'badge badge-neutral';
      }
    }
    const expCountEl = document.getElementById('kpiExpenseCount');
    if (expCountEl) expCountEl.textContent = `${monthExpenses.length} transaction${monthExpenses.length === 1 ? '' : 's'}`;

    // 3. Remaining Balance Card
    const kpiRemainingLabel = document.getElementById('kpiRemainingLabel');
    const kpiRemainingAmount = document.getElementById('kpiRemainingAmount');
    const kpiRemainingBadge = document.getElementById('kpiRemainingBadge');
    const kpiRemainingIcon = document.getElementById('kpiRemainingIcon');
    const kpiRemainingStatus = document.getElementById('kpiRemainingStatus');

    if (kpiRemainingAmount) {
      if (remaining < 0) {
        if (kpiRemainingLabel) kpiRemainingLabel.textContent = 'Budget Deficit';
        kpiRemainingAmount.textContent = `-$${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        kpiRemainingAmount.style.color = 'var(--danger)';
        if (kpiRemainingBadge) kpiRemainingBadge.className = 'kpi-icon-badge kpi-rose';
        if (kpiRemainingIcon) kpiRemainingIcon.setAttribute('data-lucide', 'trending-down');
        if (kpiRemainingStatus) kpiRemainingStatus.textContent = 'Spending exceeded monthly limit';
      } else {
        if (kpiRemainingLabel) kpiRemainingLabel.textContent = 'Remaining Balance';
        kpiRemainingAmount.textContent = `$${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        kpiRemainingAmount.style.color = 'var(--text-main)';
        if (kpiRemainingBadge) kpiRemainingBadge.className = 'kpi-icon-badge kpi-emerald';
        if (kpiRemainingIcon) kpiRemainingIcon.setAttribute('data-lucide', 'trending-up');
        if (kpiRemainingStatus) kpiRemainingStatus.textContent = 'Within budgeted target';
      }
    }

    // 4. Budget Health Card
    const healthStatusEl = document.getElementById('kpiHealthStatus');
    const healthIconBadge = document.getElementById('kpiHealthIconBadge');
    const healthIcon = document.getElementById('kpiHealthIcon');
    const overCountBadge = document.getElementById('kpiOverBudgetCountBadge');

    if (healthStatusEl && overCountBadge) {
      if (overSummary.overBudgetCount > 0) {
        healthStatusEl.textContent = 'Attention Needed';
        healthStatusEl.style.color = 'var(--danger)';
        if (healthIconBadge) healthIconBadge.className = 'kpi-icon-badge kpi-rose';
        if (healthIcon) healthIcon.setAttribute('data-lucide', 'alert-circle');
        overCountBadge.textContent = `${overSummary.overBudgetCount} Over Budget`;
        overCountBadge.className = 'badge badge-danger';
      } else if (overSummary.nearLimitCount > 0) {
        healthStatusEl.textContent = 'Near Limits';
        healthStatusEl.style.color = 'var(--warning)';
        if (healthIconBadge) healthIconBadge.className = 'kpi-icon-badge kpi-amber';
        if (healthIcon) healthIcon.setAttribute('data-lucide', 'alert-triangle');
        overCountBadge.textContent = `${overSummary.nearLimitCount} Near Limit`;
        overCountBadge.className = 'badge badge-warning';
      } else {
        healthStatusEl.textContent = 'Healthy';
        healthStatusEl.style.color = 'var(--text-main)';
        if (healthIconBadge) healthIconBadge.className = 'kpi-icon-badge kpi-emerald';
        if (healthIcon) healthIcon.setAttribute('data-lucide', 'shield-check');
        overCountBadge.textContent = '0 Over Budget';
        overCountBadge.className = 'badge badge-success';
      }
    }
  }

  renderAlertBanner() {
    const banner = document.getElementById('overBudgetBanner');
    const title = document.getElementById('alertBannerTitle');
    const desc = document.getElementById('alertBannerDesc');
    const overSummary = this.state.getOverBudgetSummary();

    if (banner && title && desc) {
      if (overSummary.overBudgetCount > 0) {
        banner.classList.remove('hidden');
        const catNames = overSummary.overBudgetCategories.map(c => `<strong>${escapeHTML(c.name)}</strong> (+$${c.excessAmount.toFixed(2)})`).join(', ');
        title.textContent = `${overSummary.overBudgetCount} Category ${overSummary.overBudgetCount === 1 ? 'Budget Exceeded' : 'Budgets Exceeded'}!`;
        desc.innerHTML = `Over-budget categories: ${catNames}. Total excess: $${overSummary.totalExcess.toFixed(2)}`;
      } else {
        banner.classList.add('hidden');
      }
    }
  }

  renderCategoryCards() {
    const grid = document.getElementById('categoryCardsGrid');
    if (!grid) return;

    const breakdown = this.state.getCategoryBreakdown();
    const overCats = breakdown.filter(c => c.isOverBudget);
    const nearCats = breakdown.filter(c => c.isNearLimit);

    const cAll = document.getElementById('countAllCats');
    const cOver = document.getElementById('countOverCats');
    const cNear = document.getElementById('countNearCats');

    if (cAll) cAll.textContent = breakdown.length;
    if (cOver) cOver.textContent = overCats.length;
    if (cNear) cNear.textContent = nearCats.length;

    let filtered = breakdown;
    if (this.state.activeCategoryFilter === 'over') {
      filtered = overCats;
    } else if (this.state.activeCategoryFilter === 'near') {
      filtered = nearCats;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i data-lucide="check-circle-2"></i>
          <p>No categories match the active filter for this month.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(cat => {
      const fillPercent = Math.min(cat.percentUsed, 100);
      let fillClass = 'fill-safe';
      let cardClass = '';
      let badgeHtml = `<span class="cat-status-badge badge-neutral">${cat.percentUsed.toFixed(0)}%</span>`;

      if (cat.isOverBudget) {
        fillClass = 'fill-danger';
        cardClass = 'is-over-budget';
        badgeHtml = `<span class="cat-status-badge badge-danger">+$${cat.excessAmount.toFixed(2)} OVER</span>`;
      } else if (cat.isNearLimit) {
        fillClass = 'fill-warning';
        cardClass = 'is-near-limit';
        badgeHtml = `<span class="cat-status-badge badge-warning">${cat.percentUsed.toFixed(0)}% NEAR</span>`;
      }

      const remainingTextClass = cat.remaining < 0 ? 'negative' : (cat.remaining < cat.budget * 0.25 ? 'warning' : 'positive');
      const remainingLabel = cat.remaining < 0 ? `-$${Math.abs(cat.remaining).toFixed(2)} over limit` : `$${cat.remaining.toFixed(2)} remaining`;

      return `
        <div class="category-card ${cardClass}" data-id="${cat.id}">
          <div class="cat-top-row">
            <div class="cat-title-block">
              <div class="cat-icon-wrap" style="background-color: ${cat.color};">
                <i data-lucide="${cat.icon || 'folder'}"></i>
              </div>
              <div>
                <h3 class="cat-name">${escapeHTML(cat.name)}</h3>
              </div>
            </div>
            <div>${badgeHtml}</div>
          </div>

          <div class="cat-progress-track">
            <div class="cat-progress-fill ${fillClass}" style="width: ${fillPercent}%;"></div>
          </div>

          <div class="cat-bottom-row">
            <span class="cat-spent-text">$${cat.spent.toFixed(2)} <span class="cat-budget-text">/ $${cat.budget.toFixed(2)}</span></span>
            <span class="cat-remaining-text ${remainingTextClass}">${remainingLabel}</span>
          </div>

          <div class="cat-card-actions">
            <button class="btn-card-action" onclick="app.quickAddExpenseForCategory('${cat.id}')">
              <i data-lucide="plus"></i> Add
            </button>
            <button class="btn-card-action" onclick="app.editCategoryModal('${cat.id}')">
              <i data-lucide="edit-3"></i> Edit
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTransactions() {
    const listEl = document.getElementById('transactionList');
    const subtitleEl = document.getElementById('transactionSubtitle');
    const searchInput = document.getElementById('transactionSearch');
    const catFilterInput = document.getElementById('transactionCategoryFilter');

    if (!listEl) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filterCat = catFilterInput ? catFilterInput.value : 'all';

    let monthExpenses = this.state.getMonthExpenses();

    if (searchTerm) {
      monthExpenses = monthExpenses.filter(e => 
        (e.description && e.description.toLowerCase().includes(searchTerm)) ||
        (e.paymentMethod && e.paymentMethod.toLowerCase().includes(searchTerm)) ||
        (e.amount.toString().includes(searchTerm))
      );
    }

    if (filterCat && filterCat !== 'all') {
      monthExpenses = monthExpenses.filter(e => e.categoryId === filterCat);
    }

    monthExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (subtitleEl) {
      subtitleEl.textContent = `${monthExpenses.length} transaction${monthExpenses.length === 1 ? '' : 's'} in selected month`;
    }

    if (monthExpenses.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <i data-lucide="receipt"></i>
          <p>No expenses found for this month / filter.</p>
        </div>
      `;
      return;
    }

    const catMap = this.state.categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});

    listEl.innerHTML = monthExpenses.map(exp => {
      const cat = catMap[exp.categoryId] || { name: 'Uncategorized', color: '#64748b', icon: 'folder' };
      const formattedDate = new Date(exp.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return `
        <div class="transaction-item" data-id="${exp.id}">
          <div class="tx-left">
            <div class="tx-icon-badge" style="background-color: ${cat.color};">
              <i data-lucide="${cat.icon || 'receipt'}"></i>
            </div>
            <div class="tx-details">
              <span class="tx-desc">${escapeHTML(exp.description)}</span>
              <div class="tx-meta">
                <span class="tx-cat-tag" style="color: ${cat.color};">${escapeHTML(cat.name)}</span>
                <span>•</span>
                <span>${formattedDate}</span>
                <span>•</span>
                <span>${escapeHTML(exp.paymentMethod || 'Card')}</span>
              </div>
            </div>
          </div>
          <div class="tx-right">
            <span class="tx-amount">$${Number(exp.amount).toFixed(2)}</span>
            <button class="btn-delete-tx" onclick="app.deleteExpensePrompt('${exp.id}')" title="Delete expense" aria-label="Delete expense">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCategoryManageList() {
    const listEl = document.getElementById('categoryManageList');
    if (!listEl) return;

    listEl.innerHTML = this.state.categories.map(cat => `
      <div class="category-manage-item">
        <div class="cat-manage-info">
          <span class="cat-manage-dot" style="background-color: ${cat.color};"></span>
          <div>
            <span class="cat-manage-name">${escapeHTML(cat.name)}</span>
            <span class="cat-manage-budget"> • $${Number(cat.budget).toFixed(2)}/mo</span>
          </div>
        </div>
        <div class="cat-manage-actions">
          <button class="btn btn-sm btn-ghost" onclick="app.editCategoryModal('${cat.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteCategoryPrompt('${cat.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  handleQuickExpenseSubmit() {
    const descInput = document.getElementById('quickDescription');
    const amountInput = document.getElementById('quickAmount');
    const catSelect = document.getElementById('quickCategory');
    const dateInput = document.getElementById('quickDate');
    const paymentSelect = document.getElementById('quickPayment');

    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
      this.showToast('Please enter a valid expense amount greater than $0', 'warning');
      return;
    }

    const categoryId = catSelect.value;
    const cat = this.state.categories.find(c => c.id === categoryId);

    const previousSpent = this.state.getSpendingByCategory()[categoryId] || 0;
    const budget = cat ? Number(cat.budget) : 0;

    this.state.addExpense({
      description: descInput.value,
      amount: amount,
      categoryId: categoryId,
      date: dateInput.value,
      paymentMethod: paymentSelect ? paymentSelect.value : 'Credit Card'
    });

    const newTotalSpent = previousSpent + amount;
    if (budget > 0 && newTotalSpent > budget) {
      const overAmount = newTotalSpent - budget;
      this.showToast(`⚠️ Warning: "${cat ? cat.name : 'Category'}" is now over budget by $${overAmount.toFixed(2)}!`, 'danger');
    } else {
      this.showToast(`Logged "$${amount.toFixed(2)}" for ${descInput.value}`, 'success');
    }

    descInput.value = '';
    amountInput.value = '';
    descInput.focus();

    this.render();
  }

  handleCategoryFormSubmit() {
    const editId = document.getElementById('editCategoryId').value;
    const name = document.getElementById('catName').value.trim();
    const budget = parseFloat(document.getElementById('catBudget').value);
    const icon = document.getElementById('catIcon').value;
    const color = document.getElementById('selectedColor').value;

    if (!name || isNaN(budget) || budget < 0) {
      this.showToast('Please enter a valid category name and budget amount.', 'warning');
      return;
    }

    if (editId) {
      this.state.updateCategory(editId, { name, budget, icon, color });
      this.showToast(`Updated "${name}" category budget`, 'success');
    } else {
      this.state.addCategory({ name, budget, icon, color });
      this.showToast(`Created new category "${name}"`, 'success');
    }

    this.resetCategoryForm();
    this.populateCategorySelects();
    this.renderCategoryManageList();
    this.render();
  }

  resetCategoryForm() {
    const editId = document.getElementById('editCategoryId');
    const name = document.getElementById('catName');
    const budget = document.getElementById('catBudget');
    const icon = document.getElementById('catIcon');
    const header = document.getElementById('catFormHeader');
    const btnText = document.getElementById('saveCatBtnText');
    const cancelBtn = document.getElementById('cancelEditCatBtn');
    const colorInput = document.getElementById('selectedColor');

    if (editId) editId.value = '';
    if (name) name.value = '';
    if (budget) budget.value = '';
    if (icon) icon.value = 'folder';
    if (header) header.textContent = 'Create New Category';
    if (btnText) btnText.textContent = 'Save Category';
    if (cancelBtn) cancelBtn.classList.add('hidden');

    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(s => s.classList.remove('active'));
    if (swatches[0]) swatches[0].classList.add('active');
    if (colorInput) colorInput.value = '#6366f1';
  }

  editCategoryModal(id) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;

    const modal = document.getElementById('categoryModal');
    if (modal) modal.classList.remove('hidden');

    const editId = document.getElementById('editCategoryId');
    const name = document.getElementById('catName');
    const budget = document.getElementById('catBudget');
    const icon = document.getElementById('catIcon');
    const colorInput = document.getElementById('selectedColor');
    const header = document.getElementById('catFormHeader');
    const btnText = document.getElementById('saveCatBtnText');
    const cancelBtn = document.getElementById('cancelEditCatBtn');

    if (editId) editId.value = cat.id;
    if (name) name.value = cat.name;
    if (budget) budget.value = cat.budget;
    if (icon) icon.value = cat.icon || 'folder';
    if (colorInput) colorInput.value = cat.color || '#6366f1';

    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(s => {
      s.classList.toggle('active', s.dataset.color === cat.color);
    });

    if (header) header.textContent = `Edit "${cat.name}"`;
    if (btnText) btnText.textContent = 'Update Category';
    if (cancelBtn) cancelBtn.classList.remove('hidden');

    this.renderCategoryManageList();
    this.refreshIcons();
  }

  deleteCategoryPrompt(id) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;

    if (confirm(`Are you sure you want to delete "${cat.name}"? Expenses under this category will remain.`)) {
      this.state.deleteCategory(id);
      this.populateCategorySelects();
      this.renderCategoryManageList();
      this.render();
      this.showToast(`Deleted category "${cat.name}"`, 'warning');
    }
  }

  quickAddExpenseForCategory(categoryId) {
    const catSelect = document.getElementById('quickCategory');
    if (catSelect) {
      catSelect.value = categoryId;
      const formCard = document.querySelector('.quick-expense-panel');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
      const desc = document.getElementById('quickDescription');
      if (desc) desc.focus();
    }
  }

  deleteExpensePrompt(id) {
    const exp = this.state.expenses.find(e => e.id === id);
    if (!exp) return;

    this.state.deleteExpense(id);
    this.render();
    this.showToast(`Removed expense "${exp.description}" ($${Number(exp.amount).toFixed(2)})`, 'warning');
  }

  exportMonthlyExpensesCSV() {
    const monthExpenses = this.state.getMonthExpenses();
    if (monthExpenses.length === 0) {
      this.showToast('No expenses found to export for this month.', 'warning');
      return;
    }

    const catMap = this.state.categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method'];
    const rows = monthExpenses.map(e => [
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${(catMap[e.categoryId] || 'Unknown').replace(/"/g, '""')}"`,
      Number(e.amount).toFixed(2),
      `"${(e.paymentMethod || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartBudget_Expenses_${this.state.activeMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast('CSV export downloaded!', 'success');
  }

  exportFullDataJSON() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      activeMonth: this.state.activeMonth,
      categories: this.state.categories,
      expenses: this.state.expenses
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartBudget_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast('JSON backup downloaded!', 'success');
  }

  handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported.categories) && Array.isArray(imported.expenses)) {
          this.state.categories = imported.categories;
          this.state.expenses = imported.expenses;
          this.state.saveCategories();
          this.state.saveExpenses();
          this.populateCategorySelects();
          this.render();
          this.showToast('Database restored successfully from backup!', 'success');
          const dm = document.getElementById('dataModal');
          if (dm) dm.classList.add('hidden');
        } else {
          throw new Error('Invalid schema format');
        }
      } catch (err) {
        alert('Failed to parse JSON backup file. Please check file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'check-circle-2';
    if (type === 'danger') iconName = 'alert-triangle';
    if (type === 'warning') iconName = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Utility: HTML Escaping
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let appState;
let chartManager;
let app;

document.addEventListener('DOMContentLoaded', () => {
  appState = new AppState();
  chartManager = new ChartManager(appState);
  app = new UIController(appState, chartManager);
});
