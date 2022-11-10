import plays from './seeders/plays.json' assert { type: 'json' }
import invoices from './seeders/invoices.json' assert { type: 'json' }

function statement(invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  for (let perf of invoice.performances) {
    const play = plays[perf.playID]
    let thisAmount = amountFor(perf, play)

    volumeCredits += Math.max(perf.audience - 30, 0)

    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5)

    result += `${play.name}: ${thisAmount / 100} (${perf.audience} seats)\n`

    totalAmount += thisAmount
  }

  result += `Amount owed is ${totalAmount / 100}\n`
  result += `You earned ${volumeCredits} credits\n`
  return result

  function amountFor(perf, play) {
    let result = 0

    switch (play.type) {
      case 'tragedy':
        result = 40000
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20)
        }
        break
      default:
        throw new Error(`unknown type: ${play.type}`)
    }

    return result
  }
}

const result = statement(invoices, plays)

console.log(result)
