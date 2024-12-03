import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

export const accountSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptLegalPolicy: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
});

export type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, onBack, isLoading, error }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptLegalPolicy: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            {...register('firstName')}
            type="text"
            placeholder="First name"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <input
            {...register('lastName')}
            type="text"
            placeholder="Last name"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email address"
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center space-x-2">
        <input
          {...register('acceptLegalPolicy')}
          type="checkbox"
          className="w-4 h-4 rounded border-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-black"
        />
        <span className="text-sm text-zinc-400">
          I accept the terms and conditions
        </span>
      </label>
      {errors.acceptLegalPolicy && (
        <p className="text-red-500 text-xs">{errors.acceptLegalPolicy.message}</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 bg-zinc-800 text-white rounded-full text-sm hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default AccountForm;