export function formatDateString(date) {
  const dateF = new Date(date)

  const padZero = (value) => (value < 10 ? `0${value}` : value)

  const day = padZero(dateF.getDate())
  const month = padZero(dateF.getMonth() + 1)
  const year = dateF.getFullYear()
  const hours = padZero(dateF.getHours())
  const minutes = padZero(dateF.getMinutes())

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
