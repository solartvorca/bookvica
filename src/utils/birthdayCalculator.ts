export const calculateBirthdayRunes = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const sumDigits = (num: number): number => {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    return sum;
  };

  // Personality: sum of day digits
  let personalityNumber = sumDigits(day);

  // Destiny: sum of day + month
  let destinyNumber = sumDigits(day + month);

  // If > 49, subtract 49 or wrap around
  if (personalityNumber > 49) {
    personalityNumber = ((personalityNumber - 1) % 49) + 1;
  }
  if (destinyNumber > 49) {
    destinyNumber = ((destinyNumber - 1) % 49) + 1;
  }

  return {
    personalityNumber,
    destinyNumber,
  };
};

export const getCharacteristicDescription = (personalityNum: number, destinyNum: number): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Лидерство и инициатива',
    2: 'Дуальность и баланс',
    3: 'Творчество и созидание',
    4: 'Стабильность и основание',
    5: 'Свобода и изменения',
    6: 'Гармония и служение',
    7: 'Мудрость и глубина',
    8: 'Власть и материальность',
    9: 'Завершение и трансформация',
  };

  const sum = ((personalityNum + destinyNum - 2) % 9) + 1;
  return descriptions[sum] || 'Гармоничное развитие';
};
