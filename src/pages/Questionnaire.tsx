import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ESTABLISHMENT_CAPACITIES = ['50 persons', '100 persons', '200 persons', '500+ persons'];
const SPORTS = ['Football', 'Basketball', 'Tennis', 'Rugby', 'MMA'];
const FREQUENCIES = ['1 / week', '2 / week', '3 / week', 'More'];
const BUDGETS = ['50€ / month', '100€ / month', '200€ / month', '500€+ / month'];
const OBJECTIVES = [
  'Increase Attendance During Matches',
  'Improve Social Media Presence',
  'Attract New Customers',
  'Build Customer Loyalty'
];
const DEVICES = ['Cellphone', 'Tablet', 'Computer', 'All Devices'];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState('');
  const [sport, setSport] = useState('');
  const [frequency, setFrequency] = useState('');
  const [budget, setBudget] = useState('');
  const [objective, setObjective] = useState('');
  const [device, setDevice] = useState('');
  const [comments, setComments] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate('/favorites');
  };

  const SelectField = ({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
  }) => (
    <div className="space-y-2">
      <label className="block text-sm text-zinc-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout variant="medium">
      <div className="flex-1 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <img src="/logo.svg" alt="AM Sports" className="w-12 h-12 mb-8" />

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wider text-white mb-2">CREATE AN ACCOUNT</h1>
          <p className="text-zinc-400 mb-6">Help us tailor your experience with a few quick questions.</p>

          {/* Form */}
          <form className="space-y-6">
            {/* Two-column grid for select fields */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Establishment capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                options={ESTABLISHMENT_CAPACITIES}
              />

              <SelectField
                label="Preferred Sports"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                options={SPORTS}
              />

              <SelectField
                label="Frequency of Broadcasts"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                options={FREQUENCIES}
              />

              <SelectField
                label="Monthly Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                options={BUDGETS}
              />

              <SelectField
                label="Main Objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                options={OBJECTIVES}
              />

              <SelectField
                label="Devices Used"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                options={DEVICES}
              />
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="block text-sm text-zinc-400">Comments or Specific Needs</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write here..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Questionnaire;