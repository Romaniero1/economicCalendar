'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { gmtTimezones, times } from './../constants';
import {
	getFormattedToday,
	getFormattedYesterday,
	getFormattedTomorrow,
	getFormattedThisMonday,
	getFormattedThisSunday,
	getFormattedNextMonday,
	getFormattedNextSunday,
} from './../dateUtils'; // Adjust the import path as needed

import Filter from '/public/filter.svg';
import Star1 from '/public/star1.svg';
import Star2 from '/public/star2.svg';
import Star3 from '/public/star3.svg';

interface CalendarEvent {
	date: string;
	time: string;
	event: string;
	country: string;
	impact: string;
	actual: string;
	forecast: string;
	previous: string;
}

type ImportanceIcons = {
	Low: JSX.Element;
	Medium: JSX.Element;
	High: JSX.Element;
};

const formattedToday = getFormattedToday();
const formattedYesterday = getFormattedYesterday();
const formattedTomorrow = getFormattedTomorrow();
const formattedThisMonday = getFormattedThisMonday();
const formattedThisSunday = getFormattedThisSunday();
const formattedNextMonday = getFormattedNextMonday();
const formattedNextSunday = getFormattedNextSunday();

export const Calendar = () => {
	const [currentDateTime, setCurrentDateTime] = useState('');
	const [selectedTimezone, setSelectedTimezone] = useState('');
	const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTimeRange, setSelectedTimeRange] = useState('All');
	const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

	useEffect(() => {
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

		const getSystemTimezone = () => {
			const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const gmtTimezone = `${systemTimezone.startsWith('-') ? '+' : '-'}${Math.abs(
				new Date().getTimezoneOffset() / 60
			)}:00`;
			setSelectedTimezone(gmtTimezone);
		};

		const fetchCalendarData = async () => {
			try {
				const response = await axios.get("https://tickers.vittaverse.com/api/calendar/economic-calendar");
				const data = JSON.parse(response.data);

				setCalendarData(data);
			} catch (error) {
				console.error("Ошибка при получении данных календаря:", error);
			}
		};

		formatDateTime();
		getSystemTimezone();
		fetchCalendarData();

		const interval = setInterval(() => {
			formatDateTime();
			getSystemTimezone();
			fetchCalendarData();
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	const filteredEvent = calendarData.filter((event) =>
		event.event.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const groupedCalendarData: { [date: string]: CalendarEvent[] } = {};

	filteredEvent.forEach((event) => {
		if (!groupedCalendarData[event.date]) {
			groupedCalendarData[event.date] = [];
		}
		groupedCalendarData[event.date].push(event);
	});

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		};
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', options);
	};

	const importanceIcons: ImportanceIcons = {
		Low: <Image src={Star1} width={56} height={16} alt="Low" />,
		Medium: <Image src={Star2} width={56} height={16} alt="Medium" />,
		High: <Image src={Star3} width={56} height={16} alt="High" />,
	};

	const handleTimeRangeClick = (timeRange: string) => {
		if (timeRange === selectedTimeRange) {
			setSelectedTimeRange("All");
			setFilteredEvents(calendarData);
		} else {
			setSelectedTimeRange(timeRange);
			let filteredData: CalendarEvent[] = [];

			if (timeRange === "Yesterday") {
				filteredData = calendarData.filter((event) => event.date === formattedYesterday);
			} else if (timeRange === "Today") {
				filteredData = calendarData.filter((event) => event.date === formattedToday);
			} else if (timeRange === "Tomorrow") {
				filteredData = calendarData.filter((event) => event.date === formattedTomorrow);
			} else if (timeRange === "This week") {
				filteredData = calendarData.filter((event) => event.date >= formattedThisMonday && event.date <= formattedThisSunday);
			} else if (timeRange === "Next week") {
				filteredData = calendarData.filter((event) => event.date >= formattedNextMonday && event.date <= formattedNextSunday);
			}
			console.log(filteredData)
			setFilteredEvents(filteredData);
		}
	};

	return (
		<div className="flex flex-col mx-[8%] pt-10 ">
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
										GMT{timezone}
									</option>
								))}
							</select>
						</h2>
					</div>
				</div>
			</div>

			<div className="pt-10 flex">
				<div className="flex-grow">
					<input
						type="text"
						placeholder="Search Event..."
						className="w-full h-[40px] bg-transparent rounded-full border-white border-[1px] px-4"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex pl-4">
					{times.map((time, index) => (
						<button
							key={index}
							className={`flex justify-center items-center w-[100px] h-10 rounded-full 
			  				bg-transparent border-white border-[1px] hover:bg-white hover:text-black 
			  				${selectedTimeRange === time ? 'bg-white text-black' : ''}`
							}
							onClick={() => handleTimeRangeClick(time)}
						>
							{time}
						</button>
					))}
				</div>
				<div className="pl-4">
					<button className="flex justify-center items-center w-[84px] h-10 rounded-full bg-transparent border-white border-[1px]">
						<Image src={Filter} width={16} height={16} alt="Logo" />
						<p className="pl-1">Filter</p>
					</button>
				</div>
			</div>

			<div className='border-[1px] rounded-t-[20px] rounded-b-[20px] rounded- mt-4'>
				<table className="w-full">
					<thead className=" h-12">
						<tr>
							<th className='w-[199px] border-r-[1px]'>Time</th>
							<th className='w-[180px] border-r-[1px]'>Country</th>
							<th className='w-[158px] border-r-[1px]'>Importance</th>
							<th className='w-[322px] border-r-[1px]'>Event</th>
							<th className='w-[98px] border-r-[1px]'>Actual</th>
							<th className='w-[98px] border-r-[1px]'>Forecast</th>
							<th className='w-[98px] '>Previous</th>
						</tr>
					</thead>
					<tbody className=''>
						{Object.keys(groupedCalendarData)
							.filter((date) =>
								groupedCalendarData[date].some((event) =>
									event.event.toLowerCase().includes(searchQuery.toLowerCase())
								)
							)
							.reverse()
							.map((date) => {
								const eventsForDate = groupedCalendarData[date].filter((eventItem) => {
									if (selectedTimeRange === 'All') {
										return true;
									} else if (selectedTimeRange === 'Yesterday') {
										return eventItem.date === formattedYesterday;
									} else if (selectedTimeRange === 'Today') {
										return eventItem.date === formattedToday;
									} else if (selectedTimeRange === 'Tomorrow') {
										return eventItem.date === formattedTomorrow;
									} else if (selectedTimeRange === 'This week') {
										return (
											eventItem.date >= formattedThisMonday && 
											eventItem.date <= formattedThisSunday
										);
									} else if (selectedTimeRange === 'Next week') {
										return (
											eventItem.date >= formattedNextMonday && 
											eventItem.date <= formattedNextSunday
										);
									} else {
										return false;
									}
								});

								if (eventsForDate.length > 0) {
									return (
										<React.Fragment key={date}>
											<tr className="h-12 bg-white-rgba">
												<td colSpan={7} className="pl-5 border-t-[1px]">
													{formatDate(date)}
												</td>
											</tr>
											{eventsForDate.reverse().map((event, index) => (
												<tr key={index} className="h-12">
													<td className="pl-5 border-t-[1px] border-r-[1px]">{event.time}</td>
													<td className="text-center border-t-[1px] border-r-[1px]">{event.country}</td>
													<td className="border-t-[1px] border-r-[1px]">
														<div className='flex justify-center items-center h-[100%]'>
															{importanceIcons[event.impact]}
														</div>
													</td>
													<td className="pl-5 border-t-[1px] border-r-[1px]">{event.event}</td>
													<td className="text-center border-t-[1px] border-r-[1px]">{event.actual}</td>
													<td className="text-center border-t-[1px] border-r-[1px]">{event.forecast}</td>
													<td className="text-center border-t-[1px]">{event.previous}</td>
												</tr>
											))}
										</React.Fragment>
									);
								}
								return null;
							})}

					</tbody>
				</table>
			</div>
		</div>
	);
};
