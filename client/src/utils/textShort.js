export const textShort = (description, length) => {
  if (description) {
    return description.length > length ? description.substring(0, length - 3) + '...' : description
  }
  return ''
}
