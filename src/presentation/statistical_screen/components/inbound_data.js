import { getAllInbound } from "../../../api/inboundApi";
import { Timestamp } from "firebase/firestore";


function convertTimestampToDate(timestamp) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp; // Trả về nếu không phải là Timestamp
}

// Đếm số đơn theo tháng
function countRecords(data) {

  // Khởi tạo một mảng có 12 phần tử để đếm số đơn từng tháng
  const monthCounter = Array(12).fill(0);
  // Lặp qua vòng lặp cần đếm, nếu xuất hiện phần tử thì bộ đếm + 1   
  data.forEach(element => {
    
    console.log("🚀 ~ countRecords ~ element:", element)
    monthCounter[element] = (monthCounter[element] || 0) + 1;
  });

  return monthCounter;
}

export const handleData = async () => {               // Xử lý dữ liệu
  try {
    const inboundData = await getAllInbound();
    // Convert data từ timestamp về lại date
    const formattedData = inboundData.map((item) => ({
      CreateTime: convertTimestampToDate(item.CreateTime)
    }));
    // Dùng getMonth để xác định tháng của từng record
    const monthData = formattedData.map(item => item.CreateTime.getMonth());
    const recordsByMonth = countRecords(monthData);

    const dataset = [
      {
        amount: recordsByMonth[0],
        month: 'Jan',
      },
      {
        amount: recordsByMonth[1],
        month: 'Feb',
      },
      {
        amount: recordsByMonth[2],
        month: 'Mar',
      },
      {
        amount: recordsByMonth[3],
        month: 'Apr',
      },
      {
        amount: recordsByMonth[4],
        month: 'May',
      },
      {
        amount: recordsByMonth[5],
        month: 'June',
      },
      {
        amount: recordsByMonth[6],
        month: 'July',
      },
      {
        amount: recordsByMonth[7],
        month: 'Aug',
      },
      {
        amount: recordsByMonth[8],
        month: 'Sept',
      },
      {
        amount: recordsByMonth[9],
        month: 'Oct',
      },
      {
        amount: recordsByMonth[10],
        month: 'Nov',
      },
      {
        amount: recordsByMonth[11],
        month: 'Dec',
      },
    ]

    return dataset;

  } catch (error) {
    alert("Error fetching data: ", error)
  }
}


export function valueFormatter(value) {
  return `${value} đơn`;
}