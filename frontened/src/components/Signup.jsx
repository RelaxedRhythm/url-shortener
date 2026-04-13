import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
// import { z } from "zod";

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

import {signupSchema} from "@/lib/schema/signup";
import { useState } from "react";
import { signupUser } from "@/api/auth";


export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const result = await signupUser(data);
      if(result.success){
        alert("Signup successful! Please login.");
        // Redirect to login
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <CardHeader className="text-3xl font-bold text-center mb-6">Sign Up</CardHeader>
        {error && <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Input {...register("name")} placeholder="Enter Name" />
            </FieldContent>
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input {...register("email")} placeholder="Enter email" />
            </FieldContent>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldContent>
            <Input type="password" {...register("password")} placeholder="Enter password" />
          </FieldContent>
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

          <Button type="submit" className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Log in</Link></p>
        </div>
      </Card>
    </div>
  );
}
