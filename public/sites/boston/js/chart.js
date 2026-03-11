const xValues = ["2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"]
const yValues = [2, 2.8, 2.3, 2.7, 2.1, 2.18, 2.9, 2.4, 1.6, 2, 2.5, 4];
const barColors = ["red","green","blue","orange","brown","red", "green","blue","orange","brown","red", "green"];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues,
      labels: "GDP growth" 
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "GDP Growth of Arts and Culture"
    }
  }
});





