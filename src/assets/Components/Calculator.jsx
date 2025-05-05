import React, { useState } from "react";
import "../Components/Calculator.css"

export default function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);
  const [currency, setCurrency] = useState("USD");
  const [monthlyEMI, setMonthlyEMI] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const format = (num) => `${parseFloat(num).toFixed(2)} ${currency}`;

  const calculateEMI = () => {
    const principal = parseFloat(amount);
    const monthlyRate = parseFloat(rate) / 100 / 12;
    const totalPayments = parseFloat(years) * 12;

    const x = Math.pow(1 + monthlyRate, totalPayments);
    const monthly = (principal * x * monthlyRate) / (x - 1);

    setMonthlyEMI(monthly.toFixed(2));

    let balance = principal;
    const scheduleArr = [];

    for (let i = 1; i <= totalPayments; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthly - interest;
      balance -= principalPaid;

      scheduleArr.push({month: i,principal: principalPaid,interest: interest,balance: balance > 0 ? balance : 0,});
    }

    setSchedule(scheduleArr);
  };

  const resetTable = () => {
    setMonthlyEMI(null);
    setSchedule([]);
  };

  return (
    <div className="loan-container">
      <h2>Loan Calculator Dashboard</h2>
      <div className="input-group">
        <label>Loan Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label>Interest Rate (%)</label>
        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />

        <label>Term (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />

        <button onClick={calculateEMI}>CALCULATE</button>
      </div>

      {monthlyEMI && (
        <>
          <h3>Monthly EMI: ${monthlyEMI}</h3>
          <div className="controls">
            <div>
              <label>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <button className="reset-btn" onClick={resetTable}>RESET TABLE</button>
          </div>
        </>
      )}

      {schedule.length > 0 && (
        <div className="schedule">
          <h4>Amortization Schedule ({currency})</h4>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{format(row.principal)}</td>
                  <td>{format(row.interest)}</td>
                  <td>{format(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
