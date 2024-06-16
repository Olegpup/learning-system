import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config.js'

export const transliterate = (text) => {
  return text.replace(/[А-Яа-яЁёЄєЇїІіЬь]/g, function (x) {
    const replacements = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e',
      ж: 'zh', з: 'z', и: 'i', і: 'i', ї: 'yi', й: 'y', к: 'k',
      л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's',
      т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
      щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', є: 'e'
    };
    const replaced = replacements[x.toLowerCase()];
    return replaced !== undefined ? replaced : '';
  })
}

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      fatherName: user.father_name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const sanitize = (str) => {
  return str.trim().replace(/\s+/g, '-')
}

