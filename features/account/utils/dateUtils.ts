interface AccountTransaction {
  id: number
  type: string
  description: string
  amount: number
  date: string
  time: string
  from: string
  to: string
  color: string
  category: string
  categoryIcon?: string
  balanceAfterTransaction?: number
}

export interface GroupedAccountTransactions {
  date: string
  displayDate: string
  transactions: AccountTransaction[]
}

export function groupAccountTransactionsByDate(transactions: AccountTransaction[]): GroupedAccountTransactions[] {
  const grouped = transactions.reduce((acc, transaction) => {
    const dateKey = transaction.date
    const displayDate = formatDisplayDate(transaction.date)
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        displayDate,
        transactions: []
      }
    }
    
    acc[dateKey].transactions.push(transaction)
    return acc
  }, {} as Record<string, GroupedAccountTransactions>)

  // 각 그룹 내에서 거래내역을 시간순으로 정렬 (최신 시간이 위로)
  Object.values(grouped).forEach(group => {
    group.transactions.sort((a, b) => {
      const timeA = a.time || "00:00:00"
      const timeB = b.time || "00:00:00"
      return timeB.localeCompare(timeA)
    })
  })

  // 날짜별로 정렬 (최신 날짜가 위로)
  return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // 날짜 비교를 위해 시간 정보 제거
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "오늘"
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "어제"
  } else {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
    const weekday = weekdays[date.getDay()]
    return `${month}월 ${day}일 ${weekday}요일`
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) return ""
  
  // 시간 형식에서 시간만 추출
  const time = timeString.split(":")
  if (time.length >= 2) {
    return `${time[0]}:${time[1]}`
  }
  
  return timeString
}
