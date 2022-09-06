export default (date: string) => {
  const today = new Date();
  const birthday = new Date(date);

  const todayDay = today.getDate();
  const todayMonth = today.getMonth();

  const birthdayDay = birthday.getDate();
  const birthdayMonth = birthday.getMonth();

  return todayDay === birthdayDay && todayMonth === birthdayMonth;
};
