export const getFormattedToday = () => {
  return new Date().toISOString().split("T")[0]; // Get the date in 'yyyy-mm-dd' format
};

export const getFormattedYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0]; // Get yesterday's date in 'yyyy-mm-dd' format
};

export const getFormattedTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0]; // Get tomorrow's date in 'yyyy-mm-dd' format
};

export const getFormattedThisMonday = () => {
  const monday = new Date();
  const dayOfWeekMonday = monday.getDay(); // 0 (воскресенье) до 6 (суббота)
  const differenceMonday = dayOfWeekMonday === 0 ? 6 : dayOfWeekMonday - 1; // Разница с понедельником
  monday.setDate(monday.getDate() - differenceMonday); // Устанавливаем дату на понедельник текущей недели
  return monday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};

export const getFormattedThisSunday = () => {
  const Sunday = new Date();
  const dayOfWeekSunday = Sunday.getDay(); // 0 (воскресенье) до 6 (суббота)
  const differenceSunday = 0 - dayOfWeekSunday; // Разница с воскресеньем для текущей недели
  Sunday.setDate(Sunday.getDate() + differenceSunday); // Устанавливаем дату на текущее воскресенье
  return Sunday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};

export const getFormattedNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (воскресенье) до 6 (суббота)
  const daysUntilNextMonday = 1 + ((7 - dayOfWeek) % 7); // Вычисляем, сколько дней осталось до следующего понедельника
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday); // Устанавливаем дату на следующий понедельник
  return nextMonday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};

export const getFormattedNextSunday = () => {
  const nextSunday = new Date();
  const dayOfNextWeekSunday = nextSunday.getDay(); // 0 (воскресенье) до 6 (суббота)
  const differenceNextWeekSunday = 7 - dayOfNextWeekSunday; // Разница с воскресеньем для следующей недели
  nextSunday.setDate(nextSunday.getDate() + differenceNextWeekSunday); // Устанавливаем дату на следующее воскресенье
  return nextSunday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};
