import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BUSINESS_TYPES = ['Bar', 'Restaurant', 'Chicha', 'Club', 'Pub'];

export const businessSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  raisonSociale: z.string().min(2, 'Raison sociale is required')
});

export type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onSubmit, onBack, isLoading, error }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      address: '',
      phone: '',
      raisonSociale: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          {...register('businessName')}
          type="text"
          placeholder="Business name"
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          {...register('businessType')}
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select type of business</option>
          {BUSINESS_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {(errors.businessName || errors.businessType) && (
        <div className="grid grid-cols-2 gap-4">
          {errors.businessName && (
            <p className="text-red-500 text-xs">{errors.businessName.message}</p>
          )}
          {errors.businessType && (
            <p className="text-red-500 text-xs">{errors.businessType.message}</p>
          )}
        </div>
      )}

      <input
        {...register('address')}
        type="text"
        placeholder="Address"
        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.address && (
        <p className="text-red-500 text-xs">{errors.address.message}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <input
          {...register('phone')}
          type="tel"
          placeholder="Phone number"
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          {...register('raisonSociale')}
          type="text"
          placeholder="Raison Sociale"
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {(errors.phone || errors.raisonSociale) && (
        <div className="grid grid-cols-2 gap-4">
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
          {errors.raisonSociale && (
            <p className="text-red-500 text-xs">{errors.raisonSociale.message}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-12 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessForm;