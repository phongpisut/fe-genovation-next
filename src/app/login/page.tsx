'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setAuthCookies } from '@/lib/supabaseClient';
import { loginSchema, LoginSchemaType } from '@/schema/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchemaType) {
    const { email, password } = data;
    axios
      .post('/api/auth', { email, password })
      .then(async (response) => {
        const { session } = response.data;
        await setAuthCookies(session?.access_token, session?.refresh_token);
        router.replace('/');
      })
      .catch(() => {
        setError('validate', {
          message: 'Invalid email or password',
          type: 'validate',
        });
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center h-[calc(100vh-30px)] items-end sm:items-center bg-linear-to-t from-sky-500 to-indigo-500 relative">
      <motion.div
        id="login-form-loader"
        className="w-screen h-full absolute bg-white self-end"
        initial={{ height: '100%' }}
        animate={{ height: '0%' }}
        transition={{ delay: 1 }}
        onAnimationComplete={() => {
          const element = document.getElementById('login-form-loader');
          if (element) element.style.display = 'none';
        }}
      />
      <div className="bg-slate-50 shadow-lg sm:shadow-md w-full sm:w-lg h-[80%] rounded-t-md  sm:h-fit p-10 sm:rounded-md text-gray-800 gap-y-2 flex flex-col">
        <Input
          className="bg-slate-50"
          type="email"
          placeholder="Email"
          required
          id="email"
          onFocus={() => clearErrors('validate')}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <Input
          className="bg-slate-50"
          type="password"
          placeholder="Password"
          required
          id="password"
          onFocus={() => clearErrors('validate')}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <Button
          className="bg-blue-500 text-white hover:scale-95 transition-all active:scale-90 cursor-pointer active:bg-slate-400 active:text-white "
          type="submit">
          Login
        </Button>
        {errors.validate && (
          <p className="text-red-500 text-sm">{errors.validate.message}</p>
        )}
      </div>
    </form>
  );
}
