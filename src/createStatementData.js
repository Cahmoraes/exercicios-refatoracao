class PerformanceCalculator {
  aPerformance
  play

  constructor(aPerformance, aPlay) {
    this.aPerformance = aPerformance
    this.play = aPlay
  }
}

export function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance),
    )
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = amountFor(result)
    result.volumeCreditsFor = volumeCreditsFor(result)
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    let result = 0

    switch (aPerformance.play.type) {
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

  function volumeCreditsFor(aPerformance) {
    let result = Math.max(aPerformance.audience - 30, 0)

    if ('comedy' === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5)
    }

    return result
  }

  function totalAmount(data) {
    return data.performances.reduce(
      (accumulator, aPerformance) => accumulator + aPerformance.amount,
      0,
    )
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce(
      (accumulator, aPerformance) =>
        accumulator.volumeCreditsFor + aPerformance,
      0,
    )
  }
}
