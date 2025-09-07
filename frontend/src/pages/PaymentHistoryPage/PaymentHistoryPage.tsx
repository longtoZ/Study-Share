import DropdownList from '@/components/common/DropdownList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaymentExtended } from '@/interfaces/table';
import { getPaymentHistory } from '@/services/paymentService';

const PaymentHistoryPage = () => {
    const defaultOrder = 'date';

	const navigate = useNavigate();
	const [sortOrder, setSortOrder] = useState<string>(defaultOrder);
	const [payments, setPayments] = useState<PaymentExtended[]>([]);
    const [filter, setFilter] = useState({
        order: defaultOrder,
        from: new Date(0).toISOString().split('T')[0], // Default to epoch start
        to: new Date().toISOString().split('T')[0] // Default to today
    });

	useEffect(() => {
		const fetchPayments = async () => {
            const paymentsData = await getPaymentHistory({
                ...filter,
                from: new Date(new Date(filter.from).setHours(0, 0, 0, 0)),
                to: new Date(new Date(filter.to).setHours(23, 59, 59, 999))
            });
            setPayments(paymentsData);
        }

        setFilter((prev) => ({ ...prev, order: sortOrder }));
        fetchPayments();
	}, [sortOrder]);

	return (
		<div className='p-6 overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
			<h1 className='text-2xl font-bold mb-8 mt-4'>Payment History</h1>
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
                            className='w-48'
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
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Seller</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Buyer</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Purchased Date</th>
									<th className="text-left py-3 px-4 font-semibold text-gray-700">Price (USD)</th>
								</tr>
							</thead>
							<tbody>
								{payments.length > 0 ? payments.map((payment) => (
									<tr key={payment.payment_id} className="border-b border-zinc-100 hover:bg-gray-50">
										<td className="py-3 px-4 text-blue-500 font-semibold hover:underline cursor-pointer" onClick={() => navigate(`/material/${payment.material_id}`)}>{payment.material_name}</td>
										<td className="py-3 px-4" onClick={() => navigate(`/user/${payment.seller_id}`)}>{payment.seller_name}</td>
										<td className="py-3 px-4" onClick={() => navigate(`/user/${payment.buyer_id}`)}>{payment.buyer_name}</td>
										<td className="py-3 px-4">{new Date(payment.created_date).toLocaleString(undefined, { timeZone: 'UTC' })}</td>
										<td className="py-3 px-4">${payment.amount.toFixed(2)}</td>
									</tr>
								)) : (
									<tr>
										<td colSpan={5} className="py-3 px-4 text-center text-gray-500">
											No payment history found.
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

export default PaymentHistoryPage;
