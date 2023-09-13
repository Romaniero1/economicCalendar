import Head from 'next/head';
import { Calendar } from '../components/calendar';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Vittaverse</title>
				<meta name='description' content='Vittaverse' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='w-full bg-black'>
				<div className='w-full bg-black'>
				<Calendar />
				</div>
			</main>
		</div>
	);
}
