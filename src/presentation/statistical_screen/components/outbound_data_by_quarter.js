import { getAllInbound } from "../../../api/inboundApi";
import { Timestamp } from "firebase/firestore";
import { getAllOutbound } from "../../../api/outboundApi";

function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
	return timestamp.toDate();
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

// Đếm số đơn theo quý
function countRecordsByQuarter(data) {
  const quarterCounter = Array(4).fill(0); // Khởi tạo 4 phần tử đại diện cho 4 quý
  data.forEach((month) => {
	// console.log("🚀 ~ data.forEach ~ month:", month)
	
	const quarter = Math.floor(month / 3); // Tính quý từ chỉ số tháng
	quarterCounter[quarter]++;
  });
  return quarterCounter;
}

export const handleDataByQuarter = async () => {
  try {
	const outbound = await getAllOutbound();
	// Convert data từ timestamp về lại date
	const formattedData = outbound.map((item) => ({
	  CreateTime: convertTimestampToDate(item.CreateTime),
	}));
	// Dùng getMonth để xác định tháng của từng record
	const monthData = formattedData.map((item) => item.CreateTime.getMonth());
	// Đếm số record theo quý
	const recordsByQuarter = countRecordsByQuarter(monthData);

	// Tạo dataset theo quý
	const dataset = [
	  {
		amount: recordsByQuarter[0],
		quarter: "Q1 (Jan-Mar)",
	  },
	  {
		amount: recordsByQuarter[1],
		quarter: "Q2 (Apr-Jun)",
	  },
	  {
		amount: recordsByQuarter[2],
		quarter: "Q3 (Jul-Sep)",
	  },
	  {
		amount: recordsByQuarter[3],
		quarter: "Q4 (Oct-Dec)",
	  },
	];

	return dataset;
  } catch (error) {
	console.error("Error fetching data: ", error);
  }
};

export function valueFormatter(value) {
  return `${value} đơn`;
}
