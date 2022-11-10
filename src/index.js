import plays from './seeders/plays.json' assert { type: 'json' }
import invoices from './seeders/invoices.json' assert { type: 'json' }

function statement(invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  for (let perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0)

    if ('comedy' === playFor(perf).type) {
      volumeCredits += Math.floor(perf.audience / 5)
    }

    result += `${playFor(perf).name}: ${amountFor(perf) / 100} (${
      perf.audience
    } seats)\n`

    totalAmount += amountFor(perf)
  }

  result += `Amount owed is ${totalAmount / 100}\n`
  result += `You earned ${volumeCredits} credits\n`

  return result

  function amountFor(aPerformance) {
    let result = 0

    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        break
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`)
    }

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

const result = statement(invoices, plays)

console.log(result)
