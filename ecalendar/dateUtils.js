export const getFormattedToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const getFormattedYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

export const getFormattedTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export const getFormattedThisMonday = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (today.getDay() + 6) % 7);
  return monday.toISOString().split("T")[0];
};


export const getFormattedThisSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const daysUntilSunday = 7 - dayOfWeek; 
    const nextSunday = new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000); 
    return nextSunday.toISOString().split("T")[0];
  };


export const getFormattedNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const daysUntilNextMonday = 1 + ((7 - dayOfWeek) % 7); 
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday); 
  console.log(nextMonday)
  return nextMonday.toISOString().split("T")[0]; 
};

export const getFormattedNextSunday = () => {
  const nextSunday = new Date();
  const dayOfNextWeekSunday = nextSunday.getDay();
  const differenceNextWeekSunday = 14 - dayOfNextWeekSunday; 
  nextSunday.setDate(nextSunday.getDate() + differenceNextWeekSunday);
  console.log(nextSunday)
  return nextSunday.toISOString().split("T")[0];
};
