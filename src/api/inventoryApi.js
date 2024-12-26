import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const inventoryList = [
  {
    InventoryID: "I001",
    Name: "Sữa vinamilk",
    ProductType: "Sữa",
    Quantity: 10,
    Location: "Kho số 3",
    CreateTime: "2024-12-25 15:28:24",
    UpdateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
  },
  {
    InventoryID: "I002",
    Name: "Cá hộp 3 cô gái",
    ProductType: "Đồ hộp",
    Quantity: 10,
    Location: "Kho số 2",
    CreateTime: "2024-12-25 15:28:24",
    UpdateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
  },
  {
    InventoryID: "I003",
    Name: "Mực đông lạnh",
    ProductType: "Đồ đông lạnh",
    Quantity: 10,
    Location: "Kho số 1",
    CreateTime: "2024-12-25 15:28:24",
    UpdateTime: "December 24, 2024 at 9:56:43 PM UTC+7",
  },
];

export const getAllInventory = async () => {
  await delay(3000);
  return inventoryList;

  /*
  try {
    const querySnapshot = await getDocs(collection(db, "Inventory"));
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(fetchedData);
    return fetchedData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }*/
};
