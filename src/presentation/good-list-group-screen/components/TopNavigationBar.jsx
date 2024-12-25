import { Link } from "react-router";

const TopNavigationBar = ({ tabs, activeTab, onTabChange }) => {
	return (
		<div className="bg-gray-200 w-full shadow-md flex items-center px-4 py-2">
			{tabs.map((tab, index) => (
				<Link
					to={tab.path}
					key={index}
					// onClick={() => onTabChange(tab)}
					className={`px-4 py-2 text-sm font-medium ${tab.name === activeTab
							? "bg-white shadow-md text-blue-600"
							: "text-white-600 hover:text-blue-600"
						}`}
				>
					{tab.name}
				</Link>
			))}
		</div>
	);
};

export default TopNavigationBar;