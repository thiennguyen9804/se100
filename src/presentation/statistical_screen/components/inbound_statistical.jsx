import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { valueFormatter, handleData} from './inbound_data';


const chartSetting = {
  yAxis: [
    {
      label: 'Số lượng đơn',
    },
  ],
  series: [{ dataKey: 'amount', label: 'Số lượng đơn nhập theo tháng', valueFormatter }],
  height: 400,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function InboundBarChart() {
  const [data, setData] = React.useState([]);
  const [tickPlacement, setTickPlacement] = React.useState('middle');
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState('middle');

    async function getData() {
      try {
        const result = await handleData(); // Wait for the promise to resolve
        setData(result); // Set the data (array) when resolved
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData(); // Call the function to fetch data

  return (
    <div>
      <BarChart
        dataset={data}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement, tickLabelPlacement },
        ]}
        {...chartSetting}
      />
    </div>
  );
};