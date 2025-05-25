// src/components/CreditsModal.js
import React, { useState, useEffect } from "react";
import { redeemCode, getCredits } from "../utils/credits";

export default function CreditsModal({ open, onClose, user, onCreditsChange }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showBuy, setShowBuy] = useState(false);
  const [buyAmount, setBuyAmount] = useState(100);

  useEffect(() => {
    if (user?.uid) {
      const txKey = `credit_tx_${user.uid}`;
      setTransactions(JSON.parse(localStorage.getItem(txKey) || "[]"));
    }
  }, [user, open, message]);

  if (!open) return null;

  const handleRedeem = () => {
    const uid = user?.uid;
    if (!uid) return;
    const creditsAdded = redeemCode(uid, code.trim());
    if (creditsAdded) {
      setMessage(`Success! Added ${creditsAdded} credits.`);
      if (onCreditsChange) onCreditsChange(getCredits(uid));
      // Log transaction
      const txKey = `credit_tx_${uid}`;
      const txs = JSON.parse(localStorage.getItem(txKey) || "[]");
      txs.unshift({ type: "Redeem", amount: creditsAdded, date: new Date().toISOString(), code: code.trim() });
      localStorage.setItem(txKey, JSON.stringify(txs));
      setTransactions(txs);
    } else {
      setMessage("Invalid or already used code.");
    }
    setCode("");
  };

  const handleBuy = () => {
    const uid = user?.uid;
    if (!uid || !buyAmount) return;
    // Add credits
    const prev = getCredits(uid);
    localStorage.setItem(`credits_${uid}`, prev + buyAmount);
    if (onCreditsChange) onCreditsChange(prev + buyAmount);
    // Log transaction
    const txKey = `credit_tx_${uid}`;
    const txs = JSON.parse(localStorage.getItem(txKey) || "[]");
    txs.unshift({ type: "Purchase", amount: buyAmount, date: new Date().toISOString() });
    localStorage.setItem(txKey, JSON.stringify(txs));
    setTransactions(txs);
    setMessage(`Purchased ${buyAmount} credits.`);
    setShowBuy(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-indigo-600">Credits & Transactions</h2>
        <div className="w-full mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Current Credits:</span>
            <span className="font-bold text-green-600">{getCredits(user?.uid)}</span>
          </div>
          <button className="bg-indigo-500 text-white px-3 py-1 rounded mb-2 w-full" onClick={() => setShowBuy(b => !b)}>
            {showBuy ? "Cancel" : "Buy Credits"}
          </button>
          {showBuy && (
            <div className="flex flex-col items-center mb-2 w-full">
              <input
                type="number"
                min={10}
                max={10000}
                value={buyAmount}
                onChange={e => setBuyAmount(Number(e.target.value))}
                className="w-full p-2 border rounded mb-2 text-center"
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2" onClick={handleBuy}>
                Purchase
              </button>
            </div>
          )}
          <div className="flex flex-col items-center mb-2 w-full">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter redeem code"
              className="w-full p-2 border rounded mb-2 text-center"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2" onClick={handleRedeem}>
              Redeem Code
            </button>
          </div>
          {message && <div className="text-sm text-center mb-2">{message}</div>}
        </div>
        <div className="w-full">
          <h3 className="font-semibold mb-1 text-indigo-700">Credit Transactions</h3>
          <div className="max-h-40 overflow-y-auto border rounded bg-gray-50 p-2 text-xs">
            {transactions.length === 0 ? (
              <div className="text-gray-400 text-center">No transactions yet.</div>
            ) : (
              <ul>
                {transactions.map((tx, i) => (
                  <li key={i} className="mb-1 flex justify-between items-center border-b last:border-b-0 pb-1">
                    <span className="font-medium text-gray-700">{tx.type}</span>
                    <span className={tx.type === "Purchase" ? "text-green-600" : "text-blue-600"}>+{tx.amount}</span>
                    <span className="text-gray-400">{new Date(tx.date).toLocaleString()}</span>
                    {tx.code && <span className="text-gray-400 ml-2">({tx.code})</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button className="text-gray-500 text-sm underline mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
