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
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (today.getDay() + 6) % 7); // Находим понедельник текущей недели
  console.log(monday)
  return monday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};


export const getFormattedThisSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (воскресенье) до 6 (суббота)
    const daysUntilSunday = 7 - dayOfWeek; // Количество дней до следующего воскресенья
    const nextSunday = new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000); // Вычисляем следующее воскресенье
    console.log(nextSunday)
    return nextSunday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
  };


export const getFormattedNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (воскресенье) до 6 (суббота)
  const daysUntilNextMonday = 1 + ((7 - dayOfWeek) % 7); // Вычисляем, сколько дней осталось до следующего понедельника
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday); // Устанавливаем дату на следующий понедельник
  console.log(nextMonday)
  return nextMonday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};

export const getFormattedNextSunday = () => {
  const nextSunday = new Date();
  const dayOfNextWeekSunday = nextSunday.getDay(); // 0 (воскресенье) до 6 (суббота)
  const differenceNextWeekSunday = 14 - dayOfNextWeekSunday; // Разница с воскресеньем для следующей недели
  nextSunday.setDate(nextSunday.getDate() + differenceNextWeekSunday); // Устанавливаем дату на следующее воскресенье
  console.log(nextSunday)
  return nextSunday.toISOString().split("T")[0]; // Преобразуем в формат 'yyyy-mm-dd'
};
