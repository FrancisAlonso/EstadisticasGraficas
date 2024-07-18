// src/utils/chartConfigs.js

export const getBarChartConfig = (labels, data, title, yMax = 7) => ({
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: title,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 2,
          data,
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: yMax,
        }
      },
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
  
  export const getPieChartConfig = (labels, data, title) => ({
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: title,
          backgroundColor: [
            'rgba(192, 75, 75, 1)', 'rgba(75, 192, 75, 1)',
            'rgba(75, 75, 192, 1)', 'rgba(192, 192, 75, 1)',
            'rgba(192, 75, 192, 1)', 'rgba(75, 192, 192, 1)'
          ],
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 2,
          data,
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
  