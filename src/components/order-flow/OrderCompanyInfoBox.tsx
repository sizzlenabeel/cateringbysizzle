
import React from "react";

type Company = {
  name: string;
  organization_number: string;
  address: string;
  billing_email?: string;
};

export const OrderCompanyInfoBox = ({ company }: { company: Company }) => (
  <div className="mb-8 bg-orange-50 border border-orange-200 rounded p-4 flex flex-col md:flex-row items-center justify-between">
    <div>
      <div className="text-lg font-semibold text-orange-700">Company: {company.name}</div>
      <div className="text-sm text-gray-600">Org No: {company.organization_number}</div>
      <div className="text-sm text-gray-600">Address: {company.address}</div>
      {company.billing_email && (
        <div className="text-sm text-gray-600">Billing email: {company.billing_email}</div>
      )}
    </div>
  </div>
);
