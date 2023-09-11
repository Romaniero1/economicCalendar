'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { offsets, times, countries } from './../constants';
import {
	getFormattedToday,
	getFormattedYesterday,
	getFormattedTomorrow,
	getFormattedThisMonday,
	getFormattedThisSunday,
	getFormattedNextMonday,
	getFormattedNextSunday,
} from './../dateUtils';

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

interface ImportanceIcons {
	Low: JSX.Element;
	Medium: JSX.Element;
	High: JSX.Element;
}

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
	const [showFilters, setShowFilters] = useState(false);
	const [showLowImportance, setShowLowImportance] = useState(true);
	const [showMediumImportance, setShowMediumImportance] = useState(true);
	const [showHighImportance, setShowHighImportance] = useState(true);
	const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');


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
			const offsets = `${systemTimezone.startsWith('-') ? '-' : '+'}${Math.abs(
				new Date().getTimezoneOffset() / 60
			)}:00`;
			setSelectedTimezone(offsets);
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

	const isEventPast = (eventDate: string, eventTime: string) => {
		const eventDateTime = new Date(`${eventDate} ${eventTime}`);
		const currentDateTime = new Date();
		return eventDateTime < currentDateTime;
	};


	const handleCountryChange = (country: string) => {
		const newSelectedCountries = [...selectedCountries];

		if (newSelectedCountries.includes(country)) {
			newSelectedCountries.splice(newSelectedCountries.indexOf(country), 1);
		} else {
			newSelectedCountries.push(country);
		}

		setSelectedCountries(newSelectedCountries);
	};

	const handleSelectAllCountries = () => {
		if (selectedCountries.length === countries.length) {
			setSelectedCountries([]);
		} else {
			setSelectedCountries(countries);
		}
	};

	const handleTimezoneChange = (newOffset: string) => {
		const [hours, minutes] = newOffset.split(':').map(Number);

		const time = new Date();
		const currentDateTimeUTC = new Date(
			time.toLocaleString('en-US', { timeZone: 'Atlantic/Azores' })
		);

		currentDateTimeUTC.setHours(currentDateTimeUTC.getHours() + hours);
		currentDateTimeUTC.setMinutes(currentDateTimeUTC.getMinutes() + minutes);

		const options = {
			weekday: 'long' as const,
			year: 'numeric' as const,
			month: 'long' as const,
			day: 'numeric' as const,
			hour: 'numeric' as const,
			minute: 'numeric' as const,
			hour12: true,
		};
		const dateTimeString = currentDateTimeUTC.toLocaleString('en-US', options);
		setCurrentDateTime(dateTimeString);

		setSelectedTimezone(newOffset);
	};

	const filteredEvent = calendarData.filter((event) =>
		event.event.toLowerCase().includes(searchQuery.toLowerCase()) &&
		((event.impact === 'Low' && showLowImportance) ||
			(event.impact === 'Medium' && showMediumImportance) ||
			(event.impact === 'High' && showHighImportance)) &&
		(selectedCountries.length === 0 || selectedCountries.includes(event.country)) &&
		(startDate === '' || new Date(event.date) >= new Date(startDate)) &&
		(endDate === '' || new Date(event.date) <= new Date(endDate))
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

	const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStartDate(event.target.value);
	};


	const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEndDate(event.target.value);
	};

	const handleClearDateFilters = () => {
		setStartDate('');
		setEndDate('');
	};

	return (
		<div className="flex flex-col mx-[8%] pt-10 ">
			<div className="flex justify-between items-center">
				<div className="flex lg:flex-row flex-col">
					<div className="">
						<h1 className="">
							Economic
						</h1>
					</div>
					<div className="pl-3 bg-clip-text text-transparent bg-gradient-to-b from-[#30975b] to-[#094622]">
						<h1>Calendar</h1>
					</div>
				</div>
				<div className="flex items-center ml-10 flex-col lg:flex-row">
					<div>
						<h2>{currentDateTime}</h2>
					</div>
					<div className="ml-6 px-3 border-2 rounded-full mt-4 lg:mt-0">
						<h2>
							<select
								className="timezone-dropdown select-none bg-transparent w-[110px] h-8"
								value={selectedTimezone}
								onChange={(e) => handleTimezoneChange(e.target.value)}
							>
								{offsets.map((offset, index) => (
									<option key={index} value={offset}>
										GMT{offset}
									</option>
								))}
							</select>
						</h2>
					</div>
				</div>
			</div>

			<div className="pt-10 flex flex-col lg:flex-row">
				<div className="flex-grow">
					<input
						type="text"
						placeholder="Search Event..."
						className="w-full h-[40px] bg-transparent rounded-full border-white border-[1px] px-4"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className='flex pt-2 lg:pt-0 justify-between'>
					<div className="flex pl-0 lg:pl-4">
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
					<div className="pl-0 lg:pl-4 relative">
						<button className="flex justify-center items-center w-[84px] h-10 rounded-full bg-transparent border-white border-[1px] hover:border-2"
							onClick={() => setShowFilters(!showFilters)}>
							<Image src={Filter} width={16} height={16} alt="Logo" />
							<p className="pl-1">Filter</p>
						</button>
						{showFilters && (
							<div className="absolute bg-white rounded-[20px] p-4 mt-4 h-[320px] w-[280px] right-0 text-black text-body">
								<button
									className="absolute top-2 right-2 p-2 "
									onClick={() => setShowFilters(false)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-gray-500 hover:text-gray-700"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M14.293 5.293a1 1 0 0 1 1.414 1.414L11.414 11l4.293 4.293a1 1 0 1 1-1.414 1.414L10 12.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L8.586 11 4.293 6.707a1 1 0 0 1 1.414-1.414L10 9.586l4.293-4.293z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<div className='pt-2 flex items-center'>
									<p className='mr-4'>Period</p>
									<button
										className='text-[8px] mt-[2px] font-[200]'
										onClick={handleClearDateFilters}
									>
										Clear All
									</button>
								</div>
								<div className='pt-2'>
									<div className='flex justify-center items-center'>
										<input
											type='date'
											placeholder='Start Date'
											className='mr-2 border-[1px] w-[110px] h-7 p-1 rounded-[4px]'
											value={startDate}
											onChange={handleStartDateChange}
										/>
										to
										<input
											type='date'
											placeholder='End Date'
											className='ml-2 border-[1px] w-[110px] h-7 p-1 rounded-[4px]'
											value={endDate}
											onChange={handleEndDateChange}
										/>
									</div>
								</div>
								<div className='pt-4 flex items-center'>
									<p className='mr-4'>Country</p>
									<button
										className='text-[8px] mt-[2px] font-[200] pt-[1px]'
										onClick={handleSelectAllCountries}
									>
										Select/Clear All
									</button>
								</div>
								<div className="w-[245px] h-[90px] overflow-y-auto grid grid-cols-3 gap-2 pt-2">
									{countries.map((country) => (
										<div key={country} className='flex items-center pt-1'>
											<input
												type='checkbox'
												checked={selectedCountries.includes(country)}
												onChange={() => handleCountryChange(country)}
												id={`country-${country}`}
												className='accent-black'
											/>
											<label htmlFor={`country-${country}`} className='pl-1'>
												{country}
											</label>
										</div>
									))}
								</div>
								<div className='pt-4'>
									<p>Importance</p>
									<div className="flex items-center pt-1">
										<input
											type="checkbox"
											checked={showLowImportance}
											onChange={() => setShowLowImportance(!showLowImportance)}
											id="lowImportance"
											className='accent-black'
										/>
										<label htmlFor="lowImportance" className="pl-1">
											<Image src={Star1} width={56} height={16} alt="Low" />
										</label>
									</div>
									<div className="flex items-center pt-1">
										<input
											type="checkbox"
											checked={showMediumImportance}
											onChange={() => setShowMediumImportance(!showMediumImportance)}
											id="mediumImportance"
											className='accent-black'
										/>
										<label htmlFor="mediumImportance" className="pl-1">
											<Image src={Star2} width={56} height={16} alt="Medium" />
										</label>
									</div>
									<div className="flex items-center pt-1">
										<input
											type="checkbox"
											checked={showHighImportance}
											onChange={() => setShowHighImportance(!showHighImportance)}
											id="highImportance"
											className='accent-black'
										/>
										<label htmlFor="highImportance" className="pl-1">
											<Image src={Star3} width={56} height={16} alt="High" />
										</label>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='lg:border-[1px] rounded-t-[20px] rounded-b-[20px] rounded- mt-4'>
				<table className="w-full border-[1px] rounded-t-[20px] rounded-b-[20px]">
					<thead className=" h-12">
						<tr>
							<th className='min-w-[100px] lg:w-[199px] border-r-[1px]'>Time</th>
							<th className='min-w-[80px] lg:w-[180px] border-r-[1px]'>Country</th>
							<th className='min-w-[100px] lg:w-[158px] border-r-[1px]'>Importance</th>
							<th className='min-w-[180px] lg:w-[322px] border-r-[1px]'>Event</th>
							<th className='min-w-[70px] lg:w-[98px] border-r-[1px]'>Actual</th>
							<th className='min-w-[70px] lg:w-[98px] border-r-[1px]'>Forecast</th>
							<th className='min-w-[70px] lg:w-[98px] '>Previous</th>
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
												<tr key={index} className={`h-12 ${isEventPast(event.date, event.time) ? 'text-grey' : ''}`}>
													<td className="pl-5 border-t-[1px] border-r-[1px]">{event.time}</td>
													<td className="text-center border-t-[1px] border-r-[1px]">{event.country}</td>
													<td className="border-t-[1px] border-r-[1px]">
														<div className='flex justify-center items-center h-[100%]'>
															{importanceIcons[event.impact as keyof ImportanceIcons]}
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