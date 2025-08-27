export const generateTimeSlots = (start = '09:00', end = '17:00', interval = 30) => {
  const pad = (num) => (num < 10 ? `0${num}` : num);
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let slots = [];
  let currentH = startH;
  let currentM = startM;

  while (currentH < endH || (currentH === endH && currentM <= endM)) {
    const value = `${pad(currentH)}:${pad(currentM)}:00`; // 24-hour format
    const hour12 = currentH % 12 === 0 ? 12 : currentH % 12;
    const ampm = currentH < 12 ? 'AM' : 'PM';
    const label = `${hour12}:${pad(currentM)} ${ampm}`; // 12-hour format
    slots.push({ value, label });

    currentM += interval;
    if (currentM >= 60) {
      currentM -= 60;
      currentH += 1;
    }
  }

  if (end === '24:00') {
    slots.push({ value: '00:00', label: '00:00' });
  }

  return slots;
};

export const formatTimeLabel = (time) => {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minuteStr} ${ampm}`; // always show minutes
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
