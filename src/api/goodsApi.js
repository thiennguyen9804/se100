import { delay } from "../core/utils/delay"

const goodsList = [
	{
		goodsCode: "G001",
		goodsDesc: "Smartphone",
		goodsSupplier: "Tech Corp",
		goodsWeight: "200g",
		goodsWidth: "75mm",
		goodsDepth: "8mm",
		goodsHeight: "150mm",
		unitVolume: "900cm³",
		goodsStatus: "Available",
	},
	{
		goodsCode: "G002",
		goodsDesc: "Laptop",
		goodsSupplier: "Laptop Ltd",
		goodsWeight: "2kg",
		goodsWidth: "320mm",
		goodsDepth: "20mm",
		goodsHeight: "220mm",
		unitVolume: "1408000mm³",
		goodsStatus: "Out of Stock",
	},
	{
		goodsCode: "G003",
		goodsDesc: "Tablet",
		goodsSupplier: "Tab Solutions",
		goodsWeight: "500g",
		goodsWidth: "160mm",
		goodsDepth: "8mm",
		goodsHeight: "240mm",
		unitVolume: "307200mm³",
		goodsStatus: "Available",
	},
]

export const getAllGoods = async () => {
	await delay(3000);
	return goodsList
}