export default (date: string) => {
  const today = new Date();
  const birthday = new Date(date);

  const todayDay = today.getDay();
  const todayMonth = today.getMonth();

  const birthdayDay = birthday.getDay();
  const birthdayMonth = birthday.getMonth();
  
  return todayDay === birthdayDay && todayMonth === birthdayMonth;
}
