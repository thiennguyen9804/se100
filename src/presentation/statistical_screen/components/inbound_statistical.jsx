import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { valueFormatter, handleData } from './inbound_data';


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

  React.useEffect(() => {
    (async function () {
      const result = await handleData();
      if (result) {
        console.log("🚀 ~ result:", result)

        setData(result);
      }
    })()
  }, [])

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