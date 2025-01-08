import React, { useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { valueFormatter, handleDataByQuarter } from './outbound_data_by_quarter';


const chartSetting = {
  yAxis: [
    {
      label: 'Số lượng đơn',
    },
  ],
  series: [{ dataKey: 'amount', label: 'Số lượng đơn xuất theo quý', valueFormatter }],
  height: 400,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function OutboundBarChartByQuarter() {
  const [data, setData] = React.useState([]);
  const [tickPlacement, setTickPlacement] = React.useState('middle');
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState('middle');

    // async function getData() {
    //   try {
    //      // Wait for the promise to resolve
    //      // Set the data (array) when resolved
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }
    useEffect(() => {
      (async function() {
        const result = await handleDataByQuarter();
        if(result) {
          console.log("🚀 ~ result:", result)
          
          setData(result);
        }
      })()
    }, [])
    // getData(); // Call the function to fetch data

  return (
    <div>
      <BarChart
        dataset={data}
        xAxis={[
          { scaleType: 'band', dataKey: 'quarter', tickPlacement, tickLabelPlacement },
        ]}
        {...chartSetting}
      />
    </div>
  );
};