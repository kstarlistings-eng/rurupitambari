import CustomInputField from "@/components/form/CustomInputField";
import PasswordInputField from "@/components/form/PasswordInputField";
import { useForm } from "react-hook-form";
import {
  LoginInputDefaultValues,
  loginSchema,
  type LoginInput,
} from "@/schema/login/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomCheckboxField from "@/components/form/CustomCheckBoxField";
import { Link, useNavigate } from "react-router";
import LoadingButton from "@/components/custom-ui/LoadingButton";
import BrandLogoImg from "@/assets/pitambariLogo.jpg"
import LogoBanner from "@/assets/loginbanner.png"
import { useMutation } from "@tanstack/react-query";
import { notify } from "@/components/toast/NotifyToast";
// import { BrandLogo } from "@/icons copy/BrandLogo";
import LoginLayout from "@/components/layout/login/LoginLayout";
import { useAuthStore } from "@/store/auth-store";


const ChairlyoLogin = () => {
  const handleSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };
  const { login } = useAuthStore();

  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      notify({
        variant: "success",
        message: "Login successful!",
        title: "Success",
      });
      navigate("/");
    },
    onError: () => {
      notify({
        variant: "error",
        message: "Login failed!",
        title: "Error",
      });
    },
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: LoginInputDefaultValues,
  });

  return (
    <LoginLayout>
      <LoginLayout.Container>
        <LoginLayout.LeftSection className="2xl:w-[41%] w-[480px] shrink-0 bg-neutral-100">
          <img
            src={LogoBanner}
            alt="Orbit Illustration"
            className="w-full h-full object-cover"
          />
        </LoginLayout.LeftSection>

        {/* Right Side - Login Form */}
        <LoginLayout.RightContainer>
          <LoginLayout.RightSection className="flex flex-col gap-[40px] max-w-[480px] -mt-40">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img src={BrandLogoImg} alt="Pitambari Logo" className="w-28 " />
              {/* <BrandLogo className="scale-[1.5]" /> */}
            </div>

            {/* Welcome Text */}
            <div>
              <h1 className="text-[30px] text-center font-semibold text-black mb-2 leading-tight">
                Welcome back to Ruru Pirambari
              </h1>
              <p className="text-neutral-700 text-center text-[14px] leading-[20px]">
                Sign in to access your dashboard and pick up right where you
                left off.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-6">
                  <CustomInputField
                    nameValue="email"
                    labelValue="Email"
                    placeholder="e.g. xyz@gmail.com"
                    type="email"
                    required
                  />

                  <PasswordInputField
                    nameValue="password"
                    labelValue="Password"
                    required
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center mt-4">
                  <CustomCheckboxField
                    nameValue="rememberMe"
                    labelValue="Remember me"
                    required={false}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary font-medium hover:text-primary-700"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  className="w-full mt-6"
                  variant="default"
                  loadingText="Logging in"
                  isLoading={loginMutation.isPending}
                >
                  Log in
                </LoadingButton>
              </form>
            </Form>
          </LoginLayout.RightSection>
        </LoginLayout.RightContainer>
      </LoginLayout.Container>
    </LoginLayout>
  );
};

export default ChairlyoLogin;
