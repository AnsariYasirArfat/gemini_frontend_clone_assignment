"use client";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import getCountryDialingCodes, {
  Country,
} from "@/services/getCountryDialingCodes";
import { CountrySelect } from "@/components/Auth/CountrySelect";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/store/reducers/authSlice";

// Define schemas
const baseSchema = z.object({
  country: z
    .string("Country code is required")
    .min(1, "Country code is required"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers")
    .min(5, "Phone number must be at least 5 digits"),
});

const otpSchema = baseSchema.extend({
  otp: z
    .string()
    .nonempty("OTP is required")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .length(6, "OTP must be 6 digits"),
});

type LoginForm = z.infer<typeof baseSchema> & { otp?: string };

export default function LoginPage() {
  const [auth, setAuth] = useLocalStorage("auth", {
    isAuthenticated: false,
    phone: "",
    country: "",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [countryError, setCountryError] = useState<string | null>(null);

  const currentSchema = otpSent ? otpSchema : baseSchema;

  const form = useForm<LoginForm>({
    resolver: zodResolver(currentSchema),
    defaultValues: { country: "", phone: "", otp: "" },
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/");
    } else {
      getCountryDialingCodes()
        .then((data) => {
          setCountries(
            data.filter(
              (c) => c.idd.root && c.idd.suffixes && c.idd.suffixes.length > 0
            )
          );
          setCountryLoading(false);
        })
        .catch(() => {
          setCountryError("Failed to load country codes.");
          setCountryLoading(false);
        });
    }
  }, [auth, router]);

  useEffect(() => {
    if (!otpSent) {
      form.setValue("otp", "");
      form.clearErrors("otp");
    }
  }, [otpSent, form]);

  const handleSendOtp = (country: string, phone: string) => {
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.success(`OTP sent to ${country}${phone}!`);
    }, 1000);
  };

  const onSubmit = (data: LoginForm) => {
    setLoading(true);

    if (!otpSent) {
      handleSendOtp(data.country, data.phone);
      return;
    }
    // Simulate verifying OTP
    setTimeout(() => {
      const userData={
        isAuthenticated: true,
        phone: data.phone,
        country: data.country,
      }
      setAuth(userData);
      dispatch(login(userData));
      setLoading(false);
      toast.success("Login successful!");
      router.replace("/");
    }, 1200);
  };

  const handleBack = () => {
    setOtpSent(false);
    form.setValue("otp", "");
    form.clearErrors("otp");
  };

  const showError = (field: keyof LoginForm) =>
    form.formState.errors[field]?.message && (
      <p className="text-sm text-red-500 mt-1">
        {form.formState.errors[field]?.message}
      </p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 p-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Login with OTP
        </h1>
        {countryLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : countryError ? (
          <div className="text-red-500 text-center">{countryError}</div>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 transition-all duration-300"
          >
            {!otpSent ? (
              <>
                <div>
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Country Code
                  </Label>
                  <Controller
                    name="country"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <CountrySelect
                        countries={countries}
                        value={value ?? ""}
                        onChange={onChange}
                        disabled={loading}
                      />
                    )}
                  />
                  {showError("country")}
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    disabled={loading}
                    placeholder="Enter your phone number"
                    className="mt-1 h-12"
                    aria-invalid={!!form.formState.errors.phone}
                  />
                  {showError("phone")}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center animate-in fade-in duration-300">
                <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                  Enter OTP sent to{" "}
                  <span className="font-bold">
                    {form.getValues("country")}
                    {form.getValues("phone")}
                  </span>
                </p>
                <div className="w-full">
                  <Label
                    htmlFor="otp"
                    className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    OTP
                  </Label>
                  <Controller
                    name="otp"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <InputOTP
                        maxLength={6}
                        value={value ?? ""}
                        onChange={onChange}
                        className="mt-1 w-full"
                        aria-label="Enter OTP"
                      >
                        <InputOTPGroup className="w-full">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              inputMode="numeric"
                              className="flex-1 h-12"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                  {showError("otp")}
                </div>
              </div>
            )}
            <div className="flex space-x-4">
              {otpSent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="w-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full",
                  otpSent ? "w-1/2" : "w-full",
                  "bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    {otpSent ? "Verifying..." : "Sending..."}
                  </span>
                ) : otpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
