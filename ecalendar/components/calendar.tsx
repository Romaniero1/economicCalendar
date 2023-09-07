'use client';

import { useEffect, useState } from "react";

export const Calendar = () => {
	const [currentDateTime, setCurrentDateTime] = useState('');
	const [selectedTimezone, setSelectedTimezone] = useState('');

	useEffect(() => {
		// Function to format the date and time
		const formatDateTime = () => {
			const options = {
				weekday: 'long' as const,
				year: 'numeric' as const,
				month: 'long' as const,
				day: 'numeric' as const,
				hour: 'numeric' as const,
				minute: 'numeric' as const,
				hour12: true,
			};
			const dateTimeString = new Date().toLocaleString('en-US', options);
			setCurrentDateTime(dateTimeString);
		};

		// Function to get the system's time zone in GMT format
		const getSystemTimezone = () => {
			const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			// Преобразование системного часового пояса в формат GMT
			const gmtTimezone = `GMT${systemTimezone.startsWith('-') ? '+' : '-'}${Math.abs(
				(new Date().getTimezoneOffset() / 60)
			)}:00`;
			setSelectedTimezone(gmtTimezone);
		};

		// Update the current date and time initially and then every minute
		formatDateTime();
		getSystemTimezone();
		const interval = setInterval(() => {
			formatDateTime();
			getSystemTimezone();
		}, 60000); // Update every minute

		// Clean up the interval on component unmount
		return () => clearInterval(interval);
	}, []);


	// List of GMT time zones
	const gmtTimezones = [
		"GMT-12:00",
		"GMT-11:00",
		"GMT-10:00",
		"GMT-9:00",
		"GMT-8:00",
		"GMT-7:00",
		"GMT-6:00",
		"GMT-5:00",
		"GMT-4:00",
		"GMT-3:00",
		"GMT-2:00",
		"GMT-1:00",
		"GMT+0:00 (Same as GMT)",
		"GMT+1:00",
		"GMT+2:00",
		"GMT+3:00",
		"GMT+4:00",
		"GMT+5:00",
		"GMT+6:00",
		"GMT+7:00",
		"GMT+8:00",
		"GMT+9:00",
		"GMT+10:00",
		"GMT+11:00",
		"GMT+12:00",
	];

	return (
		<div className="flex flex-col mx-[8%]">
			<div className="flex justify-between items-center">
				<div className="flex">
					<div className="">
						<h1 className="">
							Economic
						</h1>
					</div>
					<div className="pl-3 bg-clip-text text-transparent bg-gradient-to-b from-[#30975b] to-[#094622]">
						<h1>Calendar</h1>
					</div>
				</div>
				<div className="flex items-center">
					<div>
						<h2>{currentDateTime}</h2>
					</div>
					<div className="ml-6 px-3 border-2 rounded-full">
						<h2>
							<select
								className="timezone-dropdown select-none bg-transparent w-[110px] h-8"
								value={selectedTimezone}
								onChange={(e) => setSelectedTimezone(e.target.value)}
							>
								{gmtTimezones.map((timezone, index) => (
									<option key={index} value={timezone}>
										{timezone}
									</option>
								))}
							</select>
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
}