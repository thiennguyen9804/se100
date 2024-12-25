import React from 'react'
import { useGoods } from '../../../hooks/useGoods.js'

const GoodsListManager = () => {
	const { data: goodsList, isLoading} = useGoods();

	return (
		<div className="h-screen bg-white p-4 shadow-md overflow-x-auto">
			<div className="flex justify-between items-center mb-4">
				{/* Buttons */}
				<div className="space-x-2">
					<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
						+ NEW
					</button>
					<button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
						REFRESH
					</button>
				</div>
				{/* Search Bar */}
				<div className="relative">
					<input
						type="text"
						placeholder="Search Word"
						className="border border-gray-300 rounded-md px-4 py-2 w-64"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">

				<table className="table-auto w-full border-collapse border border-gray-300">
					<thead>
						<tr className="bg-gray-100 text-left text-black">
							<th className="border border-gray-300 px-4 py-2">Goods Code</th>
							<th className="border border-gray-300 px-4 py-2">Goods Desc</th>
							<th className="border border-gray-300 px-4 py-2">Goods Supplier</th>
							<th className="border border-gray-300 px-4 py-2">Goods Weight(Unit:g)</th>
							<th className="border border-gray-300 px-4 py-2">Goods Width(Unit:mm)</th>
							<th className="border border-gray-300 px-4 py-2">Goods Depth(Unit:mm)</th>
							<th className="border border-gray-300 px-4 py-2">Goods Height(Unit:mm)</th>
							<th className="border border-gray-300 px-4 py-2">Unit Volume</th>
							<th className="border border-gray-300 px-4 py-2">Goods Status</th>
							<th className="border border-gray-300 px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr className="text-gray-600">
								<td className="border border-gray-300 px-4 py-2" colSpan={10}>
									Loading...
								</td>
							</tr>
						) :
							!goodsList ? (
								<tr className="text-gray-600">
									<td className="border border-gray-300 px-4 py-2" colSpan={10}>
										NO MORE DATA
									</td>
								</tr>
							) :
								(goodsList.map((item, index) => (
									<tr key={index} className="text-black">
										<td className="border border-gray-300 px-4 py-2">{item.goodsCode}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsDesc}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsSupplier}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsWeight}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsWidth}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsDepth}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsHeight}</td>
										<td className="border border-gray-300 px-4 py-2">{item.unitVolume}</td>
										<td className="border border-gray-300 px-4 py-2">{item.goodsStatus}</td>
										<td className="border border-gray-300 px-4 py-2 flex">
											<button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
											<button className="bg-red-500 text-white px-2 py-1 ml-2 rounded">Delete</button>
										</td>
									</tr>
								)))
						}
					</tbody>
				</table>

			</div>


		</div>
	)
}

export default GoodsListManager
