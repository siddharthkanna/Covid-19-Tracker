import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const options = {
  options: {
    scales: {
      x: {
        type: "time",
        display: true,
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          major: {
            enabled: true,
          },
          color: (context) => context.tick && context.tick.major && "#FF0000",
          font: function (context) {
            if (context.tick && context.tick.major) {
              return {
                weight: "bold",
              };
            }
          },
        },
      },
      y: {
        ticks: {
          min: 0,
          stepSize: 1,
        },
        display: true,
        title: {
          display: true,
          text: "value",
        },
      },
    },
  },
};
const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=90")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData)
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                label: "New Cases WorldWide",
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;