import DropdownList from '@/components/common/DropdownList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentExtended } from '@/interfaces/table.d';
import { getOrdersHistory } from '@/services/paymentService';

import CircularProgress from '@mui/material/CircularProgress';

const OrdersPage = () => {
    const defaultOrder = 'date';

	const navigate = useNavigate();
	const [sortOrder, setSortOrder] = useState<string>(defaultOrder);
	const [orders, setOrders] = useState<PaymentExtended[]>([]);
    const [filter, setFilter] = useState({
        order: defaultOrder,
        from: new Date(0).toISOString().split('T')[0], // Default to epoch start
        to: new Date().toISOString().split('T')[0] // Default to today
    });
    const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchOrders = async () => {
            setLoading(true);
            setOrders([]);
            const ordersData = await getOrdersHistory({
                ...filter,
                from: new Date(new Date(filter.from).setHours(0, 0, 0, 0)),
                to: new Date(new Date(filter.to).setHours(23, 59, 59, 999))
            });
            setOrders(ordersData);
            setLoading(false);
        }

        setFilter((prev) => ({ ...prev, order: sortOrder }));
        fetchOrders();
	}, [sortOrder]);

	return (
		<div className='p-6 overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
			<h1 className='text-2xl font-bold mb-8 mt-4'>Orders History</h1>
			<div className='bg-white rounded-3xl shadow-xl p-6'>
				<div className='flex justify-between items-center mb-4'>
					<div className="flex flex-col gap-2">
						<h2 className='font-semibold text-md'>Sort by</h2>
						<DropdownList
							options={[
								{ id: 'asc', name: 'Lowest to Highest' },
								{ id: 'desc', name: 'Highest to Lowest' },
                                { id: 'date', name: 'Most Recent' }
							]}
							defaultValue={'Most Recent'}
							onSelect={setSortOrder}
                            hideSearch={true}
                            className='w-52'
						/>
					</div>
					{/* Keep date filters for consistency */}
					<div className='flex gap-4'>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-gray-600 flex items-center gap-1.5">
								From
							</label>
							<input
								type="date"
								className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={filter.from}
								onChange={(e) => setFilter({ ...filter, from: e.target.value })}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-gray-600 flex items-center gap-1.5">
								To
							</label>
							<input
								type="date"
								className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={filter.to}
                                onChange={(e) => setFilter({ ...filter, to: e.target.value })}
							/>
						</div>
					</div>
				</div>
				<div className='border-b border-zinc-300 my-6'></div>
				<div>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-zinc-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">No.</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Material Name</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Buyer</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Price (USD)</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Purchased Date</th>
                                    <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
								</tr>
							</thead>
							<tbody>
                                { loading ? ( 
                                    <tr>
                                        <td colSpan={6} className="py-20 px-4 text-center">
                                            <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                                                <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                                                <h1 className='mt-2 text-lg'>Fetching orders...</h1>
                                            </div>
                                        </td>
                                    </tr>
                                ) : 
								orders.length > 0 ? orders.map((order) => (
									<tr key={order.payment_id} className="border-b border-zinc-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">{orders.indexOf(order) + 1}</td>
										<td className="py-3 px-4 text-blue-500 font-semibold hover:underline cursor-pointer" onClick={() => navigate(`/material/${order.material_id}`)}>{order.material_name}</td>
										<td className="py-3 px-4" onClick={() => navigate(`/user/${order.buyer_id}`)}>{order.buyer_name}</td>
										<td className="py-3 px-4"><strong>${order.amount.toFixed(2)}</strong></td>
										<td className="py-3 px-4">{new Date(order.created_date).toLocaleString(undefined, { timeZone: 'UTC' })}</td>
                                        <td className="py-3 px-4 capitalize">
                                            <span className={`px-4 py-2 rounded-xl bg-gradient-to-r shadow-lg ${order.status === 'paid' ? 'from-emerald-500 to-lime-500 shadow-green-200' : order.status === 'pending' ? 'from-yellow-500 to-amber-500 shadow-yellow-200' : 'from-red-500 to-amber-500 shadow-red-200'} text-white font-semibold`}>
                                                {order.status[0].toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
									</tr>
								)) : (
									<tr>
										<td colSpan={6} className="py-3 px-4 text-center text-gray-500">
											No orders history found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;
