class PerformanceCalculator {
  performance
  play

  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() {
    throw new Error('subclass responsibility')
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 4000

    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }

    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000

    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }

    result += 300 * this.performance.audience
    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay)
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay)
    default:
      throw new Error(`unknown type: ${aPlay.type}`)
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
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance),
    )

    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCreditsFor = calculator.volumeCredits
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount
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
        accumulator + aPerformance.volumeCreditsFor,
      0,
    )
  }
}
