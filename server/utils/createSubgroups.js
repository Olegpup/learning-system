export function createSubgroups(students, k, a, b) {
  const M = []
  const S = Array.from({ length: k }, () => [])
  const B = Array.from({ length: k }, () => 0)
  const C = Array.from({ length: k }, () => [])

  students.forEach((student) => {
    if (student.grades.length > 0) {
      M.push(student.grades.reduce((acc, curr) => acc + curr, 0) / student.grades.length)
    } else {
      M.push((a + b) / 2)
    }
  })

  M.forEach((avg, i) => {
    const l = B.indexOf(Math.min(...B))
    S[l].push(students[i].studentId)
    C[l].push(avg)
    B[l] = C[l].reduce((acc, curr) => acc + curr, 0)
  })


  return S
}
