// src/components/profile/InsuranceCard.jsx
import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import './InsuranceCard.css';

export const InsuranceCard = ({ provider = "MetLife Health Premier", policyNo = "POL-9842-771", groupNo = "GRP-0912", validTill = "12/2028" }) => {
  return (
    <div className="insurance-card">
      <div className="card-top">
        <div className="card-logo">
          <ShieldCheck size={24} color="#ffffff" />
          <span>CareCircle Pass</span>
        </div>
        <CreditCard size={24} color="#ffffff" />
      </div>

      <div className="card-mid">
        <span className="card-label">Health Insurance Provider</span>
        <h4 className="card-provider">{provider}</h4>
      </div>

      <div className="card-bottom">
        <div>
          <span className="card-label">Policy Number</span>
          <p className="card-val">{policyNo}</p>
        </div>
        <div>
          <span className="card-label">Group ID</span>
          <p className="card-val">{groupNo}</p>
        </div>
        <div>
          <span className="card-label">Expires</span>
          <p className="card-val">{validTill}</p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
